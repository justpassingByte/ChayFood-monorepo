'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface HourlyData {
  hour: string;
  orders: number;
  isPeak: boolean;
}

const hourlyData: HourlyData[] = [
  { hour: '07h', orders: 4, isPeak: false },
  { hour: '08h', orders: 8, isPeak: false },
  { hour: '09h', orders: 14, isPeak: false },
  { hour: '10h', orders: 28, isPeak: false },
  { hour: '11h', orders: 62, isPeak: true },
  { hour: '12h', orders: 88, isPeak: true },
  { hour: '13h', orders: 45, isPeak: true },
  { hour: '14h', orders: 18, isPeak: false },
  { hour: '15h', orders: 15, isPeak: false },
  { hour: '16h', orders: 26, isPeak: false },
  { hour: '17h', orders: 54, isPeak: true },
  { hour: '18h', orders: 92, isPeak: true },
  { hour: '19h', orders: 76, isPeak: true },
  { hour: '20h', orders: 38, isPeak: false },
  { hour: '21h', orders: 16, isPeak: false },
];

export default function PeakHoursBarChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 flex flex-col h-full hover:border-slate-700/80 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white tracking-wide">
            Khung Giờ Đặt Hàng Cao Điểm
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cao điểm trưa (11h - 13h) và chiều tối (17h - 19h)
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
            <span className="text-slate-400 text-[11px]">Giờ cao điểm</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-700" />
            <span className="text-slate-400 text-[11px]">Bình thường</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[220px]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="hour"
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
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as HourlyData;
                    return (
                      <div className="rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-2.5 shadow-xl text-xs">
                        <p className="font-semibold text-slate-200">Khung giờ: {label}</p>
                        <p className="font-mono text-emerald-400 font-bold mt-1">
                          {data.orders} đơn đặt hàng {data.isPeak ? '(Cao điểm)' : ''}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                {hourlyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isPeak ? '#10B981' : '#334155'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-950/40 rounded-xl animate-pulse">
            <span className="text-xs text-slate-500 font-mono">Đang tải dữ liệu khung giờ...</span>
          </div>
        )}
      </div>
    </div>
  );
}
