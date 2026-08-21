'use client';

import { ReactNode } from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  subtitle?: string;
  icon: ReactNode;
  sparklineData?: number[];
  accentColor?: 'emerald' | 'amber' | 'sky' | 'indigo' | 'rose';
}

const colorMap = {
  emerald: {
    badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    stroke: '#10B981',
    fill: 'rgba(16, 185, 129, 0.1)',
  },
  amber: {
    badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    stroke: '#F59E0B',
    fill: 'rgba(245, 158, 11, 0.1)',
  },
  sky: {
    badge: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    stroke: '#0EA5E9',
    fill: 'rgba(14, 165, 233, 0.1)',
  },
  indigo: {
    badge: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    stroke: '#6366F1',
    fill: 'rgba(99, 102, 241, 0.1)',
  },
  rose: {
    badge: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    stroke: '#F43F5E',
    fill: 'rgba(244, 63, 94, 0.1)',
  },
};

export default function MetricCard({
  title,
  value,
  change,
  trend,
  subtitle = 'so với hôm qua',
  icon,
  sparklineData = [35, 42, 38, 55, 48, 62, 70],
  accentColor = 'emerald',
}: MetricCardProps) {
  const colors = colorMap[accentColor] || colorMap.emerald;

  // Generate SVG Sparkline Path
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  const step = width / (sparklineData.length - 1);

  const points = sparklineData.map((val, idx) => {
    const x = idx * step;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-4 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-950/20 transition-all duration-200 group flex flex-col justify-between">
      {/* Subtle background glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all duration-300 pointer-events-none" />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate block whitespace-nowrap">
            {title}
          </span>
          <p className="text-xl font-bold font-mono tracking-tight text-white mt-1 truncate whitespace-nowrap">
            {value}
          </p>
        </div>

        <div className={`p-2 rounded-xl border ${colors.iconBg} flex-shrink-0 transition-transform group-hover:scale-105 duration-200`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 min-w-0">
          <span
            className={`inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap ${colors.badge}`}
          >
            {trend === 'up' && <ArrowTrendingUpIcon className="w-2.5 h-2.5 stroke-[2.5]" />}
            {trend === 'down' && <ArrowTrendingDownIcon className="w-2.5 h-2.5 stroke-[2.5]" />}
            <span>{change}</span>
          </span>
          <span className="text-[10px] text-slate-500 truncate whitespace-nowrap">{subtitle}</span>
        </div>

        {/* Mini SVG Sparkline */}
        <div className="w-16 h-6 flex-shrink-0">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.3" />
                <stop offset="100%" stopColor={colors.stroke} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#grad-${title.replace(/\s+/g, '')})`} />
            <path
              d={linePath}
              fill="none"
              stroke={colors.stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}