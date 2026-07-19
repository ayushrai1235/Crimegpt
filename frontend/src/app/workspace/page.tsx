"use client";

import { useInvestigation } from "@/context/InvestigationContext";
import AIChatPanel from "@/components/workspace/AIChatPanel";
import EvidenceExplorer from "@/components/workspace/EvidenceExplorer";
import NetworkGraph from "@/components/workspace/NetworkGraph";
import SimilarCases from "@/components/workspace/SimilarCases";
import Timeline from "@/components/workspace/Timeline";
import MapView from "@/components/workspace/MapView";
import { Upload } from "lucide-react";
import { useRef } from "react";

export default function WorkspacePage() {
    const { activeTab, setActiveTab, currentFIR, setUploadStatus, setCurrentFIR } = useInvestigation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadStatus('uploading');
        
        // Mocking the upload process since we aren't hooking to a real backend file storage right this second
        // In real app, we'd send FormData to /upload
        
        setTimeout(() => {
            setUploadStatus('extracting');
            setTimeout(() => {
                setCurrentFIR({
                    CrimeNo: "FIR-2023-001",
                    BriefFacts: "Mock extracted facts from the uploaded document.",
                    Accused: [{ AccusedName: "Raju", PersonID: "PER-123" }],
                    Victims: [{ VictimName: "Anil" }]
                });
                setUploadStatus('done');
            }, 1500);
        }, 1000);
    };

    return (
        <div className="flex h-full w-full">
            {/* Left Panel: Content Tabs */}
            <div className="flex-1 flex flex-col border-r bg-white dark:bg-slate-950">
                
                {/* Tab Navigation */}
                <div className="flex border-b bg-slate-50/50 dark:bg-slate-900/50 p-2 gap-2">
                    {['evidence', 'timeline', 'similar', 'network', 'map'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'evidence' | 'timeline' | 'similar' | 'network' | 'map')}
                            className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                                activeTab === tab 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                    
                    <div className="ml-auto">
                        <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={handleFileUpload} />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800"
                        >
                            <Upload className="w-4 h-4" />
                            Upload FIR
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-4">
                    {!currentFIR ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <Upload className="w-12 h-12 mb-4 text-slate-300" />
                            <p>Upload an FIR to begin investigation.</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'evidence' && <EvidenceExplorer />}
                            {activeTab === 'network' && <NetworkGraph />}
                            {activeTab === 'timeline' && <Timeline />}
                            {activeTab === 'similar' && <SimilarCases />}
                            {activeTab === 'map' && <MapView />}
                        </>
                    )}
                </div>
            </div>

            {/* Right Panel: AI Copilot Chat */}
            <div className="w-[450px] shrink-0 bg-slate-50 dark:bg-slate-900 flex flex-col">
                <AIChatPanel />
            </div>
        </div>
    );
}
