const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (process.env.ZOHO_CATALYST_ENVIRONMENT === 'Development') {
    require('dotenv').config();
}

const app = express();
app.use(cors());
app.use(express.json());

const SAMPLE_CASES = [
    {
        firId: 'FIR-2026-041-KRM',
        district: 'Bengaluru South',
        station: 'Koramangala PS',
        crimeType: 'Assault',
        incidentDate: '2026-06-14',
        accusedAge: 24,
        accusedGender: 'Male',
        complainantCaste: 'Not recorded',
        complainantReligion: 'Hindu',
        complainantOccupation: 'Delivery worker',
        locationFactor: 'Unregulated liquor outlet cluster',
        motive: 'Intoxication-linked dispute',
        summary: 'Assault reported after a late-night argument near an unlicensed liquor outlet.'
    },
    {
        firId: 'FIR-2026-052-JPN',
        district: 'Bengaluru South',
        station: 'Jayanagar PS',
        crimeType: 'Vehicle Theft',
        incidentDate: '2026-06-18',
        accusedAge: 21,
        accusedGender: 'Male',
        complainantCaste: 'OBC',
        complainantReligion: 'Hindu',
        complainantOccupation: 'Student',
        locationFactor: 'Poorly lit two-wheeler parking stretch',
        motive: 'Opportunistic theft for resale',
        summary: 'Two-wheeler theft from an unguarded lane with repeated street-light outage mentions.'
    },
    {
        firId: 'FIR-2026-064-BTM',
        district: 'Bengaluru South',
        station: 'BTM Layout PS',
        crimeType: 'Cyber Fraud',
        incidentDate: '2026-06-22',
        accusedAge: 31,
        accusedGender: 'Male',
        complainantCaste: 'Not recorded',
        complainantReligion: 'Muslim',
        complainantOccupation: 'Small business owner',
        locationFactor: 'UPI merchant onboarding gap',
        motive: 'KYC phishing and mule-account routing',
        summary: 'Merchant-targeted UPI phishing followed by transfer through multiple mule accounts.'
    },
    {
        firId: 'FIR-2026-077-KRM',
        district: 'Bengaluru South',
        station: 'Koramangala PS',
        crimeType: 'Assault',
        incidentDate: '2026-06-25',
        accusedAge: 27,
        accusedGender: 'Male',
        complainantCaste: 'SC',
        complainantReligion: 'Hindu',
        complainantOccupation: 'Auto driver',
        locationFactor: 'Late-night transport pickup point',
        motive: 'Fare dispute escalating to group assault',
        summary: 'Group assault around a transport pickup point after a fare dispute.'
    },
    {
        firId: 'FIR-2026-088-HSR',
        district: 'Bengaluru South',
        station: 'HSR Layout PS',
        crimeType: 'Cyber Fraud',
        incidentDate: '2026-06-28',
        accusedAge: 29,
        accusedGender: 'Female',
        complainantCaste: 'General',
        complainantReligion: 'Christian',
        complainantOccupation: 'IT employee',
        locationFactor: 'Remote-work device compromise',
        motive: 'Impersonation and credential harvesting',
        summary: 'Corporate identity impersonation used to extract credentials and route funds.'
    },
    {
        firId: 'FIR-2026-093-JPN',
        district: 'Bengaluru South',
        station: 'Jayanagar PS',
        crimeType: 'Vehicle Theft',
        incidentDate: '2026-06-30',
        accusedAge: 22,
        accusedGender: 'Male',
        complainantCaste: 'OBC',
        complainantReligion: 'Hindu',
        complainantOccupation: 'Retail worker',
        locationFactor: 'Market-side parking without CCTV coverage',
        motive: 'Duplicate-key theft pattern',
        summary: 'Motorcycle lifted from market-side parking without camera coverage.'
    }
];

