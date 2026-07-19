import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Setup env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import chatRoutes from './routes/chat.js';
import uploadRoutes from './routes/upload.js';
import graphRoutes from './routes/graph.js';
import analyticsRoutes from './routes/analytics.js';
import predictionRoutes from './routes/prediction.js';
import reportsRoutes from './routes/reports.js';

const app = express();
app.use(cors());
app.use(express.json());

// Register Routes
app.use('/chat', chatRoutes);
app.use('/upload', uploadRoutes);
app.use('/graph', graphRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/prediction', predictionRoutes);
app.use('/reports', reportsRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: 'CrimeGPT API Module is running' });
});

// Catalyst entry point
const isMain = process.argv[1] === __filename;
if (isMain) {
    const port = process.env.API_PORT || 3001;
    app.listen(port, () => {
        console.log(`crimegpt-api listening on port ${port}`);
    });
}

export default app;
