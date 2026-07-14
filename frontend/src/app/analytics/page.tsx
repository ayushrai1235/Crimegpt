'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Brain,
  GitBranch,
  ShieldAlert,
  BarChart3,
  Map,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  Layers,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
  Cell
} from 'recharts';

const mockCrimeTrends = [
  { month: 'Jan', assault: 45, theft: 80, cyber: 30 },
  { month: 'Feb', assault: 52, theft: 70, cyber: 45 },
  { month: 'Mar', assault: 48, theft: 90, cyber: 55 },
  { month: 'Apr', assault: 61, theft: 85, cyber: 65 },
  { month: 'May', assault: 55, theft: 75, cyber: 80 },
  { month: 'Jun', assault: 67, theft: 95, cyber: 90 },
];

const mockHotspots = [
  { x: 10, y: 30, z: 200, area: 'Koramangala 5th Block', type: 'High Risk' },
  { x: 40, y: 50, z: 260, area: 'Indiranagar 100ft Rd', type: 'Critical' },
  { x: 80, y: 20, z: 150, area: 'Majestic Bus Stand', type: 'Moderate' },
  { x: 30, y: 80, z: 180, area: 'Electronic City Phase 1', type: 'Moderate' },
  { x: 60, y: 60, z: 320, area: 'Madiwala Market', type: 'Critical' },
  { x: 90, y: 70, z: 120, area: 'Whitefield IT Park', type: 'Low' },
];

const mockDSSRecommendations = [
  {
    id: 'REC-01',
    priority: 'High',
    title: 'Deploy additional night patrols in Madiwala',
    description: 'AI forecasts a 40% increase in vehicle theft incidents in Madiwala Market area based on recent geospatial clustering and historical weekend patterns.',
    confidence: 92,
  },
  {
    id: 'REC-02',
    priority: 'Medium',
    title: 'Initiate Cyber-awareness drive in tech corridors',
    description: 'A steady upward trend in cyber fraud reported. Recommend coordinating with local IT park security to disseminate advisory notices.',
    confidence: 85,
  },
  {
    id: 'REC-03',
    priority: 'High',
    title: 'Monitor known associates of PER-00491',
    description: 'Graph analysis shows increased communication between nodes linked to R. Kumar. Potential organized activity brewing in South Zone.',
    confidence: 88,
  }
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('6_months');

  return (
    <main className="min-h-screen bg-[#090b10] text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-[#090b10]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-blue-400 hover:text-blue-300"
              title="Back to CrimeGPT chat"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                Phase 5 Intelligence
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Analytics, Forecasting & DSS
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
              href="/insights"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300 transition hover:border-amber-400 hover:text-amber-300"
            >
              <Brain size={16} />
              Insights
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300 transition hover:border-blue-400 hover:text-blue-300"
            >
              <ShieldAlert size={16} />
              CrimeGPT
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-5 py-6">
        
        {/* KPI Cards */}
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Total Incidents (YTD)</span>
              <Layers className="text-blue-400" size={18} />
            </div>
            <p className="mt-3 font-mono text-3xl text-white">4,821</p>
            <p className="mt-1 text-xs text-emerald-400">↓ 4% vs last year</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Emerging Hotspots</span>
              <AlertOctagon className="text-rose-400" size={18} />
            </div>
            <p className="mt-3 font-mono text-3xl text-white">12</p>
            <p className="mt-1 text-xs text-slate-500">identified in last 7 days</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Active Predictions</span>
              <Activity className="text-violet-400" size={18} />
            </div>
            <p className="mt-3 font-mono text-3xl text-white">8</p>
            <p className="mt-1 text-xs text-slate-500">confidence score &gt; 80%</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">DSS Actions Taken</span>
              <CheckCircle2 className="text-emerald-400" size={18} />
            </div>
            <p className="mt-3 font-mono text-3xl text-white">142</p>
            <p className="mt-1 text-xs text-slate-500">interventions this quarter</p>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid gap-6 lg:grid-cols-2">
          
          {/* Analytics Dashboard (Req 3) */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-blue-400">
                <TrendingUp size={20} />
                <h2 className="text-lg font-semibold text-white">Crime Trend Analytics</h2>
              </div>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="h-8 rounded-lg border border-slate-700 bg-slate-950 px-2 text-xs text-slate-100 outline-none focus:border-blue-400"
              >
                <option value="6_months">Last 6 Months</option>
                <option value="1_year">Last Year</option>
              </select>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockCrimeTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '14px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="assault" name="Assault" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="theft" name="Vehicle Theft" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="cyber" name="Cyber Fraud" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Early Warning & Heatmaps (Req 8) */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
            <div className="flex items-center gap-2 text-rose-400 mb-6">
              <Map size={20} />
              <h2 className="text-lg font-semibold text-white">Geospatial Early Warning</h2>
            </div>
            
            <div className="h-[300px] w-full bg-slate-950 rounded-lg relative overflow-hidden border border-slate-800">
              {/* Abstract Map Background */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black" />
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <ResponsiveContainer width="100%" height="100%" className="relative z-10">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis type="number" dataKey="x" name="Longitude" hide domain={[0, 100]} />
                  <YAxis type="number" dataKey="y" name="Latitude" hide domain={[0, 100]} />
                  <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Intensity" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                            <p className="font-semibold text-white mb-1">{data.area}</p>
                            <p className={`text-xs uppercase font-bold tracking-wider ${
                              data.type === 'Critical' ? 'text-rose-500' : 
                              data.type === 'High Risk' ? 'text-amber-500' : 
                              'text-emerald-500'
                            }`}>{data.type}</p>
                            <p className="text-xs text-slate-400 mt-2">Predicted Intensity: {data.z}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Hotspots" data={mockHotspots} fill="#f43f5e" opacity={0.7}>
                    {
                      mockHotspots.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                          entry.type === 'Critical' ? '#f43f5e' : 
                          entry.type === 'High Risk' ? '#f59e0b' : '#3b82f6'
                        } />
                      ))
                    }
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex gap-4 text-xs text-slate-400 justify-center">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-rose-500 opacity-70"></span> Critical</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500 opacity-70"></span> High Risk</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 opacity-70"></span> Moderate</span>
            </div>
          </div>
        </section>

        {/* Decision Support System (Req 6) */}
        <section>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20">
            <div className="flex items-center gap-2 text-emerald-400 mb-6">
              <Brain size={20} />
              <h2 className="text-lg font-semibold text-white">AI Decision Support System (DSS)</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              {mockDSSRecommendations.map((rec) => (
                <div key={rec.id} className="relative rounded-lg border border-slate-700 bg-slate-950 p-5 flex flex-col justify-between group hover:border-emerald-500/50 transition-colors">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-mono text-xs text-slate-500">{rec.id}</span>
                      <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                        rec.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {rec.priority} Priority
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2 leading-tight">{rec.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{rec.description}</p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <span className="text-xs font-mono text-emerald-400">{rec.confidence}%</span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">AI Confidence</span>
                    </div>
                    <button className="text-xs bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 px-3 py-1.5 rounded transition-colors">
                      Action Lead
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
