"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FIRData {
    CrimeNo: string;
    BriefFacts: string;
    Accused: { AccusedName: string; PersonID: string }[];
    Victims: { VictimName: string }[];
}

interface InvestigationContextType {
    currentFIR: FIRData | null;
    setCurrentFIR: (fir: FIRData | null) => void;
    activeTab: 'evidence' | 'timeline' | 'similar' | 'network' | 'map';
    setActiveTab: (tab: 'evidence' | 'timeline' | 'similar' | 'network' | 'map') => void;
    uploadStatus: 'idle' | 'uploading' | 'extracting' | 'done' | 'error';
    setUploadStatus: (status: 'idle' | 'uploading' | 'extracting' | 'done' | 'error') => void;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export const InvestigationProvider = ({ children }: { children: ReactNode }) => {
    const [currentFIR, setCurrentFIR] = useState<FIRData | null>(null);
    const [activeTab, setActiveTab] = useState<'evidence' | 'timeline' | 'similar' | 'network' | 'map'>('evidence');
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'extracting' | 'done' | 'error'>('idle');

    return (
        <InvestigationContext.Provider value={{
            currentFIR, setCurrentFIR,
            activeTab, setActiveTab,
            uploadStatus, setUploadStatus
        }}>
            {children}
        </InvestigationContext.Provider>
    );
};

export const useInvestigation = () => {
    const context = useContext(InvestigationContext);
    if (context === undefined) {
        throw new Error('useInvestigation must be used within an InvestigationProvider');
    }
    return context;
};
