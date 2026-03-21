import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Target, Zap, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from '../lib/utils';

interface CampaignBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  segment: string;
  play: string;
  onDeploy?: () => void;
}

interface BriefData {
  targetAudience: string;
  valueProposition: string;
  suggestedChannel: string;
}

const CampaignBriefModal: React.FC<CampaignBriefModalProps> = ({ isOpen, onClose, segment, play, onDeploy }) => {
  const [brief, setBrief] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && segment) {
      generateBrief();
    }
  }, [isOpen, segment]);

  const generateBrief = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `Generate a marketing campaign brief for the following segment and marketing play:
      Segment: ${segment}
      Marketing Play: ${play}
      
      Provide the response in JSON format with exactly these three fields:
      "targetAudience": A concise description of who to target.
      "valueProposition": A compelling reason why they should care.
      "suggestedChannel": The best marketing channel to reach them.
      
      Keep the tone professional and strategic.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              targetAudience: { type: Type.STRING },
              valueProposition: { type: Type.STRING },
              suggestedChannel: { type: Type.STRING }
            },
            required: ["targetAudience", "valueProposition", "suggestedChannel"]
          }
        }
      });

      const result = JSON.parse(response.text);
      setBrief(result);
    } catch (err) {
      console.error("Failed to generate brief:", err);
      setError("Failed to generate brief. Please try again.");
      // Fallback data
      setBrief({
        targetAudience: "High-intent users in the identified segment looking for efficiency.",
        valueProposition: "Maximize your ROI with our tailored solutions designed for your specific needs.",
        suggestedChannel: "Targeted LinkedIn Ads and personalized email outreach."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="p-8 pb-0 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Campaign Brief</h3>
                  <p className="text-sm text-slate-500 font-medium">AI-Generated Strategy</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Drafting your brief...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium">
                  {error}
                </div>
              ) : brief ? (
                <div className="space-y-6">
                  <BriefSection 
                    icon={Target} 
                    title="Target Audience" 
                    content={brief.targetAudience} 
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                  />
                  <BriefSection 
                    icon={Zap} 
                    title="Value Proposition" 
                    content={brief.valueProposition} 
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                  />
                  <BriefSection 
                    icon={Send} 
                    title="Suggested Channel" 
                    content={brief.suggestedChannel} 
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                  />
                </div>
              ) : null}

              {/* Footer Action */}
              {!loading && brief && (
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => {
                      if (onDeploy) onDeploy();
                      alert("Campaign brief exported to your marketing tool!");
                      onClose();
                    }}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                  >
                    Deploy Brief
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const BriefSection = ({ icon: Icon, title, content, color, bgColor }: { icon: any, title: string, content: string, color: string, bgColor: string }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <div className={cn("p-1.5 rounded-lg", bgColor)}>
        <Icon className={cn("w-4 h-4", color)} />
      </div>
      <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">{title}</h4>
    </div>
    <p className="text-[15px] text-slate-600 leading-relaxed font-medium pl-9">
      {content}
    </p>
  </div>
);

export default CampaignBriefModal;
