"use client";

import { useInvestigation } from "@/context/InvestigationContext";

export default function Timeline() {
    const { currentFIR } = useInvestigation();

    if (!currentFIR) return null;

    const events = [
        { date: '2023-10-12 14:00', title: 'Crime Occurred', desc: 'Accused executed cyber fraud.', type: 'incident' },
        { date: '2023-10-14 09:30', title: 'FIR Filed', desc: currentFIR.CrimeNo + ' registered at Police Station.', type: 'admin' },
        { date: '2023-10-15 11:00', title: 'Evidence Collected', desc: 'Bank statements acquired.', type: 'investigation' },
        { date: '2023-10-18 16:45', title: 'Arrest Made', desc: 'Primary accused apprehended.', type: 'action' }
    ];

    return (
        <div className="h-full p-4">
            <div className="max-w-2xl mx-auto">
                <h3 className="font-semibold text-lg mb-6">Chronological Timeline</h3>
                
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 md:ml-4 space-y-8">
                    {events.map((evt, i) => (
                        <div key={i} className="relative pl-6 md:pl-8">
                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-950 ${
                                evt.type === 'incident' ? 'bg-red-500' : 
                                evt.type === 'action' ? 'bg-green-500' :
                                'bg-blue-500'
                            }`}></div>
                            
                            <div className="flex flex-col md:flex-row md:items-baseline md:gap-4 mb-1">
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 shrink-0 w-32">{evt.date}</span>
                                <h4 className="text-base font-medium text-slate-900 dark:text-slate-100">{evt.title}</h4>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{evt.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
