'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Brain,
  CalendarDays,
  FileText,
  Fingerprint,
  Gauge,
  GitBranch,
  Landmark,
  Loader2,
  MapPinned,
  RefreshCw,
  Search,
  ShieldAlert,
  Users,
} from 'lucide-react';

type LoadState = 'idle' | 'loading' | 'error';

interface BreakdownItem {
  label: string;
  count: number;
  pct: number;
}

interface Correlation {
  signal: string;
  strength: number;
  evidenceCount: number;
  insight: string;
}

interface Citation {
  firId: string;
  station: string;
  incidentDate: string;
  summary: string;
}

interface SociologyInsights {
  jurisdiction: string;
  timeframe: string;
  crimeType: string;
  sampleSize: number;
  demographicBreakdown: {
    age: BreakdownItem[];
    gender: BreakdownItem[];
    caste: BreakdownItem[];
    religion: BreakdownItem[];
    occupation: BreakdownItem[];
  };
  locationFactors: BreakdownItem[];
  correlations: Correlation[];
  preventiveActions: string[];
  citations: Citation[];
  limitations: string[];
  executiveReport: string;
}

interface CaseRecord {
  firId: string;
  date: string;
  station: string;
  category: string;
  status: string;
  role: string;
  location: string;
  summary: string;
}

interface Accomplice {
  name: string;
  relation: string;
  confidence: number;
}

interface ProfileAudit {
  action: string;
  resourceId: string;
  status: string;
}

interface OffenderProfile {
  personId: string;
  name: string;
  aliases: string[];
  age: number;
  gender: string;
  lastKnownAddress: string;
  physicalDescription: string;
  cases: CaseRecord[];
  accomplices: Accomplice[];
  operationalZones: string[];
  knownPatterns: string[];
  riskScore: number;
  riskBand: 'Low' | 'Medium' | 'High';
  moSummary: string;
  audit: ProfileAudit;
}

interface ApiEnvelope<T> {
  status: 'success' | 'error';
  data: T;
  meta?: {
    source?: string;
    generated_at?: string;
  };
}

const INSIGHTS_API_BASE_URL = (
  process.env.NEXT_PUBLIC_INSIGHTS_API_URL || 'http://localhost:3003'
).replace(/\/$/, '');

const initialInsights: SociologyInsights = {
  jurisdiction: 'Bengaluru South',
  timeframe: 'last_30_days',
  crimeType: 'All',
  sampleSize: 6,
  demographicBreakdown: {
    age: [
      { label: '18-25', count: 2, pct: 33 },
      { label: '26-35', count: 4, pct: 67 },
    ],
    gender: [
      { label: 'Male', count: 5, pct: 83 },
      { label: 'Female', count: 1, pct: 17 },
    ],
    caste: [
      { label: 'Not recorded', count: 2, pct: 33 },
      { label: 'OBC', count: 2, pct: 33 },
      { label: 'SC', count: 1, pct: 17 },
      { label: 'General', count: 1, pct: 17 },
    ],
    religion: [
      { label: 'Hindu', count: 4, pct: 67 },
      { label: 'Muslim', count: 1, pct: 17 },
      { label: 'Christian', count: 1, pct: 17 },
    ],
    occupation: [
      { label: 'Delivery worker', count: 1, pct: 17 },
      { label: 'Student', count: 1, pct: 17 },
      { label: 'Small business owner', count: 1, pct: 17 },
      { label: 'Auto driver', count: 1, pct: 17 },
    ],
  },
  locationFactors: [
    { label: 'Poorly lit parking / transit stretch', count: 2, pct: 33 },
    { label: 'Liquor outlet conflict cluster', count: 2, pct: 33 },
    { label: 'UPI merchant workflow exposure', count: 1, pct: 17 },
  ],
  correlations: [
    {
      signal: 'Repeat incidents around weak guardianship locations',
      strength: 0.82,
      evidenceCount: 2,
      insight:
        'Transit points, parking stretches, and late-night pickup zones recur more strongly than demographic traits.',
    },
    {
      signal: 'Youth-linked property offence pattern',
      strength: 0.68,
      evidenceCount: 2,
      insight:
        'Vehicle theft reports cluster around younger accused cohorts and duplicate-key access in unmonitored areas.',
    },
  ],
  preventiveActions: [
    'Increase beat patrols and camera coverage at recurring late-night location factors.',
    'Coordinate street-light and CCTV verification around two-wheeler parking clusters.',
    'Run UPI/KYC fraud advisories for small merchants and retail workers.',
  ],
  citations: [
    {
      firId: 'FIR-2026-041-KRM',
      station: 'Koramangala PS',
      incidentDate: '2026-06-14',
      summary: 'Assault after a late-night argument near an unlicensed liquor outlet.',
    },
    {
      firId: 'FIR-2026-093-JPN',
      station: 'Jayanagar PS',
      incidentDate: '2026-06-30',
      summary: 'Motorcycle lifted from market-side parking without camera coverage.',
    },
  ],
  limitations: [
    'Protected traits are aggregate context only and must never be used as standalone suspicion indicators.',
    'Findings remain directional until verified against live Catalyst Data Store records.',
  ],
  executiveReport:
    'Executive Brief: Bengaluru South shows a place-based cluster around transit points, unregulated liquor outlet conflict zones, and weak parking surveillance.\n\nPriority interventions should focus on patrol timing, municipal lighting, merchant cyber-awareness, and linked review of duplicate-key vehicle theft reports.',
};

