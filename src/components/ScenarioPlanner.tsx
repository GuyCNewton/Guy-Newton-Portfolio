import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sliders, TrendingUp, Target, Zap } from 'lucide-react';

interface ScenarioPlannerProps {
  currentLtv: number;
  currentRevenue: number;
}

const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({ currentLtv, currentRevenue }) => {
  const [marketingReallocation, setMarketingReallocation] = useState(0); // -50% to +100%
  const [conversionLift, setConversionLift] = useState(0); // 0% to 50%

  const simulatedOutcome = useMemo(() => {
    // Basic simulation logic:
    // Revenue is affected by marketing reallocation (diminishing returns assumed)
    // and conversion lift (direct multiplier)
    const reallocationFactor = 1 + (marketingReallocation / 100) * 0.8; // Assume 80% efficiency on reallocation
    const conversionFactor = 1 + (conversionLift / 100);
    
    return currentRevenue * reallocationFactor * conversionFactor;
  }, [marketingReallocation, conversionLift, currentRevenue]);

  const simulatedLtv = useMemo(() => {
    // Conversion lift often correlates with higher quality leads/LTV
    return currentLtv * (1 + (conversionLift / 100) * 0.5);
  }, [currentLtv, conversionLift]);

  const confidenceScore = useMemo(() => {
    // Confidence decreases as inputs deviate further from the baseline
    const baseConfidence = 96;
    const reallocationImpact = Math.abs(marketingReallocation) * 0.12;
    const liftImpact = conversionLift * 0.35;
    return Math.max(65, Math.round(baseConfidence - reallocationImpact - liftImpact));
  }, [marketingReallocation, conversionLift]);

  return (
    <div className="bg-white p-8 rounded-3xl border border-[#D2D2D7]/50 shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">Scenario Planner</h3>
            <p className="text-[#86868B] text-sm">Simulate marketing and conversion impacts</p>
          </div>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          AI-Assisted
        </span>
      </div>

      <div className="space-y-4">
        {/* Marketing Reallocation Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <label htmlFor="marketing-reallocation">Marketing Reallocation</label>
            <span className="text-indigo-600 font-bold">{marketingReallocation > 0 ? '+' : ''}{marketingReallocation}%</span>
          </div>
          <input
            id="marketing-reallocation"
            type="range"
            min="-50"
            max="100"
            step="5"
            value={marketingReallocation}
            onChange={(e) => setMarketingReallocation(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0071E3]"
          />
        </div>

        {/* Conversion Lift Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <label htmlFor="conversion-lift">Projected Conversion Lift</label>
            <span className="text-emerald-600 font-bold">+{conversionLift}%</span>
          </div>
          <input
            id="conversion-lift"
            type="range"
            min="0"
            max="50"
            step="1"
            value={conversionLift}
            onChange={(e) => setConversionLift(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-[#D2D2D7]/50">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#86868B]">AI-Assisted Forecasting</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div 
            key={`outcome-${simulatedOutcome}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#F5F5F7] rounded-2xl space-y-1"
          >
            <p className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Simulated Q4 Outcome</p>
            <p className="text-2xl font-bold text-[#1D1D1F]">
              ${(simulatedOutcome / 1000).toFixed(1)}k
            </p>
          </motion.div>

          <motion.div 
            key={`ltv-${simulatedLtv}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-[#F5F5F7] rounded-2xl space-y-1"
          >
            <p className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">Simulated LTV</p>
            <p className="text-2xl font-bold text-[#1D1D1F]">
              ${simulatedLtv.toFixed(0)}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="bg-[#1D1D1F] rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <Target className="w-6 h-6 text-[#00C7FF]" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider">Confidence Score</p>
            <motion.p 
              key={`confidence-${confidenceScore}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xl font-bold"
            >
              {confidenceScore}% Accurate
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPlanner;
