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
    badge: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    stroke: '#059669',
    fill: 'rgba(5, 150, 105, 0.1)',
  },
  amber: {
    badge: 'text-amber-700 bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
    stroke: '#D97706',
    fill: 'rgba(217, 119, 6, 0.1)',
  },
  sky: {
    badge: 'text-sky-700 bg-sky-50 border-sky-200',
    iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
    stroke: '#0284C7',
    fill: 'rgba(2, 132, 199, 0.1)',
  },
  indigo: {
    badge: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    stroke: '#4F46E5',
    fill: 'rgba(79, 70, 229, 0.1)',
  },
  rose: {
    badge: 'text-rose-700 bg-rose-50 border-rose-200',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
    stroke: '#E11D48',
    fill: 'rgba(225, 29, 72, 0.1)',
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
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-4 hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 group flex flex-col justify-between shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate block whitespace-nowrap">
            {title}
          </span>
          <p className="text-xl font-bold font-mono tracking-tight text-slate-900 mt-1 truncate whitespace-nowrap">
            {value}
          </p>
        </div>

        <div className={`p-2 rounded-xl border ${colors.iconBg} flex-shrink-0 transition-transform group-hover:scale-105 duration-200`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 min-w-0">
          <span
            className={`inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap ${colors.badge}`}
          >
            {trend === 'up' && <ArrowTrendingUpIcon className="w-2.5 h-2.5 stroke-[2.5]" />}
            {trend === 'down' && <ArrowTrendingDownIcon className="w-2.5 h-2.5 stroke-[2.5]" />}
            <span>{change}</span>
          </span>
          <span className="text-[10px] text-slate-400 truncate whitespace-nowrap">{subtitle}</span>
        </div>

        {/* Mini SVG Sparkline */}
        <div className="w-16 h-6 flex-shrink-0">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.2" />
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