const SAMPLE_PROFILES = {
    'ravi kumar': {
        personId: 'PER-00491',
        name: 'Ravi Kumar',
        aliases: ['Auto Ravi', 'RK'],
        age: 31,
        gender: 'Male',
        lastKnownAddress: 'Adugodi, Bengaluru',
        physicalDescription: 'Medium build, approx. 172 cm, scar on left eyebrow',
        cases: [
            {
                firId: 'FIR-2024-118-ADG',
                date: '2024-09-21',
                station: 'Adugodi PS',
                category: 'Vehicle Theft',
                status: 'Chargesheeted',
                role: 'Primary accused',
                location: 'Adugodi bus stand',
                summary: 'Two-wheeler theft using duplicate keys near a transit point.'
            },
            {
                firId: 'FIR-2025-036-KRM',
                date: '2025-02-12',
                station: 'Koramangala PS',
                category: 'Extortion',
                status: 'Under Investigation',
                role: 'Suspected coordinator',
                location: 'Koramangala 5th Block',
                summary: 'Threat-based collection from small shop owners through intermediaries.'
            },
            {
                firId: 'FIR-2026-077-KRM',
                date: '2026-06-25',
                station: 'Koramangala PS',
                category: 'Assault',
                status: 'Open',
                role: 'Accomplice',
                location: 'Late-night transport pickup point',
                summary: 'Group assault after a fare dispute involving auto drivers.'
            }
        ],
        accomplices: [
            { name: 'Suresh Gowda', relation: 'Co-accused in 2 FIRs', confidence: 0.82 },
            { name: 'Manjunath R', relation: 'Vehicle disposal contact', confidence: 0.68 },
            { name: 'Imran Pasha', relation: 'Phone contact overlap', confidence: 0.61 }
        ],
        operationalZones: ['Adugodi', 'Koramangala', 'BTM Layout'],
        knownPatterns: ['Transit-point targeting', 'Duplicate-key theft', 'Use of intermediaries for intimidation']
    },
    'kumar alias auto kumar': {
        personId: 'PER-00491',
        name: 'Ravi Kumar',
        aliases: ['Auto Kumar', 'Auto Ravi', 'RK'],
        age: 31,
        gender: 'Male',
        lastKnownAddress: 'Adugodi, Bengaluru',
        physicalDescription: 'Medium build, approx. 172 cm, scar on left eyebrow',
        cases: [
            {
                firId: 'FIR-2024-118-ADG',
                date: '2024-09-21',
                station: 'Adugodi PS',
                category: 'Vehicle Theft',
                status: 'Chargesheeted',
                role: 'Primary accused',
                location: 'Adugodi bus stand',
                summary: 'Two-wheeler theft using duplicate keys near a transit point.'
            },
            {
                firId: 'FIR-2025-036-KRM',
                date: '2025-02-12',
                station: 'Koramangala PS',
                category: 'Extortion',
                status: 'Under Investigation',
                role: 'Suspected coordinator',
                location: 'Koramangala 5th Block',
                summary: 'Threat-based collection from small shop owners through intermediaries.'
            },
            {
                firId: 'FIR-2026-077-KRM',
                date: '2026-06-25',
                station: 'Koramangala PS',
                category: 'Assault',
                status: 'Open',
                role: 'Accomplice',
                location: 'Late-night transport pickup point',
                summary: 'Group assault after a fare dispute involving auto drivers.'
            }
        ],
        accomplices: [
            { name: 'Suresh Gowda', relation: 'Co-accused in 2 FIRs', confidence: 0.82 },
            { name: 'Manjunath R', relation: 'Vehicle disposal contact', confidence: 0.68 },
            { name: 'Imran Pasha', relation: 'Phone contact overlap', confidence: 0.61 }
        ],
        operationalZones: ['Adugodi', 'Koramangala', 'BTM Layout'],
        knownPatterns: ['Transit-point targeting', 'Duplicate-key theft', 'Use of intermediaries for intimidation']
    },
    'suresh gowda': {
        personId: 'PER-00622',
        name: 'Suresh Gowda',
        aliases: ['Suri'],
        age: 28,
        gender: 'Male',
        lastKnownAddress: 'BTM Layout, Bengaluru',
        physicalDescription: 'Lean build, approx. 168 cm, tattoo on right forearm',
        cases: [
            {
                firId: 'FIR-2025-036-KRM',
                date: '2025-02-12',
                station: 'Koramangala PS',
                category: 'Extortion',
                status: 'Under Investigation',
                role: 'Co-accused',
                location: 'Koramangala 5th Block',
                summary: 'Collection visit to small shops with intimidation calls.'
            },
            {
                firId: 'FIR-2026-041-KRM',
                date: '2026-06-14',
                station: 'Koramangala PS',
                category: 'Assault',
                status: 'Open',
                role: 'Primary accused',
                location: 'Liquor outlet cluster',
                summary: 'Assault after intoxication-linked argument.'
            }
        ],
        accomplices: [
            { name: 'Ravi Kumar', relation: 'Co-accused in extortion FIR', confidence: 0.82 },
            { name: 'Mahesh N', relation: 'Common phone contact', confidence: 0.56 }
        ],
        operationalZones: ['Koramangala', 'BTM Layout'],
        knownPatterns: ['Late-night group movement', 'Intimidation calls', 'Liquor-outlet conflict escalation']
    }
};

