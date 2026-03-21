/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { 
  BrainCircuit, 
  LayoutDashboard,
  ChevronRight,
  History,
  Trash2,
  Menu,
  Sun,
  Moon,
  X as CloseIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeDecision, AnalysisResult, AnalysisType } from './services/geminiService';
import { cn } from './lib/utils';
import DecisionIntelligence from './components/DecisionIntelligence';
import DataDashboard from './components/DataDashboard';

interface HistoryItem extends AnalysisResult {
  id: string;
  decision: string;
  timestamp: number;
}

type ToolType = 'decision' | 'dashboard';
type Theme = 'light' | 'dark';

export default function App() {
  // Navigation State
  const [activeTool, setActiveTool] = useState<ToolType>('decision');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Decision Intelligence State (Persistent)
  const [decision, setDecision] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('pros-cons');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (!decision.trim()) return;
    
    setIsLoading(true);
    try {
      const analysis = await analyzeDecision(decision, analysisType);
      setResult(analysis);
      
      const newItem: HistoryItem = {
        ...analysis,
        id: crypto.randomUUID(),
        decision,
        timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev]);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [decision, analysisType]);

  const clearHistory = () => {
    setHistory([]);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setDecision(item.decision);
    setAnalysisType(item.type);
    setResult({
      type: item.type,
      content: item.content,
      summary: item.summary,
      pros: item.pros,
      cons: item.cons,
      strengths: item.strengths,
      weaknesses: item.weaknesses,
      opportunities: item.opportunities,
      threats: item.threats
    });
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-[#0071E3] selection:text-white flex transition-colors duration-300">
      {/* Navigation Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="sticky top-0 h-screen bg-white border-r border-[#D2D2D7]/50 flex flex-col z-40 transition-all duration-300 ease-in-out"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div 
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#0071E3] to-[#00C7FF] rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <span className="font-bold text-[17px] tracking-tight whitespace-nowrap">PM Tool Suite</span>
              </motion.div>
            ) : (
              <motion.div 
                key="logo-short"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-8 h-8 bg-gradient-to-br from-[#0071E3] to-[#00C7FF] rounded-lg flex items-center justify-center text-white shadow-sm mx-auto"
              >
                <BrainCircuit className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          {[
            { id: 'decision', label: 'Decision Intelligence', icon: BrainCircuit },
            { id: 'dashboard', label: 'Insight Dashboard', icon: LayoutDashboard },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as ToolType)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative",
                activeTool === tool.id 
                  ? "bg-[#F5F5F7] text-[#0071E3]" 
                  : "text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
              )}
            >
              <tool.icon className={cn("w-5 h-5 shrink-0", activeTool === tool.id ? "text-[#0071E3]" : "text-[#86868B] group-hover:text-[#1D1D1F]")} />
              {isSidebarOpen && (
                <span className="font-semibold text-[15px] whitespace-nowrap">{tool.label}</span>
              )}
              {activeTool === tool.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-[#0071E3] rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#D2D2D7]/50">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 hover:bg-[#F5F5F7] rounded-xl transition-colors text-[#86868B]"
          >
            {isSidebarOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 w-full bg-[#F5F5F7]/80 backdrop-blur-md border-b border-[#D2D2D7]/50">
          <div className="max-w-6xl mx-auto px-8 h-16 flex justify-between items-center">
            <h1 className="font-semibold text-[19px] tracking-tight">
              {activeTool === 'decision' ? 'Business Decision Intelligence' : 'Data Driven Insight Dashboard'}
            </h1>
            <div className="flex items-center gap-3">
              {activeTool === 'decision' && (
                <button 
                  onClick={() => setShowHistory(!history)}
                  className="p-2 hover:bg-[#E8E8ED] transition-colors rounded-full"
                  title="History"
                >
                  <History className="w-5 h-5 text-[#424245]" />
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className={cn(
            "mx-auto px-8 py-12 transition-all duration-500",
            activeTool === 'decision' ? "max-w-4xl" : "max-w-7xl"
          )}>
            <AnimatePresence mode="wait">
              {activeTool === 'decision' ? (
                <motion.div
                  key="decision-tool"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DecisionIntelligence 
                    decision={decision}
                    setDecision={setDecision}
                    analysisType={analysisType}
                    setAnalysisType={setAnalysisType}
                    isLoading={isLoading}
                    result={result}
                    handleAnalyze={handleAnalyze}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="dashboard-tool"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DataDashboard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#D2D2D7]/50 py-8 px-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px] font-medium text-[#86868B]">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" />
              <span>Product Manager Tool Suite v1.1</span>
            </div>
            <div className="flex items-center gap-6">
              <span>Powered by Gemini AI</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-[#1D1D1F] transition-colors">Privacy</a>
                <a href="#" className="hover:text-[#1D1D1F] transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* History Sidebar (Only for Decision Tool) */}
      <AnimatePresence>
        {showHistory && activeTool === 'decision' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[60] flex flex-col"
            >
              <div className="p-6 border-b border-[#D2D2D7]/50 flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight">Analysis History</h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-[#F5F5F7] rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-6 space-y-4">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-30">
                    <History className="w-12 h-12" />
                    <p className="text-lg font-medium">No history yet.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left p-5 rounded-2xl border border-[#D2D2D7]/50 hover:border-[#0071E3] hover:bg-[#F5F5F7] transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] font-bold bg-[#F5F5F7] text-[#1D1D1F] px-2 py-0.5 rounded-full uppercase tracking-wider group-hover:bg-[#0071E3] group-hover:text-white transition-colors">
                          {item.type}
                        </span>
                      </div>
                      <p className="font-semibold line-clamp-2 text-[15px] leading-snug">
                        {item.decision}
                      </p>
                    </button>
                  ))
                )}
              </div>

              {history.length > 0 && (
                <div className="p-6 border-t border-[#D2D2D7]/50">
                  <button
                    onClick={clearHistory}
                    className="w-full py-3.5 flex items-center justify-center gap-2 text-[13px] font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear History
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
