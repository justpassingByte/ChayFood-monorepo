'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface StatusData {
  name: string;
  value: number;
  color: string;
}

const statusData: StatusData[] = [
  { name: 'Đã hoàn thành', value: 148, color: '#10B981' },
  { name: 'Đang chế biến', value: 36, color: '#F59E0B' },
  { name: 'Đang giao hàng', value: 24, color: '#0EA5E9' },
  { name: 'Chờ xác nhận', value: 12, color: '#6366F1' },
  { name: 'Đã hủy', value: 6, color: '#F43F5E' },
];

export default function OrderStatusDonutChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalOrders = statusData.reduce((acc, curr) => acc + curr.value, 0);
  const completedOrders = statusData.find((s) => s.name === 'Đã hoàn thành')?.value || 0;
  const successRate = ((completedOrders / totalOrders) * 100).toFixed(1);

  return (
    <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 flex flex-col h-full hover:border-slate-700/80 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white tracking-wide">
            Phân Bổ Trạng Thái Đơn Hàng
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tổng cộng <span className="font-mono text-emerald-400 font-bold">{totalOrders}</span> đơn
            trong hệ thống
          </p>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
          {successRate}% Hoàn tất
        </div>
      </div>

      {/* Donut Chart Canvas */}
      <div className="relative flex-1 min-h-[220px] flex items-center justify-center">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as StatusData;
                    const percent = ((item.value / totalOrders) * 100).toFixed(1);
                    return (
                      <div className="rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-2.5 shadow-xl text-xs">
                        <p className="font-medium text-slate-200">{item.name}</p>
                        <p className="font-mono font-bold mt-1" style={{ color: item.color }}>
                          {item.value} đơn ({percent}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F172A" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-950/40 rounded-xl animate-pulse">
            <span className="text-xs text-slate-500 font-mono">Đang tải biểu đồ...</span>
          </div>
        )}

        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold font-mono text-white tracking-tight">
            {totalOrders}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Tổng Đơn</span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/60">
        {statusData.map((item) => {
          const percent = ((item.value / totalOrders) * 100).toFixed(0);
          return (
            <div key={item.name} className="flex items-center space-x-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-400 truncate text-[11px]">{item.name}</span>
              <span className="font-mono font-semibold text-slate-200 text-[11px] ml-auto">
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
