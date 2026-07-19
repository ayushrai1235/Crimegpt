"use client";

import { useInvestigation } from "@/context/InvestigationContext";

export default function EvidenceExplorer() {
    const { currentFIR } = useInvestigation();

    if (!currentFIR) return null;

    return (
        <div className="h-full flex gap-4">
            {/* Left side: PDF viewer mock */}
            <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 left-4 right-4 bg-white dark:bg-slate-900 p-8 shadow-sm text-sm font-serif text-slate-800 dark:text-slate-300 min-h-[800px]">
                    <div className="text-center font-bold mb-6 underline">FIRST INFORMATION REPORT</div>
                    <div className="mb-4">
                        <span className="font-bold">1. Crime No:</span> {currentFIR.CrimeNo}
                    </div>
                    <div className="mb-4">
                        <span className="font-bold">2. Accused:</span> {currentFIR.Accused.map(a => a.AccusedName).join(', ')}
                    </div>
                    <div className="mb-4">
                        <span className="font-bold">3. Victim:</span> {currentFIR.Victims.map(v => v.VictimName).join(', ')}
                    </div>
                    <div className="mb-4">
                        <span className="font-bold">4. Brief Facts:</span>
                        <p className="mt-2 text-justify">{currentFIR.BriefFacts}</p>
                    </div>
                </div>
            </div>

            {/* Right side: Extracted Metadata Panel */}
            <div className="w-80 shrink-0 flex flex-col gap-4">
                <div className="bg-white dark:bg-slate-900 border rounded-lg p-4">
                    <h3 className="font-semibold text-sm mb-3">Extracted Metadata</h3>
                    
                    <div className="space-y-3">
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-medium">Crime Number</div>
                            <div className="text-sm">{currentFIR.CrimeNo}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-medium">Primary Offense</div>
                            <div className="text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 inline-block px-2 py-0.5 rounded mt-1">
                                Identified by AI
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border rounded-lg p-4 flex-1">
                    <h3 className="font-semibold text-sm mb-3">Entities Detected</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs font-semibold mb-2">Accused</div>
                            {currentFIR.Accused.map((a, i) => (
                                <div key={i} className="text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded mb-2 border border-slate-100 dark:border-slate-700">
                                    <div className="font-medium">{a.AccusedName}</div>
                                    <div className="text-xs text-slate-500">ID: {a.PersonID}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
