import express from 'express';
import { executeCypher } from '../graph/neo4j.js';

const router = express.Router();

router.get('/network/:personId', async (req, res) => {
    try {
        const { personId } = req.params;
        
        // Query Neo4j for network up to 2 hops
        const cypher = `
            MATCH (p:Person {personId: $personId})-[r*1..2]-(connected)
            RETURN p, r, connected
        `;
        
        const results = await executeCypher(cypher, { personId });
        
        // Format for Cytoscape.js: { elements: [ { data: { id, label } }, ... ] }
        const nodesMap = new Map();
        const edgesMap = new Map();

        // Very basic parsing of Neo4j driver output (which depends on how `executeCypher` unwraps it)
        // Since `executeCypher` returns plain JS objects, we adapt to it.
        // Assuming Neo4j records are mapped to standard objects where nodes have .identity, .labels, .properties
        results.forEach(record => {
            ['p', 'connected'].forEach(nodeKey => {
                const node = record[nodeKey];
                if (node && node.identity) {
                    const id = node.identity.low.toString();
                    if (!nodesMap.has(id)) {
                        nodesMap.set(id, {
                            data: {
                                id,
                                label: node.properties.name || node.properties.crimeNo || id,
                                type: node.labels[0]
                            }
                        });
                    }
                }
            });

            // Parse relationships (r is an array if path length > 1, or a single rel)
            const rels = Array.isArray(record.r) ? record.r : [record.r];
            rels.forEach(rel => {
                if (rel && rel.identity) {
                    const id = rel.identity.low.toString();
                    if (!edgesMap.has(id)) {
                        edgesMap.set(id, {
                            data: {
                                id,
                                source: rel.start.low.toString(),
                                target: rel.end.low.toString(),
                                label: rel.type
                            }
                        });
                    }
                }
            });
        });

        res.json({
            elements: [
                ...Array.from(nodesMap.values()),
                ...Array.from(edgesMap.values())
            ]
        });

    } catch (error) {
        console.error('Graph API Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

export default router;
