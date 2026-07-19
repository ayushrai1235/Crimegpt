import { getChatModel, generateEmbedding } from './gemini.js';
import { queryVector } from '../vector/pinecone.js';
import { executeCypher } from '../graph/neo4j.js';
import { getDB } from '../datastore/db.js';

/**
 * Validates the LLM response to ensure citations [FIR_ID] match the retrieved evidence.
 * Basic regex check to prevent hallucinations.
 */
const validateEvidence = (response, contextDocs) => {
    const citationRegex = /\[(.*?)\]/g;
    const matches = response.match(citationRegex);
    let isValid = true;
    let fallbackResponse = response;

    if (matches) {
        matches.forEach(match => {
            const citedId = match.replace('[', '').replace(']', '').trim();
            // Check if cited ID exists in context docs
            const contextString = JSON.stringify(contextDocs);
            if (!contextString.includes(citedId)) {
                console.warn(`Hallucination detected: Cited ${citedId} not found in evidence.`);
                isValid = false;
                // Redact unverified claim
                fallbackResponse = fallbackResponse.replace(match, '[UNVERIFIED CLAIM REDACTED]');
            }
        });
    }
    return { isValid, finalResponse: fallbackResponse };
};

/**
 * AI Orchestrator Pipeline
 */
export const orchestrateQuery = async (req, query, history = [], language = 'en') => {
    // 1. Intent Detection & Tool Selection
    const intentModel = getChatModel(`You are an intent router. Classify the user query into one of the following categories:
    - 'SIMILARITY': User is looking for similar cases or MO (Modus Operandi)
    - 'NETWORK': User is asking about connections, syndicates, relationships, or multiple actors
    - 'STATS': User is asking for aggregate data, rankings, or counts
    - 'GENERAL': General law or investigative questions
    
    Output ONLY the category name.`);
    
    const intentResult = await intentModel.generateContent(query);
    const intent = intentResult.response.text().trim().toUpperCase();
    console.log(`[Orchestrator] Detected Intent: ${intent}`);

    let contextDocs = [];
    let citations = [];

    // 2. Data Retrieval Phase
    try {
        if (intent.includes('SIMILARITY') || intent.includes('GENERAL')) {
            // Pinecone Retrieval
            console.log(`[Orchestrator] Querying Pinecone for similar cases...`);
            const embedding = await generateEmbedding(query);
            const vectorResults = await queryVector(embedding, 5);
            
            if (vectorResults.matches && vectorResults.matches.length > 0) {
                contextDocs = vectorResults.matches.map(m => m.metadata);
                citations = contextDocs.map(c => c.CrimeNo || c.id).filter(Boolean);
            }
        } 
        else if (intent.includes('NETWORK')) {
            // Neo4j Query
            console.log(`[Orchestrator] Querying Neo4j for network connections...`);
            // Basic fallback query to find nodes matching terms
            const cypher = `
                MATCH (n)-[r]-(m)
                WHERE toLower(n.name) CONTAINS toLower($term) OR toLower(n.personId) CONTAINS toLower($term)
                RETURN n, r, m LIMIT 10
            `;
            // Simplified term extraction (in reality, extract specific named entities)
            const terms = query.split(' ').filter(w => w.length > 4);
            const term = terms.length > 0 ? terms[0] : '';
            const graphResults = await executeCypher(cypher, { term });
            contextDocs = graphResults;
        }
        else if (intent.includes('STATS')) {
            // Catalyst Data Store Query
            console.log(`[Orchestrator] Querying Catalyst Data Store for stats...`);
            const db = getDB(req);
            const stats = await db.query('SELECT CaseCategoryID, COUNT(CaseMasterID) FROM CaseMaster GROUP BY CaseCategoryID');
            contextDocs = stats;
        }
    } catch (e) {
        console.error(`[Orchestrator] Data retrieval error:`, e);
    }

    // 3. System Prompt Construction
    const systemInstruction = `You are CrimeGPT, an AI investigator Copilot.
You must base your answer ONLY on the provided Context below.
Zero Hallucination Policy: Do not make up facts.
Always cite the source using the format [CrimeNo] or [ID] at the end of relevant sentences.
Provide your reasoning summary at the beginning.
Respond in ${language === 'kn' ? 'Kannada' : 'English'}.

Context Evidence:
${JSON.stringify(contextDocs, null, 2)}`;

    // 4. Gemini Reasoning (Streaming)
    const chatModel = getChatModel(systemInstruction);
    const formattedHistory = history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    const chat = chatModel.startChat({ history: formattedHistory });
    
    // We return the raw stream so the route handler can stream it to the client, 
    // along with the validation mechanism applied on the chunks/full response.
    // For simplicity in streaming with validation, we'll get the full response, validate, 
    // and then mock stream it to the client in the route.
    
    // Non-streaming generation for validation:
    const result = await chat.sendMessage(query);
    const rawResponse = result.response.text();

    // 5. Evidence Validation
    const { isValid, finalResponse } = validateEvidence(rawResponse, contextDocs);

    // 6. Return standard structured response
    return {
        text: finalResponse,
        citations,
        relatedCases: contextDocs.filter(c => c.CrimeNo),
        confidenceScore: isValid ? 0.95 : 0.60,
        reasoningSummary: `Intent detected as ${intent}. Retrieved ${contextDocs.length} evidence artifacts.`,
        evidenceUsed: contextDocs
    };
};
