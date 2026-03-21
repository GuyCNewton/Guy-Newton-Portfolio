import React from 'react';
import { Sparkles, ArrowUpRight, ArrowDownRight, Zap, Target, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import CampaignBriefModal from './CampaignBriefModal';

interface StrategicExecutiveSummaryProps {
  revenueTrend: number; // percentage
  cac: number;
  cacTrend: number; // percentage
  ltvCacRatio: number;
  hiddenOpportunity?: {
    segment: string;
    play: string;
  };
}

const StrategicExecutiveSummary: React.FC<StrategicExecutiveSummaryProps> = ({
  revenueTrend,
  cac,
  cacTrend,
  ltvCacRatio,
  hiddenOpportunity
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [deployedImpact, setDeployedImpact] = React.useState<number | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = React.useState(false);
  const [showBrief, setShowBrief] = React.useState(false);
  const isRevenueUp = revenueTrend >= 0;

  const cacStatus = cacTrend > 0 ? "rising to" : cacTrend < 0 ? "falling to" : "stable at";

  const handleDeploy = () => {
    // Projected impact is 15%, actual is +/- 5%
    const baseProjected = 15;
    const variance = (Math.random() * 10) - 5; // -5 to +5
    setDeployedImpact(baseProjected + variance);
  };

  const handleDraftBrief = () => {
    setIsGeneratingBrief(true);
    setTimeout(() => {
      setIsGeneratingBrief(false);
      setShowBrief(true);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative group mb-8"
    >
      {/* Animated Gradient Border Effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 rounded-[2rem] blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></div>
      
      {/* Main Container with Glassmorphism */}
      <div className="relative bg-white/80 backdrop-blur-xl border border-[#D2D2D7]/50 rounded-[2rem] p-8 shadow-xl overflow-hidden">
        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"></div>

        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">AI Executive Summary</h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Summary Text */}
            <div className="lg:col-span-2 space-y-4">
              <p className="text-lg leading-relaxed text-slate-700 font-medium">
                Revenue is trending <span className={cn("font-bold", isRevenueUp ? "text-emerald-600" : "text-rose-600")}>
                  {isRevenueUp ? 'up' : 'down'} by {Math.abs(revenueTrend).toFixed(1)}%
                </span>. 
                While the CAC is {cacStatus} <span className="text-slate-900 font-bold">${cac.toFixed(2)}</span>, 
                the LTV:CAC ratio of <span className="text-indigo-600 font-bold">{ltvCacRatio.toFixed(1)}x</span> suggests 
                an immediate opportunity to scale marketing spend.
              </p>
              
              {/* Quick Action Badges */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Badge icon={Zap} label="High Efficiency" color="bg-emerald-500" />
                <Badge icon={TrendingUp} label="Growth Ready" color="bg-blue-500" />
                <Badge icon={Target} label="Retention Alert" color="bg-amber-500" />
              </div>
            </div>

            {/* Right Side: Hidden Opportunity Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative p-6 bg-emerald-50/30 border border-emerald-100 rounded-3xl overflow-hidden group/card shadow-[0_0_20px_rgba(52,199,89,0.05)] hover:shadow-[0_0_30px_rgba(52,199,89,0.15)] transition-all duration-500"
            >
              {/* Profit Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover/card:bg-emerald-400/20 transition-colors duration-500"></div>
              
              <div className="relative space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold uppercase tracking-wider text-[10px]">
                    <TrendingUp className="w-3 h-3" />
                    Hidden Opportunity
                  </div>
                  {deployedImpact !== null && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-black rounded-full uppercase tracking-tighter shadow-sm"
                    >
                      Realized: +{deployedImpact.toFixed(1)}%
                    </motion.div>
                  )}
                </div>
                
                {hiddenOpportunity ? (
                  <>
                    <div>
                      <h4 className="text-[13px] font-bold text-emerald-900 mb-1">Segment Identified</h4>
                      <p className="text-[14px] text-emerald-800 leading-tight font-medium">
                        {hiddenOpportunity.segment}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-[13px] font-bold text-emerald-900 mb-1">Marketing Play</h4>
                      <p className="text-[13px] text-emerald-700 leading-relaxed italic">
                        "{hiddenOpportunity.play}"
                      </p>
                    </div>

                    {!showBrief && (
                      <button 
                        onClick={handleDraftBrief}
                        disabled={isGeneratingBrief}
                        className={cn(
                          "w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-xl transition-all shadow-lg shadow-emerald-200/50 group/btn",
                          isGeneratingBrief && "opacity-80 cursor-not-allowed"
                        )}
                      >
                        {isGeneratingBrief ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating brief...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 group-hover/btn:animate-pulse" />
                            Draft Campaign Brief
                          </>
                        )}
                      </button>
                    )}

                    {showBrief && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-white border border-emerald-100 rounded-2xl shadow-sm space-y-3"
                      >
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-[12px] uppercase tracking-wider">
                          <Sparkles className="w-3 h-3" />
                          Generated Brief
                        </div>
                        <div className="space-y-2 text-[13px]">
                          <div>
                            <span className="font-bold text-emerald-900">Target Audience:</span>
                            <p className="text-emerald-800 leading-tight">{hiddenOpportunity.segment}</p>
                          </div>
                          <div>
                            <span className="font-bold text-emerald-900">Objective:</span>
                            <p className="text-emerald-800 leading-tight">Maximize conversion through {hiddenOpportunity.play.toLowerCase()}.</p>
                          </div>
                          <div>
                            <span className="font-bold text-emerald-900">Key Messaging:</span>
                            <p className="text-emerald-800 italic leading-tight">"Unlock premium value with our tailored solutions for your segment."</p>
                          </div>
                          <div>
                            <span className="font-bold text-emerald-900">Budget Allocation:</span>
                            <p className="text-emerald-800">$5,000 (Initial Pilot)</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="w-full mt-2 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-[11px] font-bold rounded-lg transition-colors uppercase tracking-wider"
                        >
                          View Full Deployment Plan
                        </button>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-emerald-100 rounded w-3/4"></div>
                    <div className="h-12 bg-emerald-100 rounded w-full"></div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Strategic Recommendation Callout */}
          <div className="mt-2 p-6 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold uppercase tracking-wider text-xs">
              <Zap className="w-4 h-4" />
              Next Best Action
            </div>
            
            <div className="space-y-3">
              <p className="text-[17px] text-indigo-950 font-bold leading-tight">
                The Action: Increase performance marketing spend by 25% for the "Enterprise Cloud Suite" to capitalize on high unit economic efficiency.
              </p>
              
              <p className="text-[14px] text-indigo-800 leading-relaxed italic">
                The "Why": A robust LTV:CAC ratio of {ltvCacRatio.toFixed(1)}x (exceeding the 3.0x benchmark) combined with a {Math.abs(revenueTrend).toFixed(1)}% revenue growth trend indicates significant headroom for profitable acquisition.
              </p>
              
              <div className="pt-2 flex items-center gap-2 text-[14px] font-bold text-emerald-600">
                <TrendingUp className="w-4 h-4" />
                Projected Impact: Estimated +$35k Monthly Revenue
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}} />

      <CampaignBriefModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        segment={hiddenOpportunity?.segment || ""}
        play={hiddenOpportunity?.play || ""}
        onDeploy={handleDeploy}
      />
    </motion.div>
  );
};

const Badge = ({ icon: Icon, label, color }: { icon: any, label: string, color: string }) => (
  <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg shadow-black/5", color)}>
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </div>
);

export default StrategicExecutiveSummary;
