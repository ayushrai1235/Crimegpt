'use client';

import { useState, useEffect, useRef } from 'react';
import { Brain, GitBranch, Mic, Send, Download, Globe, ShieldAlert, FileText, BarChart3 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import Link from 'next/link';

interface EvidenceCitation {
  CrimeNo?: string;
  id?: string;
  [key: string]: unknown;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: EvidenceCitation[];
}

interface ChatResponse {
  reply?: string;
  citations?: EvidenceCitation[];
}

interface SpeechRecognitionResultEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}

export default function CrimeGPTChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const [isLoading, setIsLoading] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      const speechWindow = window as SpeechRecognitionWindow;
      const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

      if (!SpeechRecognition) return;

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: SpeechRecognitionResultEventLike) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(prev => prev + ' ' + transcript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEventLike) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'kn' ? 'kn-IN' : 'en-US';
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setInput(''); // Clear input for new speech
    }
    setIsListening(!isListening);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: userMessage, 
          history: messages, // Context-awareness passed to backend
          language 
        })
      });

      const data = (await res.json()) as ChatResponse;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply || 'Information not found in the current records.',
        citations: data.citations
      }]);
    } catch (error) {
      console.error('Error fetching chat:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection Error: Unable to reach CrimeGPT Catalyst Backend.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(20, 50, 150);
    doc.text('CrimeGPT - Official Intelligence Transcript', 10, 15);
    
    let y = 30;
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    
    messages.forEach((msg) => {
      const isUser = msg.role === 'user';
      const roleText = isUser ? 'Investigating Officer: ' : 'CrimeGPT AI: ';
      
      doc.setFont('helvetica', 'bold');
      doc.text(roleText, 10, y);
      
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(msg.content, 180);
      doc.text(splitText, 10, y + 6);
      y += (splitText.length * 5) + 12;
      
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`CrimeGPT-Transcript-${new Date().getTime()}.pdf`);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 text-slate-100 font-sans">
      {/* Premium Glassmorphism Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-slate-900/60 backdrop-blur-md border-b border-blue-900/50 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
            <ShieldAlert className="text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">CrimeGPT</h1>
            <p className="text-xs text-blue-200/60 uppercase tracking-widest font-semibold">KSP Intelligence Console</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/network"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all duration-300 shadow-sm"
          >
            <GitBranch size={16} className="text-emerald-400" />
            <span className="text-sm font-medium">Network</span>
          </Link>
          <Link
            href="/insights"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all duration-300 shadow-sm"
          >
            <Brain size={16} className="text-amber-400" />
            <span className="text-sm font-medium">Insights</span>
          </Link>
          <Link
            href="/analytics"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all duration-300 shadow-sm"
          >
            <BarChart3 size={16} className="text-violet-400" />
            <span className="text-sm font-medium">Analytics</span>
          </Link>
          <button 
            onClick={() => setLanguage(prev => prev === 'en' ? 'kn' : 'en')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all duration-300 shadow-sm"
          >
            <Globe size={16} className="text-blue-400" />
            <span className="text-sm font-medium">{language === 'en' ? 'English' : 'ಕನ್ನಡ'}</span>
          </button>
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            <Download size={16} />
            <span className="text-sm font-medium">Export Record</span>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 space-y-6 max-w-2xl mx-auto">
            <div className="w-24 h-24 rounded-full bg-blue-900/20 flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
              <ShieldAlert size={48} className="text-blue-500/50" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-200 mb-2">Secure Investigation Terminal</h2>
              <p className="text-slate-500 leading-relaxed">Ask questions regarding active cases, criminal networks, or request sociological analysis of crime patterns. All queries are strictly cross-referenced against official KSP FIR data.</p>
            </div>
            <div className="flex gap-4 w-full">
              <button onClick={() => setInput("Identify repeat offender networks operating in Bangalore over the last year.")} className="flex-1 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition text-sm text-left">
                Identify repeat offender networks operating in Bangalore over the last year.
              </button>
              <button onClick={() => setInput("Show me all active zero FIRs related to cybercrime.")} className="flex-1 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition text-sm text-left">
                Show me all active zero FIRs related to cybercrime.
              </button>
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[75%] p-5 rounded-2xl shadow-md ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm' 
                : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-sm backdrop-blur-sm'
            }`}>
              <div className="flex items-center gap-2 mb-2 opacity-70">
                {msg.role === 'assistant' && <ShieldAlert size={14} />}
                <span className="text-xs uppercase tracking-wider font-semibold">
                  {msg.role === 'user' ? 'You' : 'CrimeGPT'}
                </span>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              
              {/* Citations / Explainable AI */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-5 pt-3 border-t border-slate-700/50">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-2 flex items-center gap-1">
                    <FileText size={12} /> Verified Sources
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.citations.map((cite, i) => (
                      <span key={i} className="text-xs bg-slate-950 border border-blue-900/30 px-3 py-1.5 rounded-full text-blue-300 hover:bg-blue-900/20 transition cursor-pointer flex items-center gap-1">
                        #{cite.CrimeNo || cite.id || `FIR-${i+1}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl rounded-tl-sm backdrop-blur-sm flex items-center gap-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              </div>
              <span className="text-sm text-slate-400 font-medium tracking-wide">Cross-referencing databases...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/80 relative">
        <div className="max-w-4xl mx-auto flex gap-3 relative z-10">
          <button 
            onClick={toggleListening}
            className={`p-4 rounded-xl transition-all duration-300 flex items-center justify-center min-w-[56px] shadow-sm ${
              isListening 
                ? 'bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                : 'bg-slate-900 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-blue-400'
            }`}
            title={isListening ? "Stop Voice Input" : "Start Voice Input"}
          >
            {isListening ? (
              <div className="relative">
                <Mic size={22} className="animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
            ) : <Mic size={22} />}
          </button>
          
          <div className="flex-1 relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'en' ? "Query Crime Data or ask for analytical insights..." : "ಅಪರಾಧ ದತ್ತಾಂಶವನ್ನು ಪ್ರಶ್ನಿಸಿ..."}
              className="w-full h-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/50 text-slate-100 transition-all shadow-inner"
            />
          </div>
          
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
          >
            <span>Send</span>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
