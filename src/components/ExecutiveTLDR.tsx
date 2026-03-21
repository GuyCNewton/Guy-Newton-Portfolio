import React from 'react';
import { motion } from 'motion/react';

interface ExecutiveTLDRProps {
  revenueTrend: number;
  topProduct: string;
  ltvCacRatio: number;
}

const ExecutiveTLDR: React.FC<ExecutiveTLDRProps> = ({
  revenueTrend,
  topProduct,
  ltvCacRatio,
}) => {
  const isRevenueUp = revenueTrend >= 0;
  const efficiencyStatus = ltvCacRatio >= 3 ? 'exceptionally efficient' : 'stable';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mb-6 px-2"
    >
      <p className="font-sans text-[20px] leading-relaxed text-slate-700 font-medium">
        "The state of the business remains robust, with revenue trending 
        <span className={isRevenueUp ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
          {" "}{isRevenueUp ? 'upward' : 'downward'} by {Math.abs(revenueTrend).toFixed(1)}%
        </span>. 
        Our <span className="text-slate-900 font-bold">{topProduct}</span> continues to lead the market, 
        anchoring a unit economic model that is currently <span className="text-indigo-600 font-bold">{efficiencyStatus}</span>{" "}
        with an LTV:CAC ratio of {ltvCacRatio.toFixed(1)}x."
      </p>
      <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-slate-300 to-transparent"></div>
    </motion.div>
  );
};

export default ExecutiveTLDR;