const initialProfile: OffenderProfile = {
  personId: 'PER-00491',
  name: 'Ravi Kumar',
  aliases: ['Auto Ravi', 'RK'],
  age: 31,
  gender: 'Male',
  lastKnownAddress: 'Adugodi, Bengaluru',
  physicalDescription: 'Medium build, approx. 172 cm, scar on left eyebrow',
  riskScore: 81,
  riskBand: 'High',
  cases: [
    {
      firId: 'FIR-2024-118-ADG',
      date: '2024-09-21',
      station: 'Adugodi PS',
      category: 'Vehicle Theft',
      status: 'Chargesheeted',
      role: 'Primary accused',
      location: 'Adugodi bus stand',
      summary: 'Two-wheeler theft using duplicate keys near a transit point.',
    },
    {
      firId: 'FIR-2025-036-KRM',
      date: '2025-02-12',
      station: 'Koramangala PS',
      category: 'Extortion',
      status: 'Under Investigation',
      role: 'Suspected coordinator',
      location: 'Koramangala 5th Block',
      summary: 'Threat-based collection from small shop owners through intermediaries.',
    },
    {
      firId: 'FIR-2026-077-KRM',
      date: '2026-06-25',
      station: 'Koramangala PS',
      category: 'Assault',
      status: 'Open',
      role: 'Accomplice',
      location: 'Late-night transport pickup point',
      summary: 'Group assault after a fare dispute involving auto drivers.',
    },
  ],
  accomplices: [
    { name: 'Suresh Gowda', relation: 'Co-accused in 2 FIRs', confidence: 0.82 },
    { name: 'Manjunath R', relation: 'Vehicle disposal contact', confidence: 0.68 },
    { name: 'Imran Pasha', relation: 'Phone contact overlap', confidence: 0.61 },
  ],
  operationalZones: ['Adugodi', 'Koramangala', 'BTM Layout'],
  knownPatterns: ['Transit-point targeting', 'Duplicate-key theft', 'Intermediary intimidation'],
  moSummary:
    'Pattern analysis indicates repeat movement around transit-adjacent commercial zones, use of intermediaries for intimidation, and opportunistic vehicle theft using duplicate-key access.',
  audit: {
    action: 'VIEW_PROFILE',
    resourceId: 'PER-00491',
    status: 'queued_for_catalyst_audit_log',
  },
};

