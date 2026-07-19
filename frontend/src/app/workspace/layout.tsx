"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InvestigationProvider } from '@/context/InvestigationContext';
import { useState } from 'react';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <InvestigationProvider>
                <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
                    <header className="h-14 border-b bg-white dark:bg-slate-950 flex items-center px-6 shrink-0">
                        <h1 className="font-semibold text-lg">CrimeGPT Investigation Workspace</h1>
                    </header>
                    <main className="flex-1 overflow-hidden">
                        {children}
                    </main>
                </div>
            </InvestigationProvider>
        </QueryClientProvider>
    );
}
