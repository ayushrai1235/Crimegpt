const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Pinecone } = require('@pinecone-database/pinecone');

if (process.env.ZOHO_CATALYST_ENVIRONMENT === 'Development') {
    require('dotenv').config();
}

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

        // 1. Generate Embedding for the current query
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const embeddingResult = await embeddingModel.embedContent(query);
        const queryEmbedding = embeddingResult.embedding.values;

        // 2. Query Pinecone for relevant evidence (FIRs)
        const searchResults = await index.query({
            vector: queryEmbedding,
            topK: 5,
            includeMetadata: true
        });

        const contextDocs = searchResults.matches.map(match => match.metadata.text).join('\n\n');
        
        // 3. System Prompt enforcing citations, language, and context
        let systemInstruction = `You are CrimeGPT, an advanced AI investigator for the Karnataka State Police.
        You must base your answer ONLY on the provided Context below. 
        Zero Hallucination Policy: Do not make up facts. 
        Always cite the source using the format [FIR_ID] at the end of relevant sentences.
        Respond in ${language === 'kn' ? 'Kannada' : 'English'}.
        If the user asks follow-up questions, use the conversation history to maintain context.
        
        Context Evidence:
        ${contextDocs}`;

        // 4. Format conversation history for Gemini
        const chatModel = genAI.getGenerativeModel({ 
            model: process.env.LLM_MODEL || 'gemini-3.5-flash',
            systemInstruction: systemInstruction 
        });

        const formattedHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const chat = chatModel.startChat({
            history: formattedHistory
        });

        // 5. Generate Response
        const result = await chat.sendMessage(query);
        const reply = result.response.text();

        res.json({
            reply: reply,
            citations: searchResults.matches.map(m => m.metadata)
        });

    } catch (error) {
        console.error('Chat Service Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = app;
