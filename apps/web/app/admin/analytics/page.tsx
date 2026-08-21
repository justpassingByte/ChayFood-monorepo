'use client';

import { Suspense, useState } from 'react';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import OrderStatusDonutChart from '@/components/admin/dashboard/OrderStatusDonutChart';
import PeakHoursBarChart from '@/components/admin/dashboard/PeakHoursBarChart';
import BestSellingItems from '@/components/admin/dashboard/BestSellingItems';
import AiReviewSentimentAnalytics from '@/components/admin/dashboard/AiReviewSentimentAnalytics';
import AdminMetricCard from '@/components/admin/ui/AdminMetricCard';
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'year'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Analytics Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2.5">
            <ChartPieIcon className="w-6 h-6 text-emerald-600" />
            <span>Trung Tâm Báo Cáo & Phân Tích Chuyên Sâu</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp dữ liệu kinh doanh, tăng trưởng doanh số, phân bổ món ăn và hành vi tiêu dùng
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {/* Time Range Pills */}
          <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200 shadow-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === '7d'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Ngày
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === '30d'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Ngày
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === '90d'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quý Này
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === 'year'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Năm 2026
            </button>
          </div>

          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-xs transition-all"
            title="Làm mới dữ liệu phân tích"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Analytics Macro Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Doanh Số Thuần (Net Sales)"
          value="₫189,450,000"
          change="+18.5%"
          isPositive={true}
          icon={CurrencyDollarIcon}
          accentColor="emerald"
          sparklineData={[120, 135, 148, 160, 172, 180, 189]}
        />
        <AdminMetricCard
          title="Tổng Khẩu Phần Phục Vụ"
          value="1,842"
          change="+12.0%"
          isPositive={true}
          icon={ShoppingBagIcon}
          accentColor="sky"
          sparklineData={[1200, 1350, 1480, 1600, 1720, 1800, 1842]}
        />
        <AdminMetricCard
          title="Tỷ Lệ Đăng Ký Gói Ăn"
          value="42.8%"
          change="+6.4%"
          isPositive={true}
          icon={UsersIcon}
          accentColor="indigo"
          sparklineData={[30, 32, 35, 38, 40, 41, 42.8]}
        />
        <AdminMetricCard
          title="Tỷ Suất Lợi Nhuận Gộp"
          value="64.2%"
          subtitle="Chuẩn BOM tối ưu nguyên liệu"
          icon={CalendarDaysIcon}
          accentColor="amber"
          sparklineData={[58, 60, 61, 62, 63, 64, 64.2]}
        />
      </div>

      {/* Analytics Visual Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Suspense fallback={<div className="h-96 bg-white rounded-2xl animate-pulse" />}>
            <RevenueChart />
          </Suspense>
        </div>
        <div className="lg:col-span-5">
          <Suspense fallback={<div className="h-96 bg-white rounded-2xl animate-pulse" />}>
            <OrderStatusDonutChart />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <Suspense fallback={<div className="h-96 bg-white rounded-2xl animate-pulse" />}>
            <PeakHoursBarChart />
          </Suspense>
        </div>
        <div className="lg:col-span-6">
          <Suspense fallback={<div className="h-96 bg-white rounded-2xl animate-pulse" />}>
            <BestSellingItems />
          </Suspense>
        </div>
      </div>

      {/* AI Customer Sentiment Deep Dive */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<div className="h-96 bg-white rounded-2xl animate-pulse" />}>
          <AiReviewSentimentAnalytics />
        </Suspense>
      </div>
    </div>
  );
}