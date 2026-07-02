'use client';

import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { ShieldAlert, Network as NetworkIcon, Filter } from 'lucide-react';
import Link from 'next/link';

export default function CriminalNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        // Assuming crimegpt-graph-service runs on 3002 locally
        const res = await fetch('http://localhost:3002/network');
        const data = await res.json();

        if (containerRef.current) {
          const options = {
            nodes: {
              shape: 'dot',
              size: 20,
              font: { color: '#e2e8f0', size: 14 },
              borderWidth: 2,
              shadow: true
            },
            edges: {
              width: 2,
              color: { color: '#475569', highlight: '#3b82f6' },
              font: { color: '#94a3b8', size: 12, align: 'middle' },
              smooth: { type: 'continuous' }
            },
            groups: {
              Person: { color: { background: '#ef4444', border: '#991b1b' }, shape: 'icon', icon: { face: 'FontAwesome', code: '\uf007', size: 50, color: '#ef4444' } },
              FIR: { color: { background: '#3b82f6', border: '#1d4ed8' } },
              FinancialAccount: { color: { background: '#10b981', border: '#047857' } }
            },
            physics: {
              barnesHut: { gravitationalConstant: -30000, springLength: 150, springConstant: 0.04 },
              stabilization: { iterations: 200 }
            }
          };

          const newNetwork = new Network(containerRef.current, data, options);
          setNetwork(newNetwork);
        }
      } catch (error) {
        console.error('Failed to load network graph', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraph();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-lg z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition">
            <ShieldAlert className="text-blue-400" size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Criminal Network Analysis</h1>
            <p className="text-xs text-blue-400 uppercase tracking-widest font-semibold">Financial & Association Tracing</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition shadow-sm">
            <Filter size={16} className="text-blue-400" />
            <span className="text-sm font-medium">Filter Nodes</span>
          </button>
        </div>
      </header>

      {/* Graph Area */}
      <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-950/50 backdrop-blur-sm">
            <NetworkIcon className="animate-spin text-blue-500 mb-4" size={48} />
            <p className="text-lg font-medium text-slate-300">Rendering Neo4j Graph Associations...</p>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
        
        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-xl">
          <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Node Legend</h3>
          <div className="flex flex-col gap-2 text-sm text-slate-400">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-blue-500 border border-blue-700"></div> FIR Case</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500 border border-red-700"></div> Person (Accused/Victim)</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500 border border-emerald-700"></div> Financial Account</div>
          </div>
        </div>
      </div>
    </div>
  );
}
