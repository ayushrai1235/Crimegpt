const catalyst = require('zcatalyst-sdk-node');
const neo4j = require('neo4j-driver');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (process.env.ZOHO_CATALYST_ENVIRONMENT === 'Development') {
    require('dotenv').config();
}

module.exports = async (event, context) => {
    try {
        const app = catalyst.initialize(context);
        const fileId = event.data.file_id;
        
        // Setup Gemini & Neo4j
        const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
        const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));

        // 1. Fetch File Content from Catalyst File Store (Mocking text extraction for MVP)
        // In reality, we would download the PDF and run OCR/pdf-parse
        const documentText = "Mock extracted text from PDF FIR number 202600001 involving cyber fraud and money transfer to account 9988776655."; 

        // 2. Extract Entities using Gemini 3.5 Flash
        const prompt = `Extract entities from this FIR text to build a criminal network graph.
        Return ONLY valid JSON in this format:
        {
          "CrimeNo": "STRING",
          "Accused": [{"name": "STRING"}],
          "Victims": [{"name": "STRING"}],
          "FinancialAccounts": [{"accountNo": "STRING"}]
        }
        
        Text:
        ${documentText}`;

        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
        const result = await model.generateContent(prompt);
        
        // Clean JSON response
        let rawJson = result.response.text();
        rawJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
        const entities = JSON.parse(rawJson);

        // 3. Push to Neo4j Graph Database
        const session = driver.session();
        
        const cypher = `
            MERGE (case:FIR {crimeNo: $crimeNo})
            WITH case
            
            // Accused nodes
            UNWIND $accused AS a
            MERGE (acc:Person {name: a.name})
            MERGE (acc)-[:ACCUSED_IN]->(case)
            
            // Victim nodes
            WITH case
            UNWIND $victims AS v
            MERGE (vic:Person {name: v.name})
            MERGE (vic)-[:VICTIM_OF]->(case)
            
            // Financial nodes
            WITH case
            UNWIND $accounts AS accNo
            MERGE (fin:FinancialAccount {accountNo: accNo.accountNo})
            MERGE (case)-[:INVOLVES_TRANSACTION]->(fin)
        `;

        await session.run(cypher, {
            crimeNo: entities.CrimeNo || 'UNKNOWN',
            accused: entities.Accused || [],
            victims: entities.Victims || [],
            accounts: entities.FinancialAccounts || []
        });

        await session.close();
        await driver.close();

        context.closeWithSuccess();
    } catch (error) {
        console.error("Ingestion Error:", error);
        context.closeWithFailure();
    }
};
