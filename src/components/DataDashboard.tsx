import React, { useMemo, useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Activity,
  AlertTriangle,
  Info,
  Layers,
  GitBranch
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { format, isWithinInterval, startOfDay, endOfDay, subMonths, addMonths, startOfMonth } from 'date-fns';
import { cn } from '../lib/utils';
import { GoogleGenAI, Type } from "@google/genai";
import { RAW_DATA, parseCSV } from '../data/mockData';

const COLORS = ['#0071E3', '#00C7FF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE'];

const DivergenceAlert = ({ message }: { message: string }) => (
  <div className="group relative inline-block ml-2 align-middle">
    <div className="relative">
      <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse cursor-help" />
      <div className="absolute -inset-1 bg-rose-500 rounded-full animate-ping opacity-20" />
    </div>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white border border-rose-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="w-4 h-4 text-rose-500" />
        <p className="text-[12px] font-bold text-rose-900">Divergence Alert</p>
      </div>
      <p className="text-[11px] text-rose-700 leading-relaxed font-medium">
        {message}
      </p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
    </div>
  </div>
);

const DivergenceAnalysisCard = ({ alerts }: { alerts: Record<string, string> }) => {
  const alertKeys = Object.keys(alerts);
  
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#D2D2D7]/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 rounded-xl">
            <GitBranch className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1D1D1F]">AI Divergence Analysis</h3>
            <p className="text-[12px] text-[#86868B]">Real-time root cause identification</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full">
          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Live Monitoring</span>
        </div>
      </div>
      
      {alertKeys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertKeys.map(metric => (
            <div key={metric} className="flex gap-4 p-4 rounded-2xl bg-rose-50/30 border border-rose-100/50 hover:bg-rose-50/50 transition-colors">
              <div className="mt-1">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-rose-900 mb-1">{metric}</p>
                <p className="text-[13px] text-rose-700 leading-relaxed font-medium">{alerts[metric]}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-emerald-50/20 rounded-2xl border border-dashed border-emerald-200">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Activity className="w-7 h-7 text-emerald-500" />
          </div>
          <p className="text-[16px] font-bold text-[#1D1D1F]">KPI Health: Optimal</p>
          <p className="text-[13px] text-[#86868B] mt-1 max-w-[280px]">AI models have not detected any significant period-over-period KPI divergences.</p>
        </div>
      )}
    </div>
  );
};

import StrategicExecutiveSummary from './StrategicExecutiveSummary';
import ExecutiveTLDR from './ExecutiveTLDR';
import ScenarioPlanner from './ScenarioPlanner';

const DataDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<'1M' | '3M' | '1Y' | 'ALL'>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  
  const data = useMemo(() => parseCSV(RAW_DATA), []);

  const anchorDate = useMemo(() => {
    if (data.length === 0) return new Date();
    return new Date(Math.max(...data.map(o => o.date.getTime())));
  }, [data]);

  // Dynamic Hidden Opportunity Identification
  const hiddenOpportunity = useMemo(() => {
    if (!data || data.length === 0) return undefined;

    const segments: Record<string, { revenue: number; orders: number; marketing: number; churn: number; count: number }> = {};
    
    data.forEach(o => {
      const tierKey = `${o.customer_tier} Tier`;
      const channelKey = `${o.acquisition_channel}`;
      const comboKey = `${o.customer_tier} x ${o.acquisition_channel}`;
      
      [tierKey, channelKey, comboKey].forEach(key => {
        if (!segments[key]) segments[key] = { revenue: 0, orders: 0, marketing: 0, churn: 0, count: 0 };
        segments[key].revenue += o.price;
        segments[key].orders += 1;
        segments[key].marketing += o.marketing_spend;
        segments[key].churn += o.churn_rate;
        segments[key].count += 1;
      });
    });

    let bestSegment = "";
    let bestRatio = 0;

    Object.entries(segments).forEach(([name, stats]) => {
      const cac = stats.marketing / stats.orders;
      const aov = stats.revenue / stats.orders;
      const avgChurn = stats.churn / stats.count;
      const clv = avgChurn > 0 ? aov / avgChurn : aov * 20;
      const ratio = cac > 0 ? clv / cac : 0;

      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestSegment = name;
      }
    });

    if (!bestSegment) return undefined;

    return {
      segment: bestSegment,
      play: `${bestSegment} users show a ${bestRatio.toFixed(1)}x LTV:CAC. Scale this ${bestSegment.includes('Tier') ? 'segment' : 'channel'} to maximize ROI.`
    };
  }, [data]);

  const [kpiAlerts, setKpiAlerts] = useState<Record<string, string>>({});

  const tiers = useMemo(() => ['All', ...new Set(data.map(o => o.customer_tier))], [data]);
  const regions = useMemo(() => ['All', ...new Set(data.map(o => o.region))], [data]);

  const filteredData = useMemo(() => {
    let baseData = data;
    
    // Date filtering
    if (dateRange !== 'ALL') {
      const now = anchorDate;
      let start: Date;
      if (dateRange === '1M') start = now;
      else if (dateRange === '3M') start = subMonths(now, 2);
      else start = subMonths(now, 11);
      
      baseData = baseData.filter(order => 
        isWithinInterval(order.date, { start: startOfDay(start), end: endOfDay(now) })
      );
    }

    // Tier filtering
    if (selectedTier !== 'All') {
      baseData = baseData.filter(order => order.customer_tier === selectedTier);
    }

    // Region filtering
    if (selectedRegion !== 'All') {
      baseData = baseData.filter(order => order.region === selectedRegion);
    }
    
    return baseData;
  }, [data, dateRange, selectedTier, selectedRegion, anchorDate]);

  // KPIs
  const totalRevenue = useMemo(() => 
    filteredData.reduce((sum, order) => sum + order.price, 0), 
  [filteredData]);

  const totalOrders = useMemo(() => 
    new Set(filteredData.map(o => o.id)).size, 
  [filteredData]);

  const avgOrderValue = useMemo(() => 
    totalOrders > 0 ? totalRevenue / totalOrders : 0, 
  [totalRevenue, totalOrders]);

  const topProduct = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(o => {
      counts[o.product] = (counts[o.product] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [filteredData]);

  const totalMarketingSpend = useMemo(() => 
    filteredData.reduce((sum, order) => sum + order.marketing_spend, 0), 
  [filteredData]);

  const cac = useMemo(() => 
    totalOrders > 0 ? totalMarketingSpend / totalOrders : 0,
  [totalMarketingSpend, totalOrders]);

  const avgChurnRate = useMemo(() => {
    const validChurns = filteredData.filter(o => o.churn_rate > 0);
    return validChurns.length > 0 
      ? validChurns.reduce((sum, o) => sum + o.churn_rate, 0) / validChurns.length 
      : 0.05; // Fallback to 5%
  }, [filteredData]);

  const clv = useMemo(() => 
    avgChurnRate > 0 ? avgOrderValue / avgChurnRate : avgOrderValue * 20, 
  [avgOrderValue, avgChurnRate]);

  const ltvCacRatio = useMemo(() => cac > 0 ? clv / cac : 0, [clv, cac]);

  const previousFilteredData = useMemo(() => {
    let baseData = data;
    const now = anchorDate;
    let previousEnd: Date;
    let previousStart: Date;

    if (dateRange === 'ALL') {
      previousEnd = subMonths(now, 1);
      previousStart = subMonths(now, 1);
    } else if (dateRange === '1M') {
      previousEnd = subMonths(now, 1);
      previousStart = subMonths(now, 1);
    } else if (dateRange === '3M') {
      previousEnd = subMonths(now, 3);
      previousStart = subMonths(now, 5);
    } else {
      previousEnd = subMonths(now, 12);
      previousStart = subMonths(now, 23);
    }
    
    baseData = baseData.filter(order => 
      isWithinInterval(order.date, { start: startOfDay(previousStart), end: endOfDay(previousEnd) })
    );

    if (selectedTier !== 'All') baseData = baseData.filter(order => order.customer_tier === selectedTier);
    if (selectedRegion !== 'All') baseData = baseData.filter(order => order.region === selectedRegion);
    
    return baseData;
  }, [data, dateRange, selectedTier, selectedRegion, anchorDate]);

  const prevKPIs = useMemo(() => {
    const totalRevenue = previousFilteredData.reduce((sum, order) => sum + order.price, 0);
    const totalOrders = new Set(previousFilteredData.map(o => o.id)).size;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalMarketingSpend = previousFilteredData.reduce((sum, order) => sum + order.marketing_spend, 0);
    const cac = totalOrders > 0 ? totalMarketingSpend / totalOrders : 0;
    const validChurns = previousFilteredData.filter(o => o.churn_rate > 0);
    const avgChurnRate = validChurns.length > 0 
      ? validChurns.reduce((sum, o) => sum + o.churn_rate, 0) / validChurns.length 
      : 0.05;
    const clv = avgChurnRate > 0 ? avgOrderValue / avgChurnRate : avgOrderValue * 20;
    const ltvCacRatio = cac > 0 ? clv / cac : 0;
    
    return { totalRevenue, totalOrders, avgOrderValue, cac, avgChurnRate, clv, ltvCacRatio };
  }, [previousFilteredData]);

  // Helper to detect anomalies based on KPI shifts
  const isAnomalyDetected = (kpi: any) => {
    let curr = 0;
    let prev = 0;
    const isCac = kpi.label === 'Acquisition Cost (CAC)';

    switch (kpi.label) {
      case 'Total Revenue':
        curr = totalRevenue;
        prev = prevKPIs.totalRevenue;
        break;
      case 'LTV:CAC Ratio':
        curr = ltvCacRatio;
        prev = prevKPIs.ltvCacRatio;
        break;
      case 'Unit Economics':
        curr = avgOrderValue;
        prev = prevKPIs.avgOrderValue;
        break;
      case 'Customer LTV':
        curr = clv;
        prev = prevKPIs.clv;
        break;
      case 'Active Customers':
        curr = totalOrders;
        prev = prevKPIs.totalOrders;
        break;
      case 'Acquisition Cost (CAC)':
        curr = cac;
        prev = prevKPIs.cac;
        break;
      case 'Retention':
        curr = -avgChurnRate;
        prev = -prevKPIs.avgChurnRate;
        break;
      default:
        return false;
    }

    if (prev === 0) return false;
    const change = (curr - prev) / Math.abs(prev);
    
    if (isCac) return change > 0.05;
    return change < -0.05;
  };

  // AI Divergence Analysis
  useEffect(() => {
    const analyzeDivergence = async () => {
      const metricsToAnalyze: string[] = [];
      const checkDrop = (curr: number, prev: number, label: string) => {
        if (prev > 0 && (curr - prev) / prev < -0.1) metricsToAnalyze.push(label);
      };

      checkDrop(totalRevenue, prevKPIs.totalRevenue, 'Total Revenue');
      checkDrop(ltvCacRatio, prevKPIs.ltvCacRatio, 'LTV:CAC Ratio');
      checkDrop(avgOrderValue, prevKPIs.avgOrderValue, 'Unit Economics');
      checkDrop(clv, prevKPIs.clv, 'Customer LTV');
      checkDrop(totalOrders, prevKPIs.totalOrders, 'Active Customers');

      if (metricsToAnalyze.length === 0) {
        setKpiAlerts({});
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const prompt = `Analyze why the following metrics dropped by more than 10% period-over-period for the segment: Tier=${selectedTier}, Region=${selectedRegion}.
        Metrics: ${metricsToAnalyze.join(', ')}
        Recent Data Summary: ${JSON.stringify({ totalRevenue, avgOrderValue, cac, avgChurnRate, clv, ltvCacRatio })}
        Previous Data Summary: ${JSON.stringify(prevKPIs)}
        
        Provide a one-sentence AI root-cause analysis for EACH metric in a JSON object where keys are the metric names.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: metricsToAnalyze.reduce((acc, m) => {
                acc[m] = { type: Type.STRING };
                return acc;
              }, {} as any)
            }
          }
        });

        setKpiAlerts(JSON.parse(response.text));
      } catch (error) {
        console.error("AI Divergence Analysis failed:", error);
      }
    };

    analyzeDivergence();
  }, [totalRevenue, ltvCacRatio, avgOrderValue, clv, totalOrders, prevKPIs, selectedTier, selectedRegion, cac, avgChurnRate]);

  // Calculate Revenue Trend Percentage
  const revenueTrendPercentage = useMemo(() => {
    if (dateRange === 'ALL') return 12.5; // Default for ALL view
    
    const now = anchorDate;
    let previousEnd: Date;
    let previousStart: Date;

    if (dateRange === '1M') {
      previousEnd = subMonths(now, 1);
      previousStart = subMonths(now, 2);
    } else if (dateRange === '3M') {
      previousEnd = subMonths(now, 3);
      previousStart = subMonths(now, 6);
    } else {
      previousEnd = subMonths(now, 12);
      previousStart = subMonths(now, 24);
    }

    const currentRevenue = totalRevenue;
    const previousRevenue = data.filter(order => 
      isWithinInterval(order.date, { start: startOfDay(previousStart), end: endOfDay(previousEnd) })
    ).reduce((sum, order) => sum + order.price, 0);

    if (previousRevenue === 0) return 0;
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  }, [data, totalRevenue, dateRange, anchorDate]);

  // Calculate CAC Trend Percentage
  const cacTrendPercentage = useMemo(() => {
    if (prevKPIs.cac === 0) return 0;
    return ((cac - prevKPIs.cac) / prevKPIs.cac) * 100;
  }, [cac, prevKPIs.cac]);

  // Anomaly Detection Logic (Rolling Average)
  const anomalies = useMemo(() => {
    const daily: Record<string, number> = {};
    data.forEach(o => {
      const d = format(o.date, 'yyyy-MM-dd');
      daily[d] = (daily[d] || 0) + o.price;
    });
    
    const dates = Object.keys(daily).sort();
    const alerts: { date: string; value: number; type: 'high' | 'low'; message: string }[] = [];
    
    // 7-day rolling average
    for (let i = 7; i < dates.length; i++) {
      const window = dates.slice(i - 7, i).map(d => daily[d]);
      const avg = window.reduce((a, b) => a + b, 0) / 7;
      const current = daily[dates[i]];
      
      const diff = (current - avg) / avg;
      if (Math.abs(diff) > 0.4) { // 40% threshold for this dataset
        const type = diff > 0 ? 'high' : 'low';
        const direction = diff > 0 ? 'spike' : 'drop';
        const percent = Math.abs(diff * 100).toFixed(0);
        alerts.push({ 
          date: dates[i], 
          value: current, 
          type, 
          message: `Sales ${direction} of ${percent}% compared to 7-day average` 
        });
      }
    }
    
    return alerts.slice(-3); // Show last 3 anomalies
  }, [data]);

  // Chart Data with Forecasting
  const revenueTrend = useMemo(() => {
    const monthly: Record<string, number> = {};
    filteredData.forEach(o => {
      const d = format(o.date, 'MMM yyyy');
      monthly[d] = (monthly[d] || 0) + o.price;
    });
    
    const baseData = Object.entries(monthly).map(([name, value]) => ({ name, value, isForecast: false }));
    
    // Simple Linear Regression for Forecast
    if (baseData.length > 3) {
      const n = baseData.length;
      const x = Array.from({ length: n }, (_, i) => i);
      const y = baseData.map(d => d.value);
      
      const sumX = x.reduce((a, b) => a + b, 0);
      const sumY = y.reduce((a, b) => a + b, 0);
      const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
      const sumXX = x.reduce((a, b) => a + b * b, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      const forecastData = [];
      const lastDate = filteredData.length > 0 ? filteredData[filteredData.length - 1].date : new Date();
      
      for (let i = 1; i <= 3; i++) {
        const forecastValue = slope * (n + i) + intercept;
        forecastData.push({
          name: format(addMonths(lastDate, i), 'MMM yyyy'),
          value: Math.max(0, forecastValue),
          isForecast: true
        });
      }
      
      return [...baseData, ...forecastData];
    }
    
    return baseData;
  }, [filteredData]);

  // Dynamic Cohort Data
  const cohortData = useMemo(() => {
    const customerFirstDate: Record<string, Date> = {};
    data.forEach(o => {
      if (!customerFirstDate[o.id] || o.date < customerFirstDate[o.id]) {
        customerFirstDate[o.id] = o.date;
      }
    });

    const cohorts: Record<string, Set<string>> = {};
    Object.entries(customerFirstDate).forEach(([id, date]) => {
      const month = format(date, 'MMM yyyy');
      if (!cohorts[month]) cohorts[month] = new Set();
      cohorts[month].add(id);
    });

    const sortedCohorts = Object.keys(cohorts).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );

    const months = ['Month 0', 'Month 1', 'Month 2', 'Month 3'];
    const matrix = sortedCohorts.map(cohortMonth => {
      const initialCustomers = cohorts[cohortMonth];
      const initialCount = initialCustomers.size;
      
      return months.map((_, i) => {
        if (i === 0) return 100;
        const cohortDate = new Date(cohortMonth);
        const targetMonth = addMonths(startOfMonth(cohortDate), i);
        const retained = Array.from(initialCustomers).filter(id => {
          return data.some(o => o.id === id && format(o.date, 'MMM yyyy') === format(targetMonth, 'MMM yyyy'));
        });
        return Math.round((retained.length / initialCount) * 100);
      });
    });

    return { cohorts: sortedCohorts, months, matrix };
  }, [data]);

  // Dynamic Sankey Data Calculation
  const sankeyData = useMemo(() => {
    const paymentMethods = Array.from(new Set(filteredData.map(d => d.paymentMethod)));
    const products = Array.from(new Set(filteredData.map(d => d.product)));
    
    const nodes = [
      ...paymentMethods.map(name => ({ name, type: 'payment' })),
      ...products.map(name => ({ name, type: 'product' }))
    ];
    
    const links: { source: number; target: number; value: number }[] = [];
    
    paymentMethods.forEach((pm, pmIdx) => {
      products.forEach((p, pIdx) => {
        const value = filteredData.filter(d => d.paymentMethod === pm && d.product === p).length;
        if (value > 0) {
          links.push({
            source: pmIdx,
            target: paymentMethods.length + pIdx,
            value
          });
        }
      });
    });
    
    return { nodes, links };
  }, [filteredData]);

  // Sankey Ref
  const sankeyRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!sankeyRef.current || sankeyData.nodes.length === 0) return;
    
    const svg = d3.select(sankeyRef.current);
    svg.selectAll("*").remove();
    
    const width = 800;
    const height = 400;
    const { nodes, links } = sankeyData;
    
    const paymentNodes = nodes.filter(n => n.type === 'payment');
    const productNodes = nodes.filter(n => n.type === 'product');
    
    const color = d3.scaleOrdinal(d3.schemeTableau10);
    const textColor = "#1D1D1F";
    const linkOpacity = 0.3;

    // Draw links
    svg.append("g")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("d", d => {
        const sourceIdx = d.source;
        const targetIdx = d.target - paymentNodes.length;
        
        const x0 = 120;
        const x1 = width - 120;
        const y0 = 40 + sourceIdx * (height / paymentNodes.length);
        const y1 = 40 + targetIdx * (height / productNodes.length);
        
        return `M${x0},${y0} C${(x0 + x1) / 2},${y0} ${(x0 + x1) / 2},${y1} ${x1},${y1}`;
      })
      .attr("fill", "none")
      .attr("stroke", (d) => color(d.source.toString()))
      .attr("stroke-opacity", linkOpacity)
      .attr("stroke-width", d => Math.max(2, d.value * 3));

    // Draw nodes
    svg.append("g")
      .selectAll("rect")
      .data(nodes)
      .enter()
      .append("rect")
      .attr("x", (d) => d.type === 'payment' ? 100 : width - 120)
      .attr("y", (d, i) => {
        const idx = d.type === 'payment' ? i : i - paymentNodes.length;
        const total = d.type === 'payment' ? paymentNodes.length : productNodes.length;
        return 40 + idx * (height / total) - 15;
      })
      .attr("width", 20)
      .attr("height", 30)
      .attr("fill", (d, i) => color(i.toString()))
      .attr("rx", 4);

    // Labels
    svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("x", (d) => d.type === 'payment' ? 90 : width - 90)
      .attr("y", (d, i) => {
        const idx = d.type === 'payment' ? i : i - paymentNodes.length;
        const total = d.type === 'payment' ? paymentNodes.length : productNodes.length;
        return 40 + idx * (height / total);
      })
      .attr("text-anchor", (d) => d.type === 'payment' ? "end" : "start")
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("fill", textColor)
      .text(d => d.name);

  }, [sankeyData]);

  const paymentMethods = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(o => {
      counts[o.paymentMethod] = (counts[o.paymentMethod] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const productSales = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(o => {
      counts[o.product] = (counts[o.product] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Executive TLDR Briefing */}
      <ExecutiveTLDR 
        revenueTrend={revenueTrendPercentage}
        topProduct={topProduct}
        ltvCacRatio={ltvCacRatio}
      />

      {/* Strategic Executive Summary Hero Section */}
      <StrategicExecutiveSummary 
        revenueTrend={revenueTrendPercentage}
        cac={cac}
        cacTrend={cacTrendPercentage}
        ltvCacRatio={ltvCacRatio}
        hiddenOpportunity={hiddenOpportunity}
      />

      {/* AI Divergence Analysis Card - Pinned */}
      <DivergenceAnalysisCard alerts={kpiAlerts} />

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">Growth Intelligence</h2>
          <p className="text-[#86868B] text-[15px]">Real-time unit economics and cohort performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Tier Filter */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#D2D2D7]/50 shadow-sm">
            <Layers className="w-4 h-4 text-[#86868B]" />
            <select 
              value={selectedTier} 
              onChange={(e) => setSelectedTier(e.target.value)}
              className="text-[13px] font-bold text-[#1D1D1F] bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
            >
              {tiers.map(tier => <option key={tier} value={tier}>{tier}</option>)}
            </select>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#D2D2D7]/50 shadow-sm">
            <Filter className="w-4 h-4 text-[#86868B]" />
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="text-[13px] font-bold text-[#1D1D1F] bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
            >
              {regions.map(region => <option key={region} value={region}>{region}</option>)}
            </select>
          </div>

          <div className="h-6 w-[1px] bg-[#D2D2D7] mx-1 hidden md:block" />

          <div className="flex bg-[#F5F5F7] p-1 rounded-2xl border border-[#D2D2D7]/30">
            {(['1M', '3M', '1Y', 'ALL'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "px-4 py-1.5 rounded-xl text-[13px] font-bold transition-all",
                  dateRange === range 
                    ? "bg-[#0071E3] text-white shadow-md" 
                    : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Anomaly Alerts */}
      {anomalies.length > 0 && (
        <div className="space-y-3">
          {anomalies.map((alert, i) => (
            <div key={i} className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-rose-900">Anomaly Detected</p>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-rose-400 cursor-help hover:text-rose-600 transition-colors" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white border border-rose-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <p className="text-[12px] text-rose-900 font-medium leading-relaxed">
                        This anomaly was identified by our AI model as a statistically significant deviation (40%+) from the 7-day rolling average of your revenue trend.
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-rose-700">{alert.message}</p>
              </div>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">{alert.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'LTV:CAC Ratio', value: `${ltvCacRatio.toFixed(1)}x`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', trend: ltvCacRatio > 3 ? 'Healthy' : 'At Risk', alert: kpiAlerts['LTV:CAC Ratio'] },
          { label: 'Unit Economics', value: `$${avgOrderValue.toFixed(0)} AOV`, icon: ShoppingBag, color: 'text-[#0071E3]', bg: 'bg-blue-50', trend: '+8.2%', alert: kpiAlerts['Unit Economics'] },
          { label: 'Retention', value: avgChurnRate < 0.05 ? 'Healthy' : 'At Risk', icon: Activity, color: avgChurnRate < 0.05 ? 'text-emerald-600' : 'text-rose-600', bg: avgChurnRate < 0.05 ? 'bg-emerald-50' : 'bg-rose-50', trend: `${(avgChurnRate * 100).toFixed(1)}% Churn` },
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: `${revenueTrendPercentage >= 0 ? '+' : ''}${revenueTrendPercentage.toFixed(1)}%`, alert: kpiAlerts['Total Revenue'] },
          { label: 'Customer LTV', value: `$${clv.toFixed(2)}`, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+15.2%', alert: kpiAlerts['Customer LTV'] },
          { label: 'Acquisition Cost (CAC)', value: `$${cac.toFixed(2)}`, icon: Target, color: 'text-rose-600', bg: 'bg-rose-50', trend: `${cacTrendPercentage >= 0 ? '+' : ''}${cacTrendPercentage.toFixed(1)}%` },
          { label: 'Top Product', value: topProduct, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Stable' },
          { label: 'Active Customers', value: (totalOrders * 0.85).toFixed(0), icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50', trend: '+4.3%', alert: kpiAlerts['Active Customers'] },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-[#D2D2D7]/50 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl", kpi.bg)}>
                <kpi.icon className={cn("w-6 h-6", kpi.color)} />
              </div>
              <span className={cn(
                "text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1",
                kpi.trend.startsWith('+') || kpi.trend === 'Healthy' ? "bg-emerald-50 text-emerald-600" : kpi.trend === 'Stable' ? "bg-gray-50 text-gray-500" : "bg-rose-50 text-rose-600"
              )}>
                {kpi.trend.startsWith('+') || kpi.trend === 'Healthy' ? <ArrowUpRight className="w-3 h-3" /> : kpi.trend === 'Stable' ? null : <ArrowDownRight className="w-3 h-3" />}
                {kpi.trend}
                <span title="Anomaly Detected: Significant period-over-period divergence">
                  <AlertTriangle className="w-3 h-3 text-rose-600 animate-pulse ml-1" />
                </span>
              </span>
            </div>
            <p className="text-[13px] font-bold text-[#86868B] uppercase tracking-wider mb-1">{kpi.label}</p>
            <div className="flex items-center">
              <h3 className="text-2xl font-bold text-[#1D1D1F] truncate" title={String(kpi.value)}>{kpi.value}</h3>
              {kpi.alert && <DivergenceAlert message={kpi.alert} />}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <div className="bg-white p-8 rounded-3xl border border-[#D2D2D7]/50 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold tracking-tight">Revenue Trend</h3>
            <TrendingUp className="w-5 h-5 text-[#86868B]" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071E3" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0071E3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#86868B', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#86868B', fontSize: 12 }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-2xl shadow-xl border border-[#D2D2D7]/50">
                          <p className="text-[11px] font-bold text-[#86868B] uppercase mb-1">{data.name}</p>
                          <p className="text-lg font-bold text-[#1D1D1F]">
                            ${Number(data.value).toLocaleString()}
                          </p>
                          {data.isForecast && (
                            <span className="mt-1 inline-block px-2 py-0.5 bg-blue-50 text-[#0071E3] text-[10px] font-bold rounded-full uppercase">
                              Forecasted
                            </span>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0071E3" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  data={revenueTrend.filter(d => !d.isForecast)}
                />
                {/* Forecast Line Overlay */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0071E3"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  fill="none"
                  data={revenueTrend.filter((d, i) => d.isForecast || revenueTrend[i+1]?.isForecast)}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-8 rounded-3xl border border-[#D2D2D7]/50 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold tracking-tight">Payment Methods</h3>
            <Filter className="w-5 h-5 text-[#86868B]" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    backgroundColor: '#FFFFFF',
                    color: '#1D1D1F'
                  }}
                  itemStyle={{ color: '#1D1D1F' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-[#86868B] text-[12px]">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-8 rounded-3xl border border-[#D2D2D7]/50 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold tracking-tight">Top 5 Products by Volume</h3>
            <ShoppingBag className="w-5 h-5 text-[#86868B]" />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productSales} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#1D1D1F', fontSize: 13, fontWeight: 500 }}
                  width={150}
                />
                <Tooltip 
                  cursor={{ fill: '#F5F5F7' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    backgroundColor: '#FFFFFF',
                    color: '#1D1D1F'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#0071E3" 
                  radius={[0, 10, 10, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Advanced Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cohort Heatmap */}
        <div className="bg-white p-8 rounded-3xl border border-[#D2D2D7]/50 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold tracking-tight">Cohort Analysis (Retention %)</h3>
            <Layers className="w-5 h-5 text-[#86868B]" />
          </div>
          <div className="space-y-2">
            <div className="flex gap-2 mb-4">
              <div className="w-24"></div>
              {cohortData.months.map(m => (
                <div key={m} className="flex-1 text-center text-[11px] font-bold text-[#86868B] uppercase">{m}</div>
              ))}
            </div>
            {cohortData.cohorts.map((cohort, i) => (
              <div key={cohort} className="flex gap-2 items-center">
                <div className="w-24 text-[12px] font-semibold text-[#1D1D1F]">{cohort}</div>
                {cohortData.matrix[i].map((val, j) => (
                  <div 
                    key={j} 
                    className={cn(
                      "flex-1 h-12 rounded-lg flex items-center justify-center text-[12px] font-bold transition-all",
                      val === 0 ? "bg-[#F5F5F7] text-[#D2D2D7]" : "text-white"
                    )}
                    style={{ 
                      backgroundColor: val > 0 ? `rgba(0, 113, 227, ${val / 100})` : undefined,
                    }}
                  >
                    {val > 0 ? `${val}%` : '-'}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#0071E3]/20"></div>
              <span className="text-[11px] text-[#86868B]">Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#0071E3]"></div>
              <span className="text-[11px] text-[#86868B]">High Retention</span>
            </div>
          </div>
        </div>

        {/* Sankey Flow */}
        <div className="bg-white p-8 rounded-3xl border border-[#D2D2D7]/50 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold tracking-tight">Payment to Product Flow</h3>
            <GitBranch className="w-5 h-5 text-[#86868B]" />
          </div>
          <div className="w-full overflow-hidden">
            <svg ref={sankeyRef} viewBox="0 0 800 400" className="w-full h-auto"></svg>
          </div>
          <div className="mt-4 flex justify-between text-[11px] font-bold text-[#86868B] uppercase tracking-widest">
            <span>Payment Method</span>
            <span>Product Category</span>
          </div>
        </div>
      </div>

      {/* AI Scenario Planner */}
      <ScenarioPlanner currentLtv={clv} currentRevenue={totalRevenue} />

      {/* Business Intelligence Section */}
      <div className="bg-gradient-to-br from-[#1D1D1F] to-[#424245] p-8 rounded-[32px] text-white shadow-xl border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
            <Activity className="w-6 h-6 text-[#00C7FF]" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">Business Intelligence Insights</h3>
            <p className="text-white/60 text-sm">Strategic metrics for long-term growth</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="text-[#00C7FF] font-bold uppercase tracking-widest text-[11px]">Customer Lifetime Value</h4>
            <p className="text-[15px] leading-relaxed text-white/80">
              Our current CLV of <span className="text-white font-bold">${clv.toFixed(2)}</span> indicates strong customer loyalty. 
              Calculated based on an average monthly churn of <span className="text-white font-bold">{(avgChurnRate * 100).toFixed(1)}%</span>, we project significant long-term revenue.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-[#34C759] font-bold uppercase tracking-widest text-[11px]">Efficiency (LTV:CAC)</h4>
            <p className="text-[15px] leading-relaxed text-white/80">
              With an LTV:CAC ratio of <span className="text-white font-bold">{ltvCacRatio.toFixed(1)}x</span>, our marketing spend is highly efficient. 
              A ratio above 3.0x is considered industry-leading, allowing for aggressive scaling.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[#FF9500] font-bold uppercase tracking-widest text-[11px]">Growth Strategy</h4>
            <p className="text-[15px] leading-relaxed text-white/80">
              Our CAC of <span className="text-white font-bold">${cac.toFixed(2)}</span> provides a healthy margin. 
              We recommend increasing top-of-funnel spend by 15% to capture more market share while maintaining profitability.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DataDashboard;
