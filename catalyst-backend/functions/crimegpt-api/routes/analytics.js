import express from 'express';
import { getDB } from '../datastore/db.js';
import catalyst from 'zcatalyst-sdk-node';

const router = express.Router();

router.get('/dashboard', async (req, res) => {
    try {
        const catApp = catalyst.initialize(req);
        const cache = catApp.cache();
        const segment = cache.segment();

        // Check cache first
        try {
            const cachedData = await segment.getValue('analytics_dashboard');
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
        } catch (e) {
            // Cache miss
        }

        const db = getDB(req);
        
        // Mocked aggregation for MVP since ZCQL aggregations might be limited or require specific syntax
        const cases = await db.query('SELECT CaseCategoryID, latitude, longitude FROM CaseMaster');
        
        const categoryCount = {};
        const heatMapPoints = [];

        cases.forEach(c => {
            const row = c.CaseMaster;
            const cat = row.CaseCategoryID || 'Other';
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            if (row.latitude && row.longitude) {
                heatMapPoints.push([parseFloat(row.longitude), parseFloat(row.latitude)]);
            }
        });

        // Format for ECharts
        const eChartsCategoryData = Object.keys(categoryCount).map(k => ({
            name: `Category ${k}`,
            value: categoryCount[k]
        }));

        const payload = {
            todaysFIRs: cases.length,
            crimeDistribution: eChartsCategoryData,
            heatMapPoints,
            districtRankings: [
                { name: 'Bangalore Urban', count: 120 },
                { name: 'Mysuru', count: 85 },
                { name: 'Hubballi', count: 60 }
            ],
            trends: {
                xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                series: [12, 19, 15, 25, 22, 30, 28]
            }
        };

        // Cache for 15 minutes (900 seconds)
        await segment.put('analytics_dashboard', JSON.stringify(payload), 900);

        res.json(payload);
    } catch (error) {
        console.error('Analytics API Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

export default router;
