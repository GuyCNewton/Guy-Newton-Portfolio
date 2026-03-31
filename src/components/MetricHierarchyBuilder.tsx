import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Activity, 
  ShieldAlert, 
  Zap, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Info,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Network
} from 'lucide-react';
import { 
  getProductContext, 
  generateHierarchy, 
  critiqueHierarchy, 
  ProductContext, 
  Hierarchy 
} from '../services/geminiService';

type Step = 'idle' | 'grounding' | 'hierarchy' | 'critique' | 'complete';

export default function MetricHierarchyBuilder() {
  const [goal, setGoal] = useState('');
  const [step, setStep] = useState<Step>('idle');
  const [context, setContext] = useState<ProductContext | null>(null);
  const [hierarchy, setHierarchy] = useState<Hierarchy | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    
    setError(null);
    setStep('grounding');
    
    try {
      // Pass 1: Grounding
      const ctx = await getProductContext(goal);
      setContext(ctx);
      
      // Pass 2: Hierarchy
      setStep('hierarchy');
      const rawHierarchy = await generateHierarchy(goal, ctx);
      setHierarchy(rawHierarchy);
      
      // Pass 3: Critique
      setStep('critique');
      const finalHierarchy = await critiqueHierarchy(goal, rawHierarchy);
      setHierarchy(finalHierarchy);
      
      setStep('complete');
    } catch (err) {
      console.error(err);
      setError('Failed to generate hierarchy. Please try again.');
      setStep('idle');
    }
  };

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: 'grounding', label: 'Analyzing Business Context', icon: Search },
    { id: 'hierarchy', label: 'Building Causal Tree', icon: Network },
    { id: 'critique', label: 'Applying Skeptical Critique', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Input Section */}
      <section className="bg-white/80 backdrop-blur-md border border-[#D2D2D7] rounded-3xl p-8 shadow-sm">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex p-3 bg-[#F5F5F7] rounded-2xl text-[#007AFF]">
            <Target className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">Metric Hierarchy Builder</h2>
            <p className="text-[#86868B] text-lg">Turn a high-level goal into a defensible, causal metric tree.</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Increase activation rate for new users"
              className="w-full px-6 py-4 bg-[#F5F5F7] border-2 border-transparent focus:border-[#007AFF] focus:bg-white rounded-2xl text-lg text-[#1D1D1F] transition-all outline-none placeholder:text-[#86868B]"
              disabled={step !== 'idle' && step !== 'complete'}
            />
            <button
              onClick={handleGenerate}
              disabled={!goal.trim() || (step !== 'idle' && step !== 'complete')}
              className="w-full py-4 bg-[#007AFF] text-white rounded-2xl font-medium hover:bg-[#0066CC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {step === 'idle' || step === 'complete' ? (
                <>
                  Generate Metric Hierarchy
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                </div>
              )}
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-[#FF3B30] text-sm font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </div>
      </section>

      {/* Loading Progress */}
      <AnimatePresence>
        {step !== 'idle' && step !== 'complete' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-center gap-8"
          >
            {steps.map((s, idx) => {
              const currentStepIdx = steps.findIndex(st => st.id === step);
              const isActive = (step as any) === s.id;
              const isPast = currentStepIdx > idx;
              const Icon = s.icon;

              return (
                <div key={s.id} className="flex flex-col items-center gap-3 w-48">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                    ${isActive ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-200 scale-110' : 
                      isPast ? 'bg-[#34C759] text-white' : 'bg-[#F5F5F7] text-[#86868B]'}
                  `}>
                    {isPast ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className={`text-xs font-medium text-center transition-colors duration-500 ${isActive ? 'text-[#1D1D1F]' : 'text-[#86868B]'}`}>
                    {s.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="pulsing"
                      className="w-1.5 h-1.5 bg-[#007AFF] rounded-full mt-1"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {hierarchy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Context Summary */}
            {context && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { label: 'Business Model', value: context.business_model, icon: Activity },
                  { label: 'Value Exchange', value: context.value_exchange, icon: Info },
                  { label: 'Aha Moment', value: context.aha_moment, icon: Zap },
                  { label: 'Time Horizon', value: context.time_horizon, icon: Search },
                  { label: 'Primary User', value: context.primary_user, icon: Target },
                ].map((item, i) => (
                  <div key={i} className="bg-white/50 border border-[#D2D2D7] rounded-2xl p-4 space-y-1">
                    <div className="flex items-center gap-2 text-[#86868B]">
                      <item.icon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
                    </div>
                    <p className="text-sm font-medium text-[#1D1D1F] line-clamp-2">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Hierarchy Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Tree */}
              <div className="lg:col-span-8 space-y-8">
                {/* North Star */}
                <MetricCard 
                  metric={hierarchy.north_star} 
                  type="north-star" 
                  icon={Target}
                  label="North Star Metric"
                />

                <div className="flex justify-center">
                  <div className="w-px h-8 bg-[#D2D2D7]" />
                </div>

                {/* Drivers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hierarchy.drivers.map((driver, i) => (
                    <MetricCard 
                      key={i}
                      metric={driver} 
                      type="driver" 
                      icon={Activity}
                      label="Input Driver"
                    />
                  ))}
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-8 bg-[#D2D2D7]" />
                </div>

                {/* Leading Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hierarchy.leading_indicators.map((indicator, i) => (
                    <MetricCard 
                      key={i}
                      metric={indicator} 
                      type="leading" 
                      icon={Zap}
                      label="Leading Indicator"
                    />
                  ))}
                </div>
              </div>

              {/* Guardrails Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center gap-2 px-2">
                  <ShieldAlert className="w-5 h-5 text-[#FF9500]" />
                  <h3 className="font-semibold text-[#1D1D1F]">Guardrail Metrics</h3>
                </div>
                <div className="space-y-4">
                  {hierarchy.guardrails.map((guardrail, i) => (
                    <MetricCard 
                      key={i}
                      metric={guardrail} 
                      type="guardrail" 
                      icon={ShieldAlert}
                      label="Guardrail"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({ metric, type, icon: Icon, label }: { 
  metric: any, 
  type: 'north-star' | 'driver' | 'guardrail' | 'leading',
  icon: any,
  label: string
}) {
  const colors = {
    'north-star': 'border-[#007AFF] bg-blue-50/30',
    'driver': 'border-[#34C759] bg-green-50/30',
    'guardrail': 'border-[#FF9500] bg-orange-50/30',
    'leading': 'border-[#5856D6] bg-indigo-50/30',
  };

  const accentColors = {
    'north-star': 'text-[#007AFF]',
    'driver': 'text-[#34C759]',
    'guardrail': 'text-[#FF9500]',
    'leading': 'text-[#5856D6]',
  };

  return (
    <motion.div
      layout
      className={`relative group bg-white/80 backdrop-blur-sm border-2 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md ${colors[type]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl bg-white border border-[#D2D2D7] ${accentColors[type]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868B]">{label}</span>
        </div>
        {metric.lag_weeks && (
          <span className="text-[10px] font-semibold bg-[#F5F5F7] px-2 py-1 rounded-full text-[#86868B]">
            {metric.lag_weeks}w Lag
          </span>
        )}
        {metric.lag_days && (
          <span className="text-[10px] font-semibold bg-[#F5F5F7] px-2 py-1 rounded-full text-[#86868B]">
            {metric.lag_days}d Lag
          </span>
        )}
      </div>

      <h4 className="text-lg font-semibold text-[#1D1D1F] mb-2">{metric.name}</h4>
      <p className="text-xs text-[#86868B] leading-relaxed mb-4">{metric.definition}</p>

      <div className="space-y-3">
        <div className="bg-white/50 rounded-xl p-3 border border-[#D2D2D7]/50">
          <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-[#1D1D1F] uppercase tracking-tight">
            <ChevronRight className="w-3 h-3" />
            {type === 'guardrail' ? 'Protects Against' : 'Causal Mechanism'}
          </div>
          <p className="text-[11px] text-[#424245] italic">
            {type === 'guardrail' ? metric.protects_against : metric.causal_logic || metric.predicts}
          </p>
        </div>

        {metric.critique && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFF9E6] border border-[#FFD60A]/30 rounded-xl p-3"
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-[#8F6B00] uppercase tracking-tight">
              <ShieldCheck className="w-3 h-3" />
              Critique Rationale
            </div>
            <p className="text-[11px] text-[#8F6B00] leading-tight">
              {metric.critique}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
