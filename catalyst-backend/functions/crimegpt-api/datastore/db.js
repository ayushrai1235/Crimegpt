import catalyst from 'zcatalyst-sdk-node';

export class CatalystDataStore {
    constructor(req) {
        this.app = catalyst.initialize(req);
        this.datastore = this.app.datastore();
    }

    async insertRecord(tableName, data) {
        try {
            const table = this.datastore.table(tableName);
            const insertPromise = table.insertRow(data);
            return await insertPromise;
        } catch (error) {
            console.error(`Error inserting into ${tableName}:`, error);
            throw error;
        }
    }

    async getRecordById(tableName, id) {
        try {
            const table = this.datastore.table(tableName);
            return await table.getRow(id);
        } catch (error) {
            console.error(`Error fetching from ${tableName}:`, error);
            throw error;
        }
    }

    async query(zcqlQuery) {
        try {
            const zcql = this.app.zcql();
            return await zcql.executeZCQLQuery(zcqlQuery);
        } catch (error) {
            console.error(`Error executing ZCQL: ${zcqlQuery}`, error);
            throw error;
        }
    }
}

export const getDB = (req) => new CatalystDataStore(req);
