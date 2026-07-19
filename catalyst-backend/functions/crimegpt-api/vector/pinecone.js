import { Pinecone } from '@pinecone-database/pinecone';

let pcInstance = null;
let indexInstance = null;

export const initPinecone = () => {
    if (!pcInstance) {
        pcInstance = new Pinecone({ apiKey: process.env.VECTOR_DB_API_KEY });
        indexInstance = pcInstance.index(process.env.VECTOR_DB_INDEX_NAME || 'crimegpt-index');
    }
    return indexInstance;
};

export const upsertVector = async (id, vector, metadata) => {
    const index = initPinecone();
    await index.upsert([
        {
            id,
            values: vector,
            metadata
        }
    ]);
};

export const queryVector = async (vector, topK = 5) => {
    const index = initPinecone();
    const results = await index.query({
        vector,
        topK,
        includeMetadata: true
    });
    return results;
};