const AGE_BUCKETS = [
    { label: '18-25', min: 18, max: 25 },
    { label: '26-35', min: 26, max: 35 },
    { label: '36-45', min: 36, max: 45 },
    { label: '46+', min: 46, max: Infinity }
];

function success(res, data, meta = {}) {
    res.json({
        status: 'success',
        data,
        meta: {
            generated_at: new Date().toISOString(),
            ...meta
        }
    });
}

function error(res, statusCode, code, message, details = []) {
    res.status(statusCode).json({
        status: 'error',
        error: { code, message, details }
    });
}

function normalize(value) {
    return String(value || '').trim().toLowerCase();
}

function isConfigured(value) {
    return Boolean(value && !String(value).includes('your_') && !String(value).includes('...'));
}

function getGeminiModel() {
    if (!isConfigured(process.env.LLM_API_KEY)) {
        return null;
    }

    const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
    return genAI.getGenerativeModel({
        model: process.env.LLM_MODEL || 'gemini-3.5-flash'
    });
}

async function generateWithGemini(prompt, fallback) {
    const model = getGeminiModel();

    if (!model) {
        return fallback;
    }

    try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim() || fallback;
    } catch (generationError) {
        console.warn('Gemini generation failed, using deterministic fallback:', generationError.message);
        return fallback;
    }
}

function filterCases({ jurisdiction, crimeType }) {
    return SAMPLE_CASES.filter((caseRecord) => {
        const jurisdictionMatches = !jurisdiction ||
            normalize(caseRecord.district).includes(normalize(jurisdiction)) ||
            normalize(caseRecord.station).includes(normalize(jurisdiction));
        const crimeMatches = !crimeType || crimeType === 'All' || normalize(caseRecord.crimeType) === normalize(crimeType);

        return jurisdictionMatches && crimeMatches;
    });
}

