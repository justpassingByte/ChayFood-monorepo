'use client';

import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: 'emerald' | 'amber' | 'sky' | 'indigo' | 'rose';
  sparklineData?: number[];
  subtitle?: string;
}

export default function AdminMetricCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  accentColor = 'emerald',
  sparklineData = [35, 42, 38, 55, 62, 70, 85],
  subtitle,
}: MetricCardProps) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      stroke: '#059669',
      fill: '#D1FAE5',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-200/80',
      stroke: '#D97706',
      fill: '#FEF3C7',
      badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    },
    sky: {
      bg: 'bg-sky-50 text-sky-600 border-sky-200/80',
      stroke: '#0284C7',
      fill: '#E0F2FE',
      badge: 'bg-sky-50 text-sky-700 border-sky-200/80',
    },
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
      stroke: '#4F46E5',
      fill: '#E0E7FF',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600 border-rose-200/80',
      stroke: '#E11D48',
      fill: '#FFE4E6',
      badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
    },
  };

  const currentTheme = colorMap[accentColor] || colorMap.emerald;

  // Generate SVG Sparkline path
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const width = 100;
  const height = 30;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </span>
          <div className={`p-2 rounded-xl border ${currentTheme.bg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2.5 flex items-baseline justify-between">
          <p className="text-2xl sm:text-[26px] font-bold font-mono text-slate-900 tracking-tight whitespace-nowrap">
            {value}
          </p>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
        {change ? (
          <div className="flex items-center space-x-1.5">
            <span
              className={`inline-flex items-center space-x-0.5 text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {isPositive ? (
                <ArrowTrendingUpIcon className="w-3 h-3" />
              ) : (
                <ArrowTrendingDownIcon className="w-3 h-3" />
              )}
              <span>{change}</span>
            </span>
            <span className="text-[11px] text-slate-400">so với tháng trước</span>
          </div>
        ) : subtitle ? (
          <span className="text-[11px] text-slate-500 font-medium">{subtitle}</span>
        ) : null}

        {/* Mini SVG Sparkline */}
        <div className="w-16 h-6 flex-shrink-0">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={currentTheme.stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
