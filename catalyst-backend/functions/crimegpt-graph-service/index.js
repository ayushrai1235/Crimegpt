const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

require('dotenv').config({ path: 'E:\\Ksp datathon\\catalyst-backend\\.env' });

const app = express();
app.use(cors());
app.use(express.json());

const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));

app.get('/network', async (req, res) => {
    try {
        const session = driver.session();
        
        // Fetch graph where FIR involves Person or Financial Account
        const cypher = `
            MATCH (n)
            OPTIONAL MATCH (n)-[r]->(m)
            RETURN n, r, m
            LIMIT 100
        `;
        
        const result = await session.run(cypher);
        
        const nodes = [];
        const edges = [];
        const nodeSet = new Set();
        
        result.records.forEach(record => {
            const n = record.get('n');
            const m = record.get('m');
            const r = record.get('r');
            
            if (n && !nodeSet.has(n.identity.low)) {
                nodes.push({ id: n.identity.low, label: n.properties.name || n.properties.crimeNo || n.properties.accountNo, group: n.labels[0] });
                nodeSet.add(n.identity.low);
            }
            
            if (m && !nodeSet.has(m.identity.low)) {
                nodes.push({ id: m.identity.low, label: m.properties.name || m.properties.crimeNo || m.properties.accountNo, group: m.labels[0] });
                nodeSet.add(m.identity.low);
            }
            
            if (r) {
                edges.push({ from: r.start.low, to: r.end.low, label: r.type });
            }
        });
        
        await session.close();

        res.json({ nodes, edges });
    } catch (error) {
        console.error('Graph Service Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

if (require.main === module) {
    const port = process.env.GRAPH_PORT || 3002;
    app.listen(port, () => {
        console.log(`crimegpt-graph-service listening on port ${port}`);
    });
}

module.exports = app;


