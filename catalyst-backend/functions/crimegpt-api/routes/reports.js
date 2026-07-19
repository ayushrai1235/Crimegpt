import express from 'express';
import { orchestrateQuery } from '../ai/orchestrator.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
    try {
        const { query, history = [], format = 'markdown' } = req.body;

        // Instead of streaming, we just get the full response text. 
        // We override the language to English for official reports.
        const responsePayload = await orchestrateQuery(req, query, history, 'en');

        // For MVP, we'll return markdown. The frontend (Next.js) will use jsPDF to convert it to a PDF blob.
        // Doing PDF generation on the frontend saves backend compute.
        
        const reportMarkdown = `
# Investigation Report
**Generated On**: ${new Date().toLocaleString()}
**Confidence Score**: ${(responsePayload.confidenceScore * 100).toFixed(0)}%

## Summary
${responsePayload.text}

## Evidence Citations
${responsePayload.citations.map(c => `- ${c}`).join('\n')}

**Note**: This report is AI-generated and must be manually reviewed before official filing.
        `;

        res.json({ report: reportMarkdown });

    } catch (error) {
        console.error('Report API Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

export default router;
