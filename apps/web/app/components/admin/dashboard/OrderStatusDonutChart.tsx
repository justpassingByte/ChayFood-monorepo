'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface StatusData {
  name: string;
  value: number;
  color: string;
}

const statusData: StatusData[] = [
  { name: 'Đã hoàn thành', value: 148, color: '#059669' },
  { name: 'Đang chế biến', value: 36, color: '#D97706' },
  { name: 'Đang giao hàng', value: 24, color: '#0284C7' },
  { name: 'Chờ xác nhận', value: 12, color: '#4F46E5' },
  { name: 'Đã hủy', value: 6, color: '#E11D48' },
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
    <div className="rounded-2xl bg-white border border-slate-200/80 p-6 flex flex-col h-full hover:shadow-md transition-all duration-200 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-wide">
            Phân Bổ Trạng Thái Đơn Hàng
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng cộng <span className="font-mono text-emerald-700 font-bold">{totalOrders}</span> đơn
            trong hệ thống
          </p>
        </div>

        <div className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
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
                      <div className="rounded-xl bg-white border border-slate-200 p-2.5 shadow-lg text-xs">
                        <p className="font-bold text-slate-800">{item.name}</p>
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
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl animate-pulse">
            <span className="text-xs text-slate-400 font-mono">Đang tải biểu đồ...</span>
          </div>
        )}

        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
            {totalOrders}
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Tổng Đơn</span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
        {statusData.map((item) => {
          const percent = ((item.value / totalOrders) * 100).toFixed(0);
          return (
            <div key={item.name} className="flex items-center space-x-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 truncate text-[11px] font-medium">{item.name}</span>
              <span className="font-mono font-bold text-slate-800 text-[11px] ml-auto">
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
