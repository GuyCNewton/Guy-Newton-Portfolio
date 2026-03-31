import React from 'react';
import { 
  Scale, 
  Table as TableIcon, 
  Zap, 
  Loader2, 
  Download,
  Share2,
  Check,
  X,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnalysisResult, AnalysisType } from '../services/geminiService';
import { cn } from '../lib/utils';

interface DecisionIntelligenceProps {
  decision: string;
  setDecision: (val: string) => void;
  analysisType: AnalysisType;
  setAnalysisType: (val: AnalysisType) => void;
  isLoading: boolean;
  result: AnalysisResult | null;
  handleAnalyze: () => void;
}

export default function DecisionIntelligence({
  decision,
  setDecision,
  analysisType,
  setAnalysisType,
  isLoading,
  result,
  handleAnalyze
}: DecisionIntelligenceProps) {
  return (
    <div className="space-y-12 pb-12">
      {/* 1. The Decision Box */}
      <section className="space-y-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#D2D2D7]/50 space-y-4">
          <label className="text-[13px] font-semibold text-[#86868B] uppercase tracking-wider">
            The Decision
          </label>
          <textarea
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            placeholder="e.g., Should we expand our operations to the European market this quarter?"
            className="w-full h-40 p-0 bg-transparent focus:outline-none resize-none text-[17px] sm:text-[19px] leading-relaxed placeholder:text-[#D2D2D7] font-medium"
          />
        </div>
      </section>

      {/* 2. Framework Selection */}
      <section className="space-y-8">
        <div className="text-center space-y-2 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight sm:text-4xl text-[#1D1D1F]">Analyze with clarity.</h2>
          <p className="text-[#86868B] text-base sm:text-lg font-medium">Choose a framework for your intelligence report.</p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 px-4">
          {[
            { id: 'pros-cons', label: 'Pros & Cons', icon: Scale },
            { id: 'comparison', label: 'Comparison Matrix', icon: TableIcon },
            { id: 'swot', label: 'SWOT Analysis', icon: Zap },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setAnalysisType(type.id as AnalysisType)}
              className={cn(
                "flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all text-[14px] sm:text-[15px] font-semibold",
                analysisType === type.id 
                  ? "bg-[#0071E3] text-white shadow-lg shadow-[#0071E3]/20" 
                  : "bg-white text-[#1D1D1F] hover:bg-[#F2F2F7] shadow-sm border border-[#D2D2D7]/50"
              )}
            >
              <type.icon className="w-4 h-4" />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Generate Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !decision.trim()}
          className="max-w-md w-full py-5 bg-[#0071E3] text-white font-semibold text-[18px] rounded-full hover:bg-[#0077ED] disabled:bg-[#D2D2D7] disabled:cursor-not-allowed transition-all shadow-xl shadow-[#0071E3]/25 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate Intelligence
            </>
          )}
        </button>
      </div>

      {/* 4. Output Section */}
      <section className="pt-12 min-h-[600px] flex flex-col">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1 flex flex-col space-y-10"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#D2D2D7]/50 space-y-6">
                <div className="flex justify-between items-start">
                  <label className="text-[13px] font-semibold text-[#86868B] uppercase tracking-wider">
                    Executive Summary
                  </label>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-[#F5F5F7] rounded-full transition-colors text-[#424245]">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-[#F5F5F7] rounded-full transition-colors text-[#424245]">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-semibold leading-tight tracking-tight text-[#1D1D1F]">
                  {result.summary}
                </p>
              </div>

              {result.type === 'pros-cons' && result.pros && result.cons ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  {/* Pros Column */}
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#D2D2D7]/50 flex flex-col">
                    <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
                      <h3 className="text-[17px] font-bold text-emerald-600 uppercase tracking-wider">Pros</h3>
                    </div>
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex-1 overflow-auto">
                      <ul className="space-y-5">
                        {result.pros.map((pro, idx) => (
                          <li key={idx} className="flex gap-4 text-[14px] sm:text-[15px] leading-relaxed font-medium">
                            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-emerald-600" />
                            </div>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {/* Cons Column */}
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#D2D2D7]/50 flex flex-col">
                    <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
                      <h3 className="text-[17px] font-bold text-rose-600 uppercase tracking-wider">Cons</h3>
                    </div>
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex-1 overflow-auto">
                      <ul className="space-y-5">
                        {result.cons.map((con, idx) => (
                          <li key={idx} className="flex gap-4 text-[14px] sm:text-[15px] leading-relaxed font-medium">
                            <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
                              <X className="w-3 h-3 text-rose-600" />
                            </div>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : result.type === 'swot' && result.strengths && result.weaknesses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  {/* Strengths */}
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#D2D2D7]/50 flex flex-col">
                    <div className="px-8 pt-8 pb-4">
                      <h3 className="text-[17px] font-bold text-emerald-600 uppercase tracking-wider">Strengths</h3>
                    </div>
                    <div className="px-8 pb-8 flex-1 overflow-auto">
                      <ul className="space-y-5">
                        {result.strengths.map((s, idx) => (
                          <li key={idx} className="flex gap-4 text-[15px] leading-relaxed font-medium">
                            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-emerald-600" />
                            </div>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {/* Weaknesses */}
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#D2D2D7]/50 flex flex-col">
                    <div className="px-8 pt-8 pb-4">
                      <h3 className="text-[17px] font-bold text-rose-600 uppercase tracking-wider">Weaknesses</h3>
                    </div>
                    <div className="px-8 pb-8 flex-1 overflow-auto">
                      <ul className="space-y-5">
                        {result.weaknesses.map((w, idx) => (
                          <li key={idx} className="flex gap-4 text-[15px] leading-relaxed font-medium">
                            <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
                              <X className="w-3 h-3 text-rose-600" />
                            </div>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {/* Opportunities */}
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#D2D2D7]/50 flex flex-col">
                    <div className="px-8 pt-8 pb-4">
                      <h3 className="text-[17px] font-bold text-[#0071E3] uppercase tracking-wider">Opportunities</h3>
                    </div>
                    <div className="px-8 pb-8 flex-1 overflow-auto">
                      <ul className="space-y-5">
                        {result.opportunities?.map((o, idx) => (
                          <li key={idx} className="flex gap-4 text-[15px] leading-relaxed font-medium">
                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                              <ChevronRight className="w-3 h-3 text-[#0071E3]" />
                            </div>
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {/* Threats */}
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#D2D2D7]/50 flex flex-col">
                    <div className="px-8 pt-8 pb-4">
                      <h3 className="text-[17px] font-bold text-amber-600 uppercase tracking-wider">Threats</h3>
                    </div>
                    <div className="px-8 pb-8 flex-1 overflow-auto">
                      <ul className="space-y-5">
                        {result.threats?.map((t, idx) => (
                          <li key={idx} className="flex gap-4 text-[15px] leading-relaxed font-medium">
                            <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                              <Zap className="w-3 h-3 text-amber-600" />
                            </div>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#D2D2D7]/50 overflow-auto flex-1">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl font-bold mb-6 tracking-tight">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold mb-4 mt-8 tracking-tight">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-bold mb-3 mt-6 tracking-tight">{children}</h3>,
                      p: ({ children }) => <p className="mb-4 leading-relaxed text-[15px] text-[#424245]">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-6 space-y-2 text-[15px] text-[#424245]">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-6 space-y-2 text-[15px] text-[#424245]">{children}</ol>,
                      li: ({ children }) => <li className="pl-1">{children}</li>,
                      table: ({ children }) => (
                        <div className="overflow-x-auto mb-8 rounded-xl border border-[#D2D2D7]/50">
                          <table className="w-full text-sm">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => <thead className="bg-[#F5F5F7] border-b border-[#D2D2D7]/50">{children}</thead>,
                      th: ({ children }) => <th className="p-4 text-left font-bold text-[#1D1D1F]">{children}</th>,
                      td: ({ children }) => <td className="p-4 border-b border-[#D2D2D7]/30 text-[#424245]">{children}</td>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-[#0071E3] pl-6 italic my-6 text-lg text-[#86868B]">{children}</blockquote>,
                    }}
                  >
                    {result.content}
                  </ReactMarkdown>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 bg-white/50 rounded-3xl border-2 border-dashed border-[#D2D2D7] flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="space-y-6 max-w-sm">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto">
                  <BrainCircuit className="w-8 h-8 text-[#0071E3]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight">Ready to analyze.</h3>
                  <p className="text-[#86868B] text-[15px] leading-relaxed">
                    Describe your business challenge above and select a framework to begin your intelligence report.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
