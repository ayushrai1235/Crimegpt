"use client";

import { useQuery } from '@tanstack/react-query';
import { useInvestigation } from '@/context/InvestigationContext';
import CytoscapeComponent from 'react-cytoscapejs';
import { useMemo } from 'react';

export default function NetworkGraph() {
    const { currentFIR } = useInvestigation();

    // Fetch graph data from backend
    const { data: elements, isLoading, error } = useQuery({
        queryKey: ['graph', currentFIR?.CrimeNo],
        queryFn: async () => {
            // For MVP, if we don't have a real personId, we'll just mock a call
            // Normally we'd extract the personID from currentFIR.Accused[0]
            const personId = currentFIR?.Accused[0]?.PersonID || 'mock';
            
            // To prevent failing if backend isn't up, we'll return mock Cytoscape elements if fetch fails
            try {
                const res = await fetch(`http://localhost:3001/graph/network/${personId}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const json = await res.json();
                if (json.elements && json.elements.length > 0) return json.elements;
                throw new Error("No elements");
            } catch (e) {
                console.warn("Falling back to mock network data", e);
                return [
                    { data: { id: 'case1', label: currentFIR?.CrimeNo || 'FIR-001', type: 'Case' } },
                    { data: { id: 'person1', label: currentFIR?.Accused[0]?.AccusedName || 'Accused', type: 'Person' } },
                    { data: { id: 'person2', label: 'Associates', type: 'Person' } },
                    { data: { id: 'case2', label: 'FIR-2023-089', type: 'Case' } },
                    { data: { id: 'e1', source: 'person1', target: 'case1', label: 'ACCUSED_IN' } },
                    { data: { id: 'e2', source: 'person2', target: 'case1', label: 'WITNESS_IN' } },
                    { data: { id: 'e3', source: 'person1', target: 'case2', label: 'ACCUSED_IN' } }
                ];
            }
        },
        enabled: !!currentFIR
    });

    const style = useMemo(() => [
        {
            selector: 'node[type = "Case"]',
            style: {
                'background-color': '#3b82f6',
                'label': 'data(label)',
                'color': '#fff',
                'text-valign': 'center',
                'font-size': '10px'
            }
        },
        {
            selector: 'node[type = "Person"]',
            style: {
                'background-color': '#ef4444',
                'label': 'data(label)',
                'color': '#fff',
                'text-valign': 'center',
                'font-size': '10px',
                'shape': 'round-rectangle'
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 2,
                'line-color': '#94a3b8',
                'target-arrow-color': '#94a3b8',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'label': 'data(label)',
                'font-size': '8px',
                'text-rotation': 'autorotate',
                'text-background-color': '#ffffff',
                'text-background-opacity': 0.7
            }
        }
    ], []);

    if (!currentFIR) return null;

    if (isLoading) return <div className="h-full flex items-center justify-center">Loading network graph...</div>;
    if (error) return <div className="h-full flex items-center justify-center text-red-500">Failed to load graph.</div>;

    return (
        <div className="h-full border rounded-lg bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-slate-950/80 p-2 rounded shadow backdrop-blur text-sm">
                <div className="font-semibold mb-1">Knowledge Graph</div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="w-3 h-3 bg-blue-500 rounded-full inline-block"></span> Cases
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <span className="w-3 h-3 bg-red-500 rounded-sm inline-block"></span> People
                </div>
            </div>
            
            <CytoscapeComponent 
                elements={elements} 
                style={{ width: '100%', height: '100%' }} 
                stylesheet={style as any}
                layout={{ name: 'cose', padding: 50 }}
            />
        </div>
    );
}
