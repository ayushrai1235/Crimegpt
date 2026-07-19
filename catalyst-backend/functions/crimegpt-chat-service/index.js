const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Pinecone } = require('@pinecone-database/pinecone');
const catalyst = require('zcatalyst-sdk-node');

require('dotenv').config({ path: 'E:\\Ksp datathon\\catalyst-backend\\.env' });

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
const pc = new Pinecone({ apiKey: process.env.VECTOR_DB_API_KEY });
const index = pc.index(process.env.VECTOR_DB_INDEX_NAME || 'crimegpt-index');

app.post('/chat', async (req, res) => {
    try {
        const { query, history = [], language = 'en' } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required.' });
        }

        // 1. Try RAG: embed query → search Pinecone → get context
        let contextDocs = '';
        let citations = [];

        try {
            const embeddingResult = await genAI
                .getGenerativeModel({ model: 'gemini-embedding-001' })
                .embedContent(query);
            const queryEmbedding = embeddingResult.embedding.values;

            const searchResults = await index.query({
                vector: queryEmbedding,
                topK: 5,
                includeMetadata: true
            });

            if (searchResults.matches && searchResults.matches.length > 0) {
                contextDocs = searchResults.matches
                    .map(match => match.metadata?.text || JSON.stringify(match.metadata))
                    .join('\n\n');
                citations = searchResults.matches.map(m => m.metadata);
            }
        } catch (ragError) {
            console.warn('RAG pipeline unavailable (Pinecone/Embedding), falling back to direct LLM:', ragError.message);
        }

        // 2. System Prompt — adapts based on whether RAG context is available
        const hasContext = contextDocs.length > 0;
        let systemInstruction = hasContext
            ? `You are CrimeGPT, an advanced AI investigator for the Karnataka State Police.
You must base your answer ONLY on the provided Context below.
Zero Hallucination Policy: Do not make up facts.
Always cite the source using the format [FIR_ID] at the end of relevant sentences.
Respond in ${language === 'kn' ? 'Kannada' : 'English'}.
If the user asks follow-up questions, use the conversation history to maintain context.

Context Evidence:
${contextDocs}`
            : `You are CrimeGPT, an advanced AI investigator for the Karnataka State Police.
You are a demo system. The vector database is not yet populated with live FIR records.
Answer the user's question using your general knowledge about Indian criminal law, Karnataka Police procedures, FIR processes, and crime analysis.
Be helpful and informative, but clearly state that you are providing general guidance and not referencing actual FIR records.
Respond in ${language === 'kn' ? 'Kannada' : 'English'}.`;

        // 3. Format conversation history for Gemini
        const chatModel = genAI.getGenerativeModel({ 
            model: process.env.LLM_MODEL || 'gemini-2.0-flash',
            systemInstruction: systemInstruction 
        });

        const formattedHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const chat = chatModel.startChat({
            history: formattedHistory
        });

        // 4. Generate Response
        const result = await chat.sendMessage(query);
        const reply = result.response.text();

        res.json({
            reply: reply,
            citations: citations
        });

    } catch (error) {
        console.error('Chat Service Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.post('/seed-db', async (req, res) => {
    try {
        const catApp = catalyst.initialize(req);
        const datastore = catApp.datastore();

        const mockCases = [
            {
                CrimeNo: "FIR-2023-001",
                CaseNo: "CASE-BLR-001",
                BriefFacts: "Accused broke into the victim's house at night and stole jewelry.",
                latitude: 12.9716,
                longitude: 77.5946
            },
            {
                CrimeNo: "FIR-2023-002",
                CaseNo: "CASE-BLR-002",
                BriefFacts: "A cyber fraud incident where the victim lost money via a fake payment link.",
                latitude: 12.9352,
                longitude: 77.6245
            }
        ];
        
        const mockAccused = [
            { AccusedName: "Raju", AgeYear: 34, PersonID: "PER-00491" },
            { AccusedName: "Sunil", AgeYear: 28, PersonID: "PER-00502" }
        ];

        const mockVictims = [
            { VictimName: "Anil Kumar", AgeYear: 45 },
            { VictimName: "Priya Singh", AgeYear: 32 }
        ];

        console.log("Seeding Database...");
        
        // Insert Cases
        for (const data of mockCases) {
            await datastore.table('CaseMaster').insertRow(data);
        }
        // Insert Accused
        for (const data of mockAccused) {
            await datastore.table('Accused').insertRow(data);
        }
        // Insert Victims
        for (const data of mockVictims) {
            await datastore.table('Victim').insertRow(data);
        }

        res.json({ message: "Successfully seeded the Catalyst Database!" });
    } catch (error) {
        console.error("Seeding Error:", error);
        res.status(500).json({ error: "Failed to seed DB", details: error.message });
    }
});

if (require.main === module) {
    const port = process.env.CHAT_PORT || 3001;
    app.listen(port, () => {
        console.log(`crimegpt-chat-service listening on port ${port}`);
    });
}

module.exports = app;


