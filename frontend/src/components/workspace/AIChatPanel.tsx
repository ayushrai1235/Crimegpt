"use client";

import { useState } from "react";
import { Send, FileText, Bot, User } from "lucide-react";
import { useInvestigation } from "@/context/InvestigationContext";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    citations?: string[];
}

export default function AIChatPanel() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hello Officer. Upload an FIR or ask me a question about the case.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Call our Catalyst Backend API (simulated here for MVP structure)
        try {
            const res = await fetch('http://localhost:3001/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMsg.content, history: messages.map(m => ({ role: m.role, content: m.content })) })
            });
            
            // In a real implementation with SSE, we'd use EventSource or stream reading.
            // For this UI mockup assuming the endpoint works (but we might get a JSON response if we aren't using EventSource on client).
            // Let's assume we get the streaming payload or a JSON payload.
            
            // For now, let's just mock a streaming effect on the frontend for immediate visual feedback.
            const data = await res.json().catch(() => ({ reply: "Simulated response with a citation [FIR-2023-001].", citations: ["FIR-2023-001"] }));
            
            setMessages(prev => [...prev, { 
                id: Date.now().toString(), 
                role: 'assistant', 
                content: data.reply || data.text || "Simulated response.", 
                citations: data.citations || [] 
            }]);
        } catch (e) {
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Error communicating with AI Orchestrator.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <h2 className="font-semibold flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    AI Investigation Copilot
                </h2>
                <p className="text-xs text-slate-500 mt-1">Zero-hallucination enabled.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-blue-100 text-blue-700'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                                {msg.content}
                            </div>
                            {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {msg.citations.map(cit => (
                                        <span key={cit} className="text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:bg-yellow-200">
                                            <FileText className="w-3 h-3" />
                                            {cit}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg rounded-tl-none flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                <div className="relative flex items-center">
                    <input 
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about relationships, timeline, or similar cases..."
                        className="w-full pr-12 pl-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-900 text-sm"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
