"use client";

import { useInvestigation } from "@/context/InvestigationContext";
import { FileText, Percent, ExternalLink } from "lucide-react";

export default function SimilarCases() {
    const { currentFIR } = useInvestigation();

    if (!currentFIR) return null;

    const similarCases = [
        {
            id: 'FIR-2023-089',
            similarity: 88,
            reason: 'Matches Modus Operandi (Cyber Fraud via Payment Link)',
            date: '2023-09-12'
        },
        {
            id: 'FIR-2022-412',
            similarity: 75,
            reason: 'Matches Suspect Physical Description & Location',
            date: '2022-11-04'
        },
        {
            id: 'FIR-2023-045',
            similarity: 62,
            reason: 'Common Bank Account detected in network',
            date: '2023-05-21'
        }
    ];

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg border border-blue-100 dark:border-blue-800">
                <h3 className="font-semibold text-sm mb-1">Semantic Similarity Search (Pinecone)</h3>
                <p className="text-xs">
                    The AI Orchestrator has converted the Modus Operandi of {currentFIR.CrimeNo} into a 768-dimensional vector to find semantically identical cases, even if different keywords were used by the recording officer.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {similarCases.map(c => (
                    <div key={c.id} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white dark:bg-slate-950 flex items-start gap-4 transition-all hover:shadow-md">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0 flex-col border border-slate-200 dark:border-slate-800">
                            <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{c.similarity}</span>
                            <span className="text-[10px] text-slate-500">% Match</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-semibold flex items-center gap-1">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    {c.id}
                                </h4>
                                <span className="text-xs text-slate-500">{c.date}</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                <span className="font-medium text-slate-900 dark:text-slate-300">Match Reason:</span> {c.reason}
                            </p>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-md transition-colors">
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
