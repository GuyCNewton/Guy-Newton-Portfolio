import React, { useState, useMemo, useRef } from "react";
import { Info, Plus, Pencil, Trash2, BarChart2, ListTodo } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface Feature {
  id: number;
  name: string;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  color: string;
}

const COLORS = [
  "#0071E3", // Apple Blue
  "#34C759", // Apple Green
  "#FF9500", // Apple Orange
  "#AF52DE", // Apple Purple
  "#FF3B30", // Apple Red
  "#5856D6", // Apple Indigo
  "#FFCC00", // Apple Yellow
  "#5AC8FA", // Apple Cyan
];

const defaultFeatures: Feature[] = [
  { id: 1, name: "Onboarding Redesign", reach: 8, impact: 9, confidence: 8, effort: 3, color: COLORS[0] },
  { id: 2, name: "AI Search", reach: 9, impact: 8, confidence: 6, effort: 5, color: COLORS[1] },
  { id: 3, name: "Dark Mode", reach: 7, impact: 5, confidence: 9, effort: 2, color: COLORS[2] },
  { id: 4, name: "API Webhooks", reach: 4, impact: 7, confidence: 7, effort: 4, color: COLORS[3] },
];

function calcRice(f: Pick<Feature, 'reach' | 'impact' | 'confidence' | 'effort'>): number {
  return f.effort > 0 ? +((f.reach * f.impact * f.confidence) / f.effort).toFixed(1) : 0;
}

