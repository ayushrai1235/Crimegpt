import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function seedDatabase() {
    console.log('Connecting to Neo4j to seed data...');
    const driver = neo4j.driver(
        process.env.NEO4J_URI,
        neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const session = driver.session();

    try {
        console.log('Clearing old data (if any)...');
        await session.run('MATCH (n) DETACH DELETE n');

        console.log('Seeding mock FIRs and Persons...');
        const cypher = `
            // FIR 1: Cyber Fraud
            CREATE (fir1:FIR {crimeNo: 'FIR-2026-101-CYB', type: 'Cyber Fraud', date: '2026-07-15'})
            CREATE (vic1:Person {name: 'Rahul Sharma', role: 'Victim'})
            CREATE (acc1:Person {name: 'Unknown Scammer', role: 'Accused'})
            CREATE (acc2:Person {name: 'Ravi Kumar', role: 'Accused'})
            CREATE (fin1:FinancialAccount {accountNo: '1234567890', bank: 'HDFC'})
            CREATE (fin2:FinancialAccount {accountNo: '0987654321', bank: 'SBI'})
            
            CREATE (vic1)-[:VICTIM_OF]->(fir1)
            CREATE (acc1)-[:ACCUSED_IN]->(fir1)
            CREATE (acc2)-[:ACCUSED_IN]->(fir1)
            CREATE (fir1)-[:INVOLVES_TRANSACTION]->(fin1)
            CREATE (acc2)-[:OWNS_ACCOUNT]->(fin1)
            CREATE (acc1)-[:TRANSFERRED_TO]->(fin2)

            // FIR 2: Phishing Link (Linked by Ravi Kumar)
            CREATE (fir2:FIR {crimeNo: 'FIR-2026-102-CYB', type: 'Phishing', date: '2026-07-18'})
            CREATE (vic2:Person {name: 'Anita Desai', role: 'Victim'})
            CREATE (fin3:FinancialAccount {accountNo: '5555444433', bank: 'ICICI'})
            
            CREATE (vic2)-[:VICTIM_OF]->(fir2)
            CREATE (acc2)-[:ACCUSED_IN]->(fir2)
            CREATE (fir2)-[:INVOLVES_TRANSACTION]->(fin3)
            CREATE (acc2)-[:OWNS_ACCOUNT]->(fin3)
        `;

        await session.run(cypher);
        console.log('Successfully seeded database with 2 FIRs, 4 Persons, and 3 Financial Accounts!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await session.close();
        await driver.close();
    }
}

seedDatabase();
