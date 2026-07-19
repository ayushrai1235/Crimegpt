import express from 'express';
import multer from 'multer';
import { extractEntitiesFromFIR, generateEmbedding } from '../ai/gemini.js';
import { getDB } from '../datastore/db.js';
import { upsertVector } from '../vector/pinecone.js';
import { insertCaseGraph } from '../graph/neo4j.js';
// Note: Normally we'd use catalyst file store to save the PDF. 
// For MVP, we'll extract text from PDF/buffer directly. We can mock PDF parsing or assume text is provided.
// Since multer gives us a buffer, we would parse it with pdf-parse.

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('fir_document'), async (req, res) => {
    try {
        if (!req.file && !req.body.text) {
            return res.status(400).json({ error: 'Please upload a PDF file or provide text.' });
        }

        // Mock PDF parsing for now, fallback to provided text
        let firText = req.body.text || req.file.buffer.toString('utf-8');

        // 1. OCR & Entity Extraction Pipeline
        console.log("[Upload] Extracting entities via Gemini 1.5 Pro...");
        const extractedData = await extractEntitiesFromFIR(firText);

        if (!extractedData || !extractedData.CrimeNo) {
            return res.status(500).json({ error: 'Failed to extract valid entities from document.' });
        }

        // 2. Catalyst Data Store Insertion
        console.log("[Upload] Storing metadata in Catalyst Data Store...");
        const db = getDB(req);
        await db.insertRecord('CaseMaster', {
            CrimeNo: extractedData.CrimeNo,
            BriefFacts: extractedData.BriefFacts,
            CrimeRegisteredDate: new Date().toISOString().split('T')[0] // Mock date
        });

        // 3. Pinecone Vector Upsert
        console.log("[Upload] Upserting to Pinecone Vector DB...");
        const embedding = await generateEmbedding(extractedData.BriefFacts);
        await upsertVector(extractedData.CrimeNo, embedding, {
            CrimeNo: extractedData.CrimeNo,
            text: extractedData.BriefFacts
        });

        // 4. Neo4j Graph Update
        console.log("[Upload] Updating Neo4j Knowledge Graph...");
        await insertCaseGraph(
            { CrimeNo: extractedData.CrimeNo, BriefFacts: extractedData.BriefFacts },
            extractedData.Accused || [],
            extractedData.Victims || []
        );

        res.json({
            message: 'FIR uploaded and processed successfully.',
            extractedData
        });

    } catch (error) {
        console.error('Upload API Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

export default router;
