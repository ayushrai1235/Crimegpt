import { GoogleGenerativeAI, SchemaType as Type } from '@google/generative-ai';
import { upsertVector } from '../vector/pinecone.js';

let genAI = null;

export const initGemini = () => {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
    }
    return genAI;
};

// 1. Basic embedding generation
export const generateEmbedding = async (text) => {
    const ai = initGemini();
    const model = ai.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
};

// 2. Inference Model (using Gemini 3.5 Flash as requested)
export const getChatModel = (systemInstruction) => {
    const ai = initGemini();
    return ai.getGenerativeModel({
        model: process.env.LLM_MODEL || 'gemini-3.5-flash',
        systemInstruction
    });
};

// 3. Extraction Pipeline (PDF -> JSON)
export const extractEntitiesFromFIR = async (firText) => {
    const ai = initGemini();
    const schema = {
        type: Type.OBJECT,
        properties: {
            CrimeNo: { type: Type.STRING },
            BriefFacts: { type: Type.STRING },
            Accused: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        AccusedName: { type: Type.STRING },
                        PersonID: { type: Type.STRING }
                    }
                }
            },
            Victims: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        VictimName: { type: Type.STRING }
                    }
                }
            },
            BankAccounts: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
        required: ["CrimeNo", "BriefFacts", "Accused", "Victims"]
    };

    const model = ai.getGenerativeModel({
        model: 'gemini-1.5-pro', // Pro for complex extraction
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        }
    });

    const prompt = `Extract the structured information from the following FIR text:\n\n${firText}`;
    const result = await model.generateContent(prompt);
    
    try {
        const jsonText = result.response.text();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse extracted JSON:", e);
        return null;
    }
};
