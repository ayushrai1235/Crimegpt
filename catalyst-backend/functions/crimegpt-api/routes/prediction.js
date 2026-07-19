import express from 'express';

const router = express.Router();

router.get('/hotspots', async (req, res) => {
    try {
        // Mocking the predictive hotspot algorithm based on temporal patterns
        // In a real scenario, this queries the prediction module and historic FIR timestamps
        
        const predictedHotspots = [
            {
                latitude: 12.9716,
                longitude: 77.5946,
                intensity: 0.85,
                reasoning: "High frequency of cyber fraud reported in this cluster over the last 72 hours."
            },
            {
                latitude: 12.9352,
                longitude: 77.6245,
                intensity: 0.65,
                reasoning: "Emerging pattern of vehicle thefts matching historical Friday night trends."
            }
        ];

        res.json({ hotspots: predictedHotspots });
    } catch (error) {
        console.error('Prediction API Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

export default router;
