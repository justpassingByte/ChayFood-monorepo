'use client';

import { Suspense, useState } from 'react';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import OrderStatusDonutChart from '@/components/admin/dashboard/OrderStatusDonutChart';
import PeakHoursBarChart from '@/components/admin/dashboard/PeakHoursBarChart';
import BestSellingItems from '@/components/admin/dashboard/BestSellingItems';
import AiReviewSentimentAnalytics from '@/components/admin/dashboard/AiReviewSentimentAnalytics';
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center space-x-2.5">
            <ChartPieIcon className="w-6 h-6 text-emerald-400" />
            <span>Trung Tâm Báo Cáo & Phân Tích Chuyên Sâu</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tổng hợp dữ liệu kinh doanh, tăng trưởng doanh số, phân bổ món ăn và hành vi tiêu dùng
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {/* Time Range Pills */}
          <div className="inline-flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === '7d'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Ngày
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === '30d'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Ngày
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === '90d'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Quý Này
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeRange === 'year'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Năm 2026
            </button>
          </div>

          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-all"
            title="Làm mới dữ liệu phân tích"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Analytics Macro Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Doanh Số Thuần (Net Sales)
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CurrencyDollarIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">₫189,450,000</p>
          <p className="text-xs text-emerald-400 mt-2 font-medium flex items-center space-x-1">
            <span>↑ 18.5%</span>
            <span className="text-slate-500 font-normal">so với tháng trước</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tổng Khẩu Phần Phục Vụ
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <ShoppingBagIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">1,842</p>
          <p className="text-xs text-sky-400 mt-2 font-medium flex items-center space-x-1">
            <span>↑ 12.0%</span>
            <span className="text-slate-500 font-normal">đơn đặt hàng</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tỷ Lệ Đăng Ký Gói Ăn
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UsersIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">42.8%</p>
          <p className="text-xs text-indigo-400 mt-2 font-medium flex items-center space-x-1">
            <span>↑ 6.4%</span>
            <span className="text-slate-500 font-normal">khách hàng trung thành</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tỷ Suất Lợi Nhuận Gộp
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CalendarDaysIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white mt-2">64.2%</p>
          <p className="text-xs text-amber-400 mt-2 font-medium flex items-center space-x-1">
            <span>Chuẩn BOM</span>
            <span className="text-slate-500 font-normal">tối ưu nguyên liệu</span>
          </p>
        </div>
      </div>

      {/* Analytics Visual Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Suspense fallback={<div className="h-96 bg-slate-900/60 rounded-2xl animate-pulse" />}>
            <RevenueChart />
          </Suspense>
        </div>
        <div className="lg:col-span-5">
          <Suspense fallback={<div className="h-96 bg-slate-900/60 rounded-2xl animate-pulse" />}>
            <OrderStatusDonutChart />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <Suspense fallback={<div className="h-96 bg-slate-900/60 rounded-2xl animate-pulse" />}>
            <PeakHoursBarChart />
          </Suspense>
        </div>
        <div className="lg:col-span-6">
          <Suspense fallback={<div className="h-96 bg-slate-900/60 rounded-2xl animate-pulse" />}>
            <BestSellingItems />
          </Suspense>
        </div>
      </div>

      {/* AI Customer Sentiment Deep Dive */}
      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<div className="h-96 bg-slate-900/60 rounded-2xl animate-pulse" />}>
          <AiReviewSentimentAnalytics />
        </Suspense>
      </div>
    </div>
  );
}