const barTones = [
  'bg-cyan-400',
  'bg-emerald-400',
  'bg-amber-400',
  'bg-rose-400',
  'bg-violet-400',
];

async function readEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<ApiEnvelope<T>>;
}

function formatTimeframe(value: string) {
  return value.replace(/_/g, ' ');
}

function scoreTone(score: number) {
  if (score >= 75) return '#f43f5e';
  if (score >= 50) return '#f59e0b';
  return '#22c55e';
}

function BreakdownList({
  title,
  items,
}: {
  title: string;
  items: BreakdownItem[];
}) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
        {title}
      </h3>
      <div className="space-y-3">
        {items.slice(0, 5).map((item, index) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-slate-300">{item.label}</span>
              <span className="font-mono text-xs text-slate-400">
                {item.count} / {item.pct}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full ${barTones[index % barTones.length]}`}
                style={{ width: `${Math.min(item.pct, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function InsightsPage() {
  const [jurisdiction, setJurisdiction] = useState(initialInsights.jurisdiction);
  const [timeframe, setTimeframe] = useState(initialInsights.timeframe);
  const [crimeType, setCrimeType] = useState(initialInsights.crimeType);
  const [suspectQuery, setSuspectQuery] = useState(initialProfile.name);
  const [insights, setInsights] = useState<SociologyInsights>(initialInsights);
  const [profile, setProfile] = useState<OffenderProfile>(initialProfile);
  const [insightState, setInsightState] = useState<LoadState>('idle');
  const [profileState, setProfileState] = useState<LoadState>('idle');
  const [notice, setNotice] = useState(
    'Phase 4 demo intelligence is loaded. Connect the Catalyst service to refresh with live records.'
  );

  const topEvidenceCount = useMemo(
    () => insights.correlations.reduce((sum, item) => sum + item.evidenceCount, 0),
    [insights.correlations]
  );

  const loadSociology = async () => {
    setInsightState('loading');
    setNotice('');

    try {
      const params = new URLSearchParams({
        jurisdiction,
        timeframe,
        crimeType,
      });
      const envelope = await readEnvelope<SociologyInsights>(
        await fetch(`${INSIGHTS_API_BASE_URL}/api/v1/insights/sociology?${params}`)
      );

      setInsights(envelope.data);
      setNotice(
        envelope.meta?.source === 'gemini-grounded'
          ? 'Gemini-grounded sociological briefing refreshed from the Catalyst function.'
          : 'Deterministic demo briefing refreshed from the Catalyst function.'
      );
      setInsightState('idle');
    } catch (requestError) {
      console.error('Unable to load sociological insights', requestError);
      setNotice('Catalyst insights service is unreachable. Showing local Phase 4 demo intelligence.');
      setInsightState('error');
    }
  };

  const loadProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = suspectQuery.trim();

    if (!query) return;

    setProfileState('loading');
    setNotice('');

    try {
      const envelope = await readEnvelope<OffenderProfile>(
        await fetch(`${INSIGHTS_API_BASE_URL}/api/v1/profiles/${encodeURIComponent(query)}`)
      );

      setProfile(envelope.data);
      setNotice(
        envelope.meta?.source === 'gemini-grounded'
          ? 'Gemini-grounded offender profile refreshed from the Catalyst function.'
          : 'Deterministic demo offender profile refreshed from the Catalyst function.'
      );
      setProfileState('idle');
    } catch (requestError) {
      console.error('Unable to load offender profile', requestError);
      setNotice('Catalyst profile service is unreachable. Showing local offender dossier sample.');
      setProfileState('error');
    }
  };

  return (
    <main className="min-h-screen bg-[#090b10] text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-[#090b10]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
              title="Back to CrimeGPT chat"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Phase 4 Intelligence
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                AI Insights & Offender Profiling
              </h1>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/network"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-300"
            >
              <GitBranch size={16} />
              Network
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              <ShieldAlert size={16} />
              CrimeGPT
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-6">
        {notice && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-300" size={18} />
            <p>{notice}</p>
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">FIR Sample</span>
              <FileText className="text-cyan-300" size={18} />
            </div>
            <p className="mt-3 font-mono text-3xl text-white">{insights.sampleSize}</p>
            <p className="mt-1 text-xs text-slate-500">records in current insight set</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Evidence Links</span>
              <BarChart3 className="text-emerald-300" size={18} />
            </div>
            <p className="mt-3 font-mono text-3xl text-white">{topEvidenceCount}</p>
            <p className="mt-1 text-xs text-slate-500">correlation support count</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Risk Score</span>
              <Gauge className="text-rose-300" size={18} />
            </div>
            <p className="mt-3 font-mono text-3xl text-white">{profile.riskScore}</p>
            <p className="mt-1 text-xs text-slate-500">{profile.riskBand} offender profile band</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Operational Zones</span>
              <MapPinned className="text-violet-300" size={18} />
            </div>
            <p className="mt-3 font-mono text-3xl text-white">{profile.operationalZones.length}</p>
            <p className="mt-1 text-xs text-slate-500">active jurisdiction clusters</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Brain size={20} />
                    <h2 className="text-lg font-semibold text-white">Sociological Engine</h2>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Aggregate KSP demographic fields, FIR facts, and recurring locations are synthesized into preventive intelligence.
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-4">
                  <input
                    value={jurisdiction}
                    onChange={(event) => setJurisdiction(event.target.value)}
                    className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                    aria-label="Jurisdiction"
                  />
                  <select
                    value={timeframe}
                    onChange={(event) => setTimeframe(event.target.value)}
                    className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                    aria-label="Timeframe"
                  >
                    <option value="last_7_days">Last 7 days</option>
                    <option value="last_30_days">Last 30 days</option>
                    <option value="quarter_to_date">Quarter to date</option>
                  </select>
                  <select
                    value={crimeType}
                    onChange={(event) => setCrimeType(event.target.value)}
                    className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                    aria-label="Crime type"
                  >
                    <option>All</option>
                    <option>Assault</option>
                    <option>Cyber Fraud</option>
                    <option>Vehicle Theft</option>
                  </select>
                  <button
                    type="button"
                    onClick={loadSociology}
                    disabled={insightState === 'loading'}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {insightState === 'loading' ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                    Refresh
                  </button>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-800 pt-4">
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
                  <CalendarDays size={16} />
                  {insights.jurisdiction} - {formatTimeframe(insights.timeframe)} - {insights.crimeType}
                </div>
                <p className="whitespace-pre-line text-sm leading-6 text-slate-200">
                  {insights.executiveReport}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <BreakdownList title="Accused Age Bands" items={insights.demographicBreakdown.age} />
              <BreakdownList title="Accused Gender" items={insights.demographicBreakdown.gender} />
              <BreakdownList title="Complainant Caste" items={insights.demographicBreakdown.caste} />
              <BreakdownList title="Complainant Religion" items={insights.demographicBreakdown.religion} />
              <BreakdownList title="Occupation Context" items={insights.demographicBreakdown.occupation} />
              <BreakdownList title="Location Factors" items={insights.locationFactors} />
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {insights.correlations.map((correlation) => (
                <article
                  key={correlation.signal}
                  className="rounded-lg border border-slate-800 bg-slate-900/70 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">{correlation.signal}</h3>
                    <span className="font-mono text-xs text-emerald-300">
                      {Math.round(correlation.strength * 100)}%
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{correlation.insight}</p>
                  <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">
                    {correlation.evidenceCount} supporting record(s)
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
              <div className="flex items-center gap-2 text-rose-300">
                <Fingerprint size={20} />
                <h2 className="text-lg font-semibold text-white">Offender Profile</h2>
              </div>

              <form onSubmit={loadProfile} className="mt-4 flex gap-2">
                <input
                  value={suspectQuery}
                  onChange={(event) => setSuspectQuery(event.target.value)}
                  className="h-10 min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-rose-400"
                  aria-label="Suspect name"
                />
                <button
                  type="submit"
                  disabled={profileState === 'loading'}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-rose-500 px-4 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {profileState === 'loading' ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                  Search
                </button>
              </form>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div
                  className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(${scoreTone(profile.riskScore)} ${profile.riskScore * 3.6}deg, #1e293b 0deg)`,
                  }}
                >
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-slate-950">
                    <span className="font-mono text-3xl font-semibold text-white">{profile.riskScore}</span>
                    <span className="text-xs uppercase tracking-wide text-slate-500">{profile.riskBand}</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl font-semibold text-white">{profile.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{profile.personId}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profile.aliases.map((alias) => (
                      <span
                        key={alias}
                        className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300"
                      >
                        {alias}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Age / Gender</dt>
                  <dd className="mt-1 text-slate-200">
                    {profile.age} - {profile.gender}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Address</dt>
                  <dd className="mt-1 text-slate-200">{profile.lastKnownAddress}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Physical Notes</dt>
                  <dd className="mt-1 text-slate-200">{profile.physicalDescription}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center gap-2 text-amber-300">
                <Landmark size={19} />
                <h3 className="font-semibold text-white">Modus Operandi</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{profile.moSummary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.knownPatterns.map((pattern) => (
                  <span
                    key={pattern}
                    className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-100"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center gap-2 text-emerald-300">
                <Users size={19} />
                <h3 className="font-semibold text-white">Network Snapshot</h3>
              </div>
              <div className="mt-4 space-y-3">
                {profile.accomplices.map((accomplice) => (
                  <div
                    key={accomplice.name}
                    className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200">{accomplice.name}</p>
                      <p className="text-xs text-slate-500">{accomplice.relation}</p>
                    </div>
                    <span className="font-mono text-xs text-emerald-300">
                      {Math.round(accomplice.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center gap-2 text-violet-300">
                <MapPinned size={19} />
                <h3 className="font-semibold text-white">Operational Zones</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.operationalZones.map((zone) => (
                  <span
                    key={zone}
                    className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-100"
                  >
                    {zone}
                  </span>
                ))}
              </div>
              <p className="mt-4 font-mono text-xs text-slate-500">
                {profile.audit.action} - {profile.audit.resourceId} - {profile.audit.status}
              </p>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold text-white">Crime Timeline</h2>
            <div className="mt-5 space-y-4">
              {profile.cases.map((caseRecord) => (
                <article key={caseRecord.firId} className="border-l-2 border-rose-400/60 pl-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-mono text-sm text-white">{caseRecord.firId}</h3>
                    <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                      {caseRecord.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {caseRecord.date} - {caseRecord.station} - {caseRecord.category}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{caseRecord.summary}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
              <h2 className="text-lg font-semibold text-white">Suggested Preventive Actions</h2>
              <ul className="mt-4 space-y-3">
                {insights.preventiveActions.map((action) => (
                  <li key={action} className="flex gap-3 text-sm leading-6 text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
              <h2 className="text-lg font-semibold text-white">Evidence Citations</h2>
              <div className="mt-4 space-y-3">
                {insights.citations.slice(0, 4).map((citation) => (
                  <div key={citation.firId} className="border-l-2 border-cyan-400/60 pl-3">
                    <p className="font-mono text-xs text-cyan-300">{citation.firId}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {citation.station} - {citation.incidentDate}
                    </p>
                    <p className="mt-2 text-sm leading-5 text-slate-300">{citation.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
              <h2 className="text-lg font-semibold text-white">Analyst Guardrails</h2>
              <ul className="mt-4 space-y-3">
                {insights.limitations.map((limitation) => (
                  <li key={limitation} className="flex gap-3 text-sm leading-6 text-slate-400">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
