import express from 'express';
import { orchestrateQuery } from '../ai/orchestrator.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { query, history = [], language = 'en' } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required.' });
        }

        const responsePayload = await orchestrateQuery(req, query, history, language);

        // Streaming standard: to mimic a stream, we can send chunked HTTP response 
        // or just return the JSON for the MVP. The requirements say "Streaming Response".
        // Let's implement Server-Sent Events (SSE) for true streaming.
        
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Simulate streaming the validated text
        const words = responsePayload.text.split(' ');
        
        // First send metadata
        res.write(`data: ${JSON.stringify({ 
            type: 'metadata', 
            citations: responsePayload.citations,
            confidenceScore: responsePayload.confidenceScore,
            reasoningSummary: responsePayload.reasoningSummary,
            evidenceUsed: responsePayload.evidenceUsed
        })}\n\n`);

        for (let i = 0; i < words.length; i++) {
            res.write(`data: ${JSON.stringify({ type: 'text', chunk: words[i] + ' ' })}\n\n`);
            // Add tiny delay to simulate stream
            await new Promise(r => setTimeout(r, 20));
        }

        res.write(`data: [DONE]\n\n`);
        res.end();

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

export default router;