function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block"
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.span 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap bg-[#424245] text-white shadow-xl pointer-events-none"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

interface ScoreSliderProps {
  label: string;
  value: number;
  max: number;
  onChange: (val: number) => void;
  hint: string;
}

function ScoreSlider({ label, value, max, onChange, hint }: ScoreSliderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#86868B]">
            {label}
          </span>
          <Tooltip label={hint}>
            <Info className="w-3.5 h-3.5 text-[#86868B] cursor-help" />
          </Tooltip>
        </div>
        <span className="text-sm font-bold tabular-nums text-[#1D1D1F]">{value}</span>
      </div>
      <div className="relative h-1.5 bg-[#E8E8ED] rounded-full overflow-hidden group">
        <div 
          className="absolute inset-y-0 left-0 bg-[#0071E3] transition-all duration-300 ease-out"
          style={{ width: `${(value / max) * 100}%` }} 
        />
        <input 
          type="range" 
          min={1} 
          max={max} 
          value={value}
          onChange={e => onChange(+e.target.value)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" 
        />
      </div>
      <div className="flex justify-between text-[10px] font-medium text-[#86868B]">
        <span>1</span><span>{max}</span>
      </div>
    </div>
  );
}

function Matrix({ features }: { features: Feature[] }) {
  const W = 400, H = 340, PAD = 40;
  const plotW = W - PAD * 2, plotH = H - PAD * 2;

  const maxRice = Math.max(...features.map(f => calcRice(f)), 1);

  return (
    <div className="w-full overflow-x-auto">
      <div className="relative mx-auto" style={{ minWidth: 340, maxWidth: 500 }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto drop-shadow-sm">
          <defs>
            <linearGradient id="q1" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#0071E3" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#0071E3" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="q2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF9500" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#FF9500" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Quadrant fills */}
          <rect x={PAD} y={PAD} width={plotW / 2} height={plotH / 2} fill="url(#q2)" rx="12" />
          <rect x={PAD + plotW / 2} y={PAD} width={plotW / 2} height={plotH / 2} fill="url(#q1)" rx="12" />

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(t => (
            <g key={t}>
              <line x1={PAD + t * plotW} y1={PAD} x2={PAD + t * plotW} y2={PAD + plotH}
                stroke="#D2D2D7" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1={PAD} y1={PAD + t * plotH} x2={PAD + plotW} y2={PAD + t * plotH}
                stroke="#D2D2D7" strokeWidth="0.5" strokeDasharray="2,2" />
            </g>
          ))}

          {/* Axes */}
          <line x1={PAD} y1={PAD} x2={PAD} y2={PAD + plotH} stroke="#86868B" strokeWidth="1" />
          <line x1={PAD} y1={PAD + plotH} x2={PAD + plotW} y2={PAD + plotH} stroke="#86868B" strokeWidth="1" />

          {/* Center dividers */}
          <line x1={PAD + plotW / 2} y1={PAD} x2={PAD + plotW / 2} y2={PAD + plotH}
            stroke="#86868B" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
          <line x1={PAD} y1={PAD + plotH / 2} x2={PAD + plotW} y2={PAD + plotH / 2}
            stroke="#86868B" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />

          {/* Quadrant labels */}
          {[
            { x: PAD + plotW * 0.25, y: PAD + 18, text: "Quick Wins", col: "#FF9500" },
            { x: PAD + plotW * 0.75, y: PAD + 18, text: "Stars ✦", col: "#0071E3" },
            { x: PAD + plotW * 0.25, y: PAD + plotH - 10, text: "Deprioritize", col: "#86868B" },
            { x: PAD + plotW * 0.75, y: PAD + plotH - 10, text: "Big Bets", col: "#34C759" },
          ].map(({ x, y, text, col }) => (
            <text key={text} x={x} y={y} textAnchor="middle" fontSize="10"
              fontWeight="700" fill={col} style={{ letterSpacing: "0.02em" }}>
              {text.toUpperCase()}
            </text>
          ))}

          {/* Axis labels */}
          <text x={PAD + plotW / 2} y={H - 8} textAnchor="middle"
            fontSize="10" fill="#86868B" fontWeight="600" style={{ letterSpacing: "0.05em" }}>
            EFFORT →
          </text>
          <text x={14} y={PAD + plotH / 2} textAnchor="middle"
            fontSize="10" fill="#86868B" fontWeight="600"
            transform={`rotate(-90, 14, ${PAD + plotH / 2})`} style={{ letterSpacing: "0.05em" }}>
            VALUE →
          </text>

          {/* Feature dots */}
          {features.map(f => {
            const rice = calcRice(f);
            const value = (f.reach * f.impact * f.confidence) / (10 * 10 * 10);
            const effortNorm = (f.effort - 1) / 4;

            const cx = PAD + effortNorm * plotW;
            const cy = PAD + (1 - value) * plotH;
            const r = 6 + (rice / maxRice) * 10;

            return (
              <g key={f.id} className="cursor-pointer transition-transform hover:scale-110">
                <circle cx={cx} cy={cy} r={r + 4} fill={f.color} opacity="0.1" />
                <circle cx={cx} cy={cy} r={r} fill={f.color} opacity="0.9" />
                <text x={cx} y={cy - r - 6} textAnchor="middle" fontSize="10"
                  fill="#1D1D1F" fontWeight="700">
                  {f.name.length > 12 ? f.name.slice(0, 11) + "…" : f.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function RankedList({ features }: { features: Feature[] }) {
  const sorted = useMemo(() => [...features]
    .map(f => ({ ...f, rice: calcRice(f) }))
    .sort((a, b) => b.rice - a.rice), [features]);

  const max = sorted[0]?.rice || 1;

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((f, i) => (
        <motion.div 
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={f.id} 
          className="flex items-center gap-4 bg-white/50 backdrop-blur-sm border border-[#D2D2D7]/50 rounded-2xl px-4 py-3.5 hover:bg-white/80 transition-all group"
        >
          <span className={cn(
            "w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shrink-0",
            i === 0 ? "bg-[#0071E3] text-white" : "bg-[#F5F5F7] text-[#86868B]"
          )}>
            {i + 1}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[15px] font-bold truncate text-[#1D1D1F]">{f.name}</span>
              <span className="text-[13px] font-black ml-2 tabular-nums shrink-0"
                style={{ color: f.color }}>{f.rice}</span>
            </div>
            <div className="h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(f.rice / max) * 100}%` }}
                className="h-full rounded-full transition-all duration-1000"
                style={{ background: f.color, opacity: 0.8 }} 
              />
            </div>
            <div className="flex gap-4 mt-2.5">
              {[["R", f.reach], ["I", f.impact], ["C", f.confidence], ["E", f.effort]].map(([l, v]) => (
                <span key={l} className="text-[11px] font-bold tabular-nums text-[#86868B]">
                  <span className="text-[#D2D2D7] mr-0.5">{l}</span>{v}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function RicePrioritizer() {
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures);
  const [form, setForm] = useState<Omit<Feature, 'id' | 'color'>>({ 
    name: "", reach: 5, impact: 5, confidence: 7, effort: 3 
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"matrix" | "list">("matrix");
  const [error, setError] = useState("");
  const nextColor = useRef(COLORS[features.length % COLORS.length]);

  const handleAdd = () => {
    if (!form.name.trim()) { setError("Feature name is required."); return; }
    setError("");
    if (editId !== null) {
      setFeatures(f => f.map(feat => feat.id === editId ? { ...feat, ...form } : feat));
      setEditId(null);
    } else {
      const color = COLORS[features.length % COLORS.length];
      setFeatures(f => [...f, { ...form, id: Date.now(), color } as Feature]);
    }
    setForm({ name: "", reach: 5, impact: 5, confidence: 7, effort: 3 });
    nextColor.current = COLORS[(features.length + 1) % COLORS.length];
  };

  const handleEdit = (f: Feature) => {
    setEditId(f.id);
    setForm({ name: f.name, reach: f.reach, impact: f.impact, confidence: f.confidence, effort: f.effort });
  };

  const handleDelete = (id: number) => {
    setFeatures(f => f.filter(feat => feat.id !== id));
    if (editId === id) { 
      setEditId(null); 
      setForm({ name: "", reach: 5, impact: 5, confidence: 7, effort: 3 }); 
    }
  };

  const rice = calcRice(form);
  const topRice = Math.max(...features.map(f => calcRice(f)), 1);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Custom Slider Styling */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FFFFFF;
          cursor: pointer;
          border: 0.5px solid #D2D2D7;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-top: -8px; /* Centers thumb on track */
        }
        input[type=range]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FFFFFF;
          cursor: pointer;
          border: 0.5px solid #D2D2D7;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>

      <div className="mb-10">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0071E3]" />
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#86868B]">
            Product Strategy
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
          Strategic Prioritizer
        </h1>
        <p className="text-[15px] mt-2 text-[#86868B] font-medium">
          RICE scoring — Reach × Impact × Confidence ÷ Effort
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input */}
        <div className="lg:col-span-4">
          <div className="bg-white/80 backdrop-blur-md border border-[#D2D2D7] rounded-3xl p-6 sticky top-24 shadow-sm">
            <h2 className="text-[13px] font-bold mb-6 tracking-wider uppercase text-[#86868B]">
              {editId ? "✎ Editing Feature" : "+ Add Feature"}
            </h2>

            {/* Name */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold tracking-wider uppercase mb-2 text-[#86868B]">
                Feature Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError(""); }}
                placeholder="e.g. Onboarding Redesign"
                className={cn(
                  "w-full rounded-2xl px-4 py-3 text-[15px] font-medium outline-none transition-all bg-[#F5F5F7] border-2",
                  error ? "border-[#FF3B30]/30 focus:border-[#FF3B30]" : "border-transparent focus:border-[#0071E3]"
                )}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
              />
              {error && <p className="text-[11px] font-bold mt-1.5 text-[#FF3B30] ml-1">{error}</p>}
            </div>

            {/* Sliders */}
            <div className="flex flex-col gap-6 mb-8">
              <ScoreSlider label="Reach" value={form.reach} max={10}
                onChange={v => setForm(f => ({ ...f, reach: v }))}
                hint="How many users does this affect? (1-10)" />
              <ScoreSlider label="Impact" value={form.impact} max={10}
                onChange={v => setForm(f => ({ ...f, impact: v }))}
                hint="How much will it move the needle? (1-10)" />
              <ScoreSlider label="Confidence" value={form.confidence} max={10}
                onChange={v => setForm(f => ({ ...f, confidence: v }))}
                hint="How confident are you in estimates? (1-10)" />
              <ScoreSlider label="Effort" value={form.effort} max={5}
                onChange={v => setForm(f => ({ ...f, effort: v }))}
                hint="Engineering cost in person-months (1-5)" />
            </div>

            {/* RICE Preview */}
            <div className="bg-[#F5F5F7] rounded-2xl p-4 mb-6 flex items-center justify-between border border-[#D2D2D7]/30">
              <div>
                <p className="text-[10px] font-bold tracking-wider uppercase text-[#86868B]">
                  RICE Score
                </p>
                <p className="text-3xl font-black tabular-nums text-[#0071E3]">
                  {rice}
                </p>
              </div>
              <div className="text-[11px] font-bold text-right text-[#86868B] font-mono">
                <div>{form.reach} × {form.impact} × {form.confidence}</div>
                <div className="border-t border-[#D2D2D7] mt-1 pt-1">÷ {form.effort}</div>
              </div>
            </div>

            <button 
              onClick={handleAdd}
              className={cn(
                "w-full rounded-2xl py-4 text-[15px] font-bold transition-all active:scale-[0.98] shadow-lg shadow-[#0071E3]/10",
                editId ? "bg-[#1D1D1F] text-white" : "bg-[#0071E3] text-white hover:bg-[#0077ED]"
              )}
            >
              {editId ? "Save Changes" : "Add Feature"}
            </button>

            {editId && (
              <button 
                onClick={() => { setEditId(null); setForm({ name: "", reach: 5, impact: 5, confidence: 7, effort: 3 }); }}
                className="w-full py-3 text-[13px] font-bold mt-2 text-[#86868B] hover:text-[#1D1D1F] transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Right: Viz */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Feature chips */}
          <AnimatePresence>
            {features.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2"
              >
                {features.map(f => (
                  <motion.div 
                    layout
                    key={f.id} 
                    className="flex items-center gap-2 bg-white border border-[#D2D2D7]/50 rounded-full pl-2 pr-3 py-1.5 text-[12px] font-bold shadow-sm"
                    style={{ color: f.color }}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: f.color }} />
                    <span className="text-[#1D1D1F]">{f.name}</span>
                    <div className="flex items-center gap-1 ml-1.5 border-l border-[#D2D2D7] pl-1.5">
                      <button onClick={() => handleEdit(f)} className="p-1 hover:bg-[#F5F5F7] rounded-full transition-colors">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete(f.id)} className="p-1 hover:bg-[#F5F5F7] rounded-full transition-colors text-[#FF3B30]">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div className="bg-white/80 backdrop-blur-md border border-[#D2D2D7] rounded-3xl shadow-sm">
            <div className="flex p-1.5 bg-[#F5F5F7]/50 border-b border-[#D2D2D7]/50 rounded-t-3xl">
              {[
                { id: "matrix", label: "2×2 Matrix", icon: BarChart2 },
                { id: "list", label: "Ranked List", icon: ListTodo }
              ].map((tab) => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as "matrix" | "list")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[12px] font-bold tracking-wider uppercase transition-all",
                    activeTab === tab.id 
                      ? "bg-white text-[#0071E3] shadow-sm" 
                      : "text-[#86868B] hover:text-[#1D1D1F]"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {features.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-[#F5F5F7] rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-[#D2D2D7]" />
                  </div>
                  <p className="text-[15px] font-bold text-[#86868B]">Add features to visualize your roadmap</p>
                </div>
              ) : activeTab === "matrix" ? (
                <Matrix features={features} />
              ) : (
                <RankedList features={features} />
              )}
            </div>
          </div>

          {/* Stats bar */}
          {features.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Features", value: features.length },
                { label: "Top RICE", value: topRice },
                { label: "Avg RICE", value: +(features.reduce((s, f) => s + calcRice(f), 0) / features.length).toFixed(1) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/80 backdrop-blur-md border border-[#D2D2D7] rounded-3xl p-5 text-center shadow-sm">
                  <p className="text-2xl font-black tabular-nums text-[#1D1D1F]">{value}</p>
                  <p className="text-[10px] font-bold tracking-wider uppercase mt-1 text-[#86868B]">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
