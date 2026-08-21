'use client';

import { useState } from 'react';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import BestSellingItems from '@/components/admin/dashboard/BestSellingItems';
import {
  BanknotesIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <BanknotesIcon className="w-6 h-6 text-emerald-400" />
            <span>Báo Cáo Doanh Thu & Dòng Tiền Vận Hành</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Chi tiết tổng thu, giá trị đơn trung bình và hiệu suất bán hàng theo thời gian thực
          </p>
        </div>

        {/* Time Period Filter */}
        <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold self-start sm:self-auto">
          {(['today', 'week', 'month', 'year'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeRange(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === tab
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'today'
                ? 'Hôm nay'
                : tab === 'week'
                ? 'Tuần này'
                : tab === 'month'
                ? 'Tháng này'
                : 'Năm 2026'}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Statistics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 hover:border-emerald-500/30 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tổng Doanh Thu Lũy Kế
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BanknotesIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">
            {formatCurrency(189450000)}
          </p>
          <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center space-x-1">
            <span>↑ 14.8%</span>
            <span className="text-slate-500 font-normal">so với chu kỳ trước</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 hover:border-sky-500/30 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Doanh Thu Tháng Này
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <CalendarDaysIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">
            {formatCurrency(48250000)}
          </p>
          <p className="text-xs text-sky-400 mt-2 font-medium flex items-center space-x-1">
            <span>↑ 8.2%</span>
            <span className="text-slate-500 font-normal">tiến độ đạt 104% chỉ tiêu</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 hover:border-indigo-500/30 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tổng Số Đơn Đã Giao
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShoppingBagIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">642 đơn</p>
          <p className="text-xs text-indigo-400 mt-2 font-medium flex items-center space-x-1">
            <span>94.2% Hoàn tất</span>
            <span className="text-slate-500 font-normal">tỷ lệ giao thành công</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 hover:border-amber-500/30 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Giá Trị Đơn Trung Bình (AOV)
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ReceiptPercentIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">
            {formatCurrency(295000)}
          </p>
          <p className="text-xs text-amber-400 mt-2 font-medium flex items-center space-x-1">
            <span>↑ 12.500 ₫</span>
            <span className="text-slate-500 font-normal">nhờ gói combo 3 món</span>
          </p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RevenueChart />
        </div>
        <div className="lg:col-span-5">
          <BestSellingItems />
        </div>
      </div>
    </div>
  );
}