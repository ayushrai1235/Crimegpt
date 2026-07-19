"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
                <header className="h-16 border-b bg-white dark:bg-slate-950 flex items-center px-6 shrink-0 justify-between">
                    <h1 className="font-semibold text-xl">State Crime Analytics</h1>
                    <div className="flex gap-4 items-center">
                        <span className="text-sm text-slate-500">Live Updating</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </header>
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </QueryClientProvider>
    );
}
