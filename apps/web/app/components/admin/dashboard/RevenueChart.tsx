'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  revenue: number;
  orders: number;
}

const mockData7Days: DataPoint[] = [
  { date: 'Thứ 2', revenue: 3200000, orders: 18 },
  { date: 'Thứ 3', revenue: 4150000, orders: 24 },
  { date: 'Thứ 4', revenue: 3800000, orders: 21 },
  { date: 'Thứ 5', revenue: 5200000, orders: 31 },
  { date: 'Thứ 6', revenue: 6450000, orders: 38 },
  { date: 'Thứ 7', revenue: 7800000, orders: 46 },
  { date: 'CN', revenue: 8950000, orders: 54 },
];

const mockData30Days: DataPoint[] = [
  { date: 'Tuần 1', revenue: 24500000, orders: 142 },
  { date: 'Tuần 2', revenue: 28900000, orders: 168 },
  { date: 'Tuần 3', revenue: 32400000, orders: 195 },
  { date: 'Tuần 4', revenue: 39550000, orders: 230 },
];

const mockDataYear: DataPoint[] = [
  { date: 'T1', revenue: 85000000, orders: 510 },
  { date: 'T2', revenue: 92000000, orders: 560 },
  { date: 'T3', revenue: 104000000, orders: 630 },
  { date: 'T4', revenue: 118000000, orders: 710 },
  { date: 'T5', revenue: 135000000, orders: 820 },
  { date: 'T6', revenue: 152000000, orders: 910 },
  { date: 'T7', revenue: 168000000, orders: 1020 },
  { date: 'T8', revenue: 189000000, orders: 1140 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: DataPoint }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatCurrency = (val: number) =>
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(val);

    return (
      <div className="rounded-xl bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 p-3 shadow-xl shadow-slate-950/60 text-xs">
        <p className="font-semibold text-slate-200 mb-1.5 pb-1 border-b border-slate-800">{label}</p>
        <div className="space-y-1">
          <p className="text-emerald-400 font-mono font-bold flex items-center justify-between space-x-3">
            <span className="text-slate-400 font-normal">Doanh thu:</span>
            <span>{formatCurrency(data.revenue)}</span>
          </p>
          <p className="text-slate-300 font-mono flex items-center justify-between space-x-3">
            <span className="text-slate-400 font-normal">Số đơn hàng:</span>
            <span>{data.orders} đơn</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export default function RevenueChart() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'year'>('7d');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data =
    timeRange === '7d'
      ? mockData7Days
      : timeRange === '30d'
      ? mockData30Days
      : mockDataYear;

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);

  const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(val);

  const formatShortVND = (val: number) => {
    if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)} Tỷ`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(0)} Tr`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    return val.toString();
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 flex flex-col h-full hover:border-slate-700/80 transition-all duration-200">
      {/* Header with Title and Range Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base font-semibold text-white tracking-wide">
              Biểu Đồ Doanh Thu & Xu Hướng Tăng Trưởng
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tổng cộng{' '}
            <span className="font-mono font-semibold text-emerald-400">
              {formatVND(totalRevenue)}
            </span>{' '}
            từ <span className="font-mono text-slate-200">{totalOrders} đơn</span> trong kỳ này
          </p>
        </div>

        {/* Time range switcher buttons */}
        <div className="inline-flex rounded-xl bg-slate-800/70 p-1 border border-slate-700/60 self-start sm:self-auto text-xs">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              timeRange === '7d'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            7 Ngày
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              timeRange === '30d'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            30 Ngày
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              timeRange === 'year'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Năm 2026
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-[280px]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatShortVND}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                activeDot={{ r: 6, fill: '#10B981', stroke: '#081C15', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-950/40 rounded-xl animate-pulse">
            <span className="text-xs text-slate-500 font-mono">Đang khởi tạo biểu đồ...</span>
          </div>
        )}
      </div>
    </div>
  );
}