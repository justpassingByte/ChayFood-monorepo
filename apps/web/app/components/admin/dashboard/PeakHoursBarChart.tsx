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

interface HourData {
  hour: string;
  orders: number;
  isPeak: boolean;
}

const peakHoursData: HourData[] = [
  { hour: '07h', orders: 4, isPeak: false },
  { hour: '08h', orders: 8, isPeak: false },
  { hour: '09h', orders: 12, isPeak: false },
  { hour: '10h', orders: 22, isPeak: false },
  { hour: '11h', orders: 58, isPeak: true },
  { hour: '12h', orders: 74, isPeak: true },
  { hour: '13h', orders: 46, isPeak: true },
  { hour: '14h', orders: 14, isPeak: false },
  { hour: '15h', orders: 10, isPeak: false },
  { hour: '16h', orders: 18, isPeak: false },
  { hour: '17h', orders: 52, isPeak: true },
  { hour: '18h', orders: 86, isPeak: true },
  { hour: '19h', orders: 68, isPeak: true },
  { hour: '20h', orders: 32, isPeak: false },
  { hour: '21h', orders: 12, isPeak: false },
];

export default function PeakHoursBarChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col h-full hover:shadow-md transition-all duration-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-wide">
            Khung Giờ Đặt Món Cao Điểm (Peak Hours)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tập trung cao điểm trưa (11h — 13h) và tối (17h — 19h)
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
            <span>Bình thường</span>
          </span>
          <span className="flex items-center space-x-1 text-emerald-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
            <span>Cao điểm</span>
          </span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[220px]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as HourData;
                    return (
                      <div className="rounded-xl bg-white border border-slate-200 p-2.5 shadow-lg text-xs">
                        <p className="font-bold text-slate-800">Khung giờ: {item.hour}</p>
                        <p className="font-mono font-bold text-emerald-700 mt-1">
                          {item.orders} đơn đặt hàng
                        </p>
                        {item.isPeak && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            Giờ cao điểm bếp
                          </span>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
                {peakHoursData.map((entry, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={entry.isPeak ? '#059669' : '#CBD5E1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl animate-pulse">
            <span className="text-xs text-slate-400 font-mono">Đang tải biểu đồ...</span>
          </div>
        )}
      </div>
    </div>
  );
}
