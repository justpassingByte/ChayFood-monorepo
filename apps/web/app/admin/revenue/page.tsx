'use client';

import { useState } from 'react';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import BestSellingItems from '@/components/admin/dashboard/BestSellingItems';
import AdminMetricCard from '@/components/admin/ui/AdminMetricCard';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <BanknotesIcon className="w-6 h-6 text-emerald-600" />
            <span>Báo Cáo Doanh Thu & Dòng Tiền Vận Hành</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Chi tiết tổng thu, giá trị đơn trung bình và hiệu suất bán hàng theo thời gian thực
          </p>
        </div>

        {/* Time Period Filter */}
        <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200 text-xs font-semibold shadow-xs self-start sm:self-auto">
          {(['today', 'week', 'month', 'year'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeRange(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === tab
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
        <AdminMetricCard
          title="Tổng Doanh Thu Lũy Kế"
          value={formatCurrency(189450000)}
          change="+14.8%"
          isPositive={true}
          icon={BanknotesIcon}
          accentColor="emerald"
          sparklineData={[120, 135, 148, 160, 172, 180, 189.4]}
        />
        <AdminMetricCard
          title="Doanh Thu Tháng Này"
          value={formatCurrency(48250000)}
          change="+8.2%"
          isPositive={true}
          icon={CalendarDaysIcon}
          accentColor="sky"
          sparklineData={[30, 34, 38, 41, 44, 46, 48.2]}
        />
        <AdminMetricCard
          title="Tổng Số Đơn Đã Giao"
          value="642 đơn"
          subtitle="94.2% Tỷ lệ giao hoàn tất"
          icon={ShoppingBagIcon}
          accentColor="indigo"
          sparklineData={[480, 510, 540, 580, 600, 620, 642]}
        />
        <AdminMetricCard
          title="Giá Trị Đơn TB (AOV)"
          value={formatCurrency(295000)}
          change="+12.5k"
          isPositive={true}
          icon={ReceiptPercentIcon}
          accentColor="amber"
          sparklineData={[260, 270, 275, 280, 285, 290, 295]}
        />
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