function countBy(records, selector) {
    return records.reduce((acc, item) => {
        const key = selector(item) || 'Not recorded';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
}

function toBreakdown(counts, total) {
    return Object.entries(counts)
        .map(([label, count]) => ({
            label,
            count,
            pct: total === 0 ? 0 : Math.round((count / total) * 100)
        }))
        .sort((a, b) => b.count - a.count);
}

function getAgeBucket(age) {
    return AGE_BUCKETS.find((bucket) => age >= bucket.min && age <= bucket.max)?.label || 'Not recorded';
}

function buildSociologyFallbackReport(payload) {
    const topLocations = payload.locationFactors
        .slice(0, 2)
        .map((item) => item.label)
        .join(' and ');

    return [
        `Executive Brief: ${payload.jurisdiction || 'Selected jurisdiction'} shows ${payload.sampleSize} relevant FIR clusters in ${payload.timeframe.replace(/_/g, ' ')}.`,
        `The strongest signals are place-and-opportunity factors, especially ${topLocations || 'repeat public-space vulnerabilities'}.`,
        `Protected demographic fields are treated only as aggregate context and are not used as suspicion indicators. Operational recommendations should focus on locations, times, victim support, and repeat M.O. controls.`,
        `Priority Signal: ${payload.correlations[0]?.insight || 'No dominant correlation was detected in the available sample.'}`
    ].join('\n\n');
}

function buildSociologyPayload({ jurisdiction = 'Bengaluru South', timeframe = 'last_30_days', crimeType = 'All' }) {
    const cases = filterCases({ jurisdiction, crimeType });
    const fallbackCases = cases.length > 0 ? cases : SAMPLE_CASES;
    const total = fallbackCases.length;

    const ageBreakdown = toBreakdown(countBy(fallbackCases, (caseRecord) => getAgeBucket(caseRecord.accusedAge)), total);
    const genderBreakdown = toBreakdown(countBy(fallbackCases, (caseRecord) => caseRecord.accusedGender), total);
    const casteBreakdown = toBreakdown(countBy(fallbackCases, (caseRecord) => caseRecord.complainantCaste), total);
    const religionBreakdown = toBreakdown(countBy(fallbackCases, (caseRecord) => caseRecord.complainantReligion), total);
    const occupationBreakdown = toBreakdown(countBy(fallbackCases, (caseRecord) => caseRecord.complainantOccupation), total);
    const locationBreakdown = toBreakdown(countBy(fallbackCases, (caseRecord) => caseRecord.locationFactor), total);

    const correlations = [
        {
            signal: 'Repeat incidents around weak guardianship locations',
            strength: 0.82,
            evidenceCount: locationBreakdown[0]?.count || 0,
            insight: `${locationBreakdown[0]?.label || 'Transit and parking points'} appears repeatedly across FIR narratives, indicating a preventable place-based vulnerability rather than a demographic cause.`
        },
        {
            signal: 'Youth-linked property offence pattern',
            strength: 0.68,
            evidenceCount: ageBreakdown.find((item) => item.label === '18-25')?.count || 0,
            insight: 'Vehicle theft incidents skew toward younger accused cohorts and duplicate-key techniques in unmonitored parking areas.'
        },
        {
            signal: 'Small business cyber fraud exposure',
            strength: 0.61,
            evidenceCount: fallbackCases.filter((caseRecord) => caseRecord.crimeType === 'Cyber Fraud').length,
            insight: 'Cyber fraud FIRs repeatedly mention merchant KYC, UPI workflows, and credential harvesting as exploitable conditions.'
        }
    ];

    const preventiveActions = [
        'Increase beat patrols and camera coverage at the top recurring location factors during late-night windows.',
        'Coordinate with municipal teams to verify street lighting and CCTV gaps around two-wheeler parking clusters.',
        'Run targeted UPI/KYC fraud advisories for small merchants without treating religion, caste, or occupation as suspicion markers.',
        'Flag FIRs sharing duplicate-key M.O. and transit-point geography for linked-investigation review.'
    ];

    return {
        jurisdiction,
        timeframe,
        crimeType,
        sampleSize: total,
        demographicBreakdown: {
            age: ageBreakdown,
            gender: genderBreakdown,
            caste: casteBreakdown,
            religion: religionBreakdown,
            occupation: occupationBreakdown
        },
        locationFactors: locationBreakdown,
        correlations,
        preventiveActions,
        citations: fallbackCases.map((caseRecord) => ({
            firId: caseRecord.firId,
            station: caseRecord.station,
            incidentDate: caseRecord.incidentDate,
            summary: caseRecord.summary
        })),
        limitations: [
            'Aggregate demographic analysis can reveal service-delivery gaps, but protected traits must never be used as standalone suspicion criteria.',
            'Findings are directional until connected to live Catalyst Data Store records and verified by an analyst.'
        ]
    };
}

function calculateRiskScore(profile) {
    const activeCases = profile.cases.filter((caseRecord) => ['Open', 'Under Investigation'].includes(caseRecord.status)).length;
    const recentCases = profile.cases.filter((caseRecord) => Number(caseRecord.date.slice(0, 4)) >= 2025).length;
    const networkWeight = Math.min(profile.accomplices.length * 4, 12);
    const zoneWeight = Math.min(profile.operationalZones.length * 3, 9);
    const categoryWeight = profile.cases.some((caseRecord) => ['Extortion', 'Assault'].includes(caseRecord.category)) ? 12 : 5;

    return Math.min(95, 22 + activeCases * 7 + recentCases * 6 + networkWeight + zoneWeight + categoryWeight);
}

function getRiskBand(score) {
    if (score >= 75) return 'High';
    if (score >= 50) return 'Medium';
    return 'Low';
}

function buildProfileFallback(query) {
    const profile = SAMPLE_PROFILES[normalize(query)] || SAMPLE_PROFILES['ravi kumar'];
    const riskScore = calculateRiskScore(profile);

    return {
        ...profile,
        riskScore,
        riskBand: getRiskBand(riskScore),
        moSummary: 'Pattern analysis indicates repeat movement around transit-adjacent commercial zones, use of intermediaries for intimidation, and opportunistic vehicle theft using duplicate-key access. Recent records show escalation from property crime into group intimidation and assault-linked incidents.',
        audit: {
            action: 'VIEW_PROFILE',
            resourceId: profile.personId,
            status: 'queued_for_catalyst_audit_log'
        }
    };
}

async function fetchNeo4jAccomplices(personName) {
    if (!isConfigured(process.env.NEO4J_URI) || !isConfigured(process.env.NEO4J_USERNAME) || !isConfigured(process.env.NEO4J_PASSWORD)) {
        return [];
    }

    const driver = neo4j.driver(
        process.env.NEO4J_URI,
        neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );
    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (p:Person)
            WHERE toLower(p.name) CONTAINS toLower($personName)
            MATCH (p)-[:ACCUSED_IN]->(:FIR)<-[:ACCUSED_IN]-(accomplice:Person)
            RETURN DISTINCT accomplice.name AS name, count(*) AS sharedCases
            ORDER BY sharedCases DESC
            LIMIT 3
            `,
            { personName }
        );

        return result.records.map((record) => ({
            name: record.get('name'),
            relation: `Co-accused in ${record.get('sharedCases').toNumber()} FIR(s)`,
            confidence: 0.75
        }));
    } catch (neo4jError) {
        console.warn('Neo4j accomplice lookup failed:', neo4jError.message);
        return [];
    } finally {
        await session.close();
        await driver.close();
    }
}

app.get('/health', (req, res) => {
    success(res, {
        service: 'crimegpt-insights-service',
        status: 'ok'
    });
});

async function handleSociologyInsights(req, res) {
    try {
        const payload = buildSociologyPayload({ ...req.query, ...req.body });
        const fallbackReport = buildSociologyFallbackReport(payload);
        const prompt = `You are CrimeGPT's sociological insights engine for Karnataka State Police.
Use only the aggregate FIR context below. Do not infer criminality from caste, religion, gender, or occupation.
Focus on actionable place-based, time-based, and service-delivery interventions.
Return a concise executive briefing with a "Suggested Preventive Actions" section.

Context JSON:
${JSON.stringify(payload, null, 2)}`;

        const report = await generateWithGemini(prompt, fallbackReport);

        success(res, {
            ...payload,
            executiveReport: report
        }, { source: report === fallbackReport ? 'deterministic-demo' : 'gemini-grounded' });
    } catch (requestError) {
        console.error('Sociological Insights Error:', requestError);
        error(res, 500, 'INSIGHTS_FAILED', 'Unable to generate sociological insights.', [
            { issue: requestError.message }
        ]);
    }
}

app.get('/api/v1/insights/sociology', handleSociologyInsights);

app.post('/api/v1/insights/sociology', handleSociologyInsights);

app.get('/api/v1/profiles/:personName', async (req, res) => {
    try {
        const personName = decodeURIComponent(req.params.personName || '').trim();

        if (!personName) {
            return error(res, 400, 'VALIDATION_FAILED', 'personName is required.', [
                { field: 'personName', issue: 'Must be a non-empty path parameter.' }
            ]);
        }

        const profile = buildProfileFallback(personName);
        const graphAccomplices = await fetchNeo4jAccomplices(personName);
        const hydratedProfile = {
            ...profile,
            accomplices: graphAccomplices.length > 0 ? graphAccomplices : profile.accomplices
        };
        const fallbackMo = hydratedProfile.moSummary;
        const prompt = `You are CrimeGPT's offender profiling analyst.
Use only the profile JSON below. Write a short Modus Operandi summary and do not speculate beyond records.
Mention operational zones and repeat methods. Avoid dramatic language.

Profile JSON:
${JSON.stringify(hydratedProfile, null, 2)}`;

        const moSummary = await generateWithGemini(prompt, fallbackMo);

        success(res, {
            ...hydratedProfile,
            moSummary
        }, { source: moSummary === fallbackMo ? 'deterministic-demo' : 'gemini-grounded' });
    } catch (requestError) {
        console.error('Offender Profile Error:', requestError);
        error(res, 500, 'PROFILE_FAILED', 'Unable to build offender profile.', [
            { issue: requestError.message }
        ]);
    }
});

if (require.main === module) {
    const port = process.env.PORT || 3003;
    app.listen(port, () => {
        console.log(`crimegpt-insights-service listening on port ${port}`);
    });
}

module.exports = app;
