import neo4j from 'neo4j-driver';

let driver = null;

export const initNeo4j = () => {
    if (!driver) {
        const uri = process.env.NEO4J_URI;
        const user = process.env.NEO4J_USERNAME;
        const password = process.env.NEO4J_PASSWORD;

        if (!uri || !user || !password) {
            console.warn("Neo4j credentials not fully provided in ENV. Graph operations will fail.");
        }

        driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    }
    return driver;
};

export const closeNeo4j = async () => {
    if (driver) {
        await driver.close();
        driver = null;
    }
};

export const executeCypher = async (query, params = {}) => {
    const drv = initNeo4j();
    const session = drv.session();
    try {
        const result = await session.run(query, params);
        return result.records.map(record => {
            const obj = {};
            record.keys.forEach(key => {
                obj[key] = record.get(key);
            });
            return obj;
        });
    } catch (error) {
        console.error("Cypher execution error:", error);
        throw error;
    } finally {
        await session.close();
    }
};

// Common Graph Queries
export const getRelatedCasesForPerson = async (personId) => {
    const query = `
        MATCH (p:Person {personId: $personId})-[:ACCUSED_IN]->(c:Case)
        RETURN c
    `;
    return await executeCypher(query, { personId });
};

export const insertCaseGraph = async (caseData, accusedList, victimList) => {
    // Basic MERGE for case and relationships
    const query = `
        MERGE (c:Case {crimeNo: $crimeNo})
        SET c.briefFacts = $briefFacts
        WITH c
        UNWIND $accusedList AS accused
        MERGE (a:Person {personId: accused.personId})
        SET a.name = accused.name, a.type = 'Accused'
        MERGE (a)-[:ACCUSED_IN]->(c)
        WITH c
        UNWIND $victimList AS victim
        MERGE (v:Person {name: victim.name})
        SET v.type = 'Victim'
        MERGE (v)-[:VICTIM_IN]->(c)
    `;
    const params = {
        crimeNo: caseData.CrimeNo,
        briefFacts: caseData.BriefFacts || "",
        accusedList: accusedList.map(a => ({ personId: a.PersonID, name: a.AccusedName })),
        victimList: victimList.map(v => ({ name: v.VictimName }))
    };
    return await executeCypher(query, params);
};
