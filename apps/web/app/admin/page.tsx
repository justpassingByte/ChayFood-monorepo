import { Suspense } from 'react';
import RevenueChart from '../components/admin/dashboard/RevenueChart';
import OrderStatusDonutChart from '../components/admin/dashboard/OrderStatusDonutChart';
import PeakHoursBarChart from '../components/admin/dashboard/PeakHoursBarChart';
import BestSellingItems from '../components/admin/dashboard/BestSellingItems';
import AiReviewSentimentAnalytics from '../components/admin/dashboard/AiReviewSentimentAnalytics';
import OrdersTable from '../components/admin/dashboard/OrdersTable';
import MetricCard from '../components/admin/dashboard/MetricCard';
import {
  BanknotesIcon,
  ShoppingCartIcon,
  UsersIcon,
  ClockIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Bảng Điều Hành Quản Trị | ChayFood Admin Portal',
  description: 'Tổng quan chỉ số kinh doanh, biểu đồ tăng trưởng và phản hồi khách hàng AI',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-5 max-w-[1600px] mx-auto pb-10">
      {/* Top Banner / Executive Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Bảng Điều Hành Tổng Quan</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Theo dõi hiệu suất vận hành ẩm thực, doanh thu thực nhận và tín hiệu từ thực khách
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono self-start sm:self-auto">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Hệ Thống Trực Tuyến</span>
          </span>
        </div>
      </div>

      {/* Row 1: 5 Macro KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        <Suspense fallback={<div className="h-28 bg-slate-900/60 rounded-2xl animate-pulse" />}>
          <MetricCard
            title="Doanh Thu Hôm Nay"
            value="₫8,294,500"
            change="+14.2%"
            trend="up"
            subtitle="so với hôm qua"
            icon={<BanknotesIcon className="w-4 h-4" />}
            sparklineData={[32, 45, 40, 58, 62, 75, 88]}
            accentColor="emerald"
          />
        </Suspense>

        <Suspense fallback={<div className="h-28 bg-slate-900/60 rounded-2xl animate-pulse" />}>
          <MetricCard
            title="Đơn Trong Ngày"
            value="28"
            change="+8.5%"
            trend="up"
            subtitle="26 đơn hoàn tất"
            icon={<ShoppingCartIcon className="w-4 h-4" />}
            sparklineData={[12, 18, 15, 22, 25, 24, 28]}
            accentColor="sky"
          />
        </Suspense>

        <Suspense fallback={<div className="h-28 bg-slate-900/60 rounded-2xl animate-pulse" />}>
          <MetricCard
            title="Khách Hàng Mới"
            value="12"
            change="+24.0%"
            trend="up"
            subtitle="8 gói ăn tuần"
            icon={<UsersIcon className="w-4 h-4" />}
            sparklineData={[4, 6, 5, 8, 9, 10, 12]}
            accentColor="indigo"
          />
        </Suspense>

        <Suspense fallback={<div className="h-28 bg-slate-900/60 rounded-2xl animate-pulse" />}>
          <MetricCard
            title="Giá Trị Đơn (AOV)"
            value="₫296,000"
            change="+5.2%"
            trend="up"
            subtitle="trung bình/đơn"
            icon={<ReceiptPercentIcon className="w-4 h-4" />}
            sparklineData={[260, 275, 270, 285, 290, 292, 296]}
            accentColor="amber"
          />
        </Suspense>

        <Suspense fallback={<div className="h-28 bg-slate-900/60 rounded-2xl animate-pulse" />}>
          <MetricCard
            title="Thời Gian Giao"
            value="24 phút"
            change="-6.5%"
            trend="up"
            subtitle="nhanh hơn chuẩn"
            icon={<ClockIcon className="w-4 h-4" />}
            sparklineData={[30, 28, 29, 26, 25, 24, 24]}
            accentColor="emerald"
          />
        </Suspense>
      </div>

      {/* Row 2: Revenue Trend Area Chart + Order Status Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 min-w-0">
          <Suspense fallback={<div className="h-96 bg-slate-900/60 rounded-2xl animate-pulse" />}>
            <RevenueChart />
          </Suspense>
        </div>

        <div className="lg:col-span-5 min-w-0">
          <Suspense fallback={<div className="h-96 bg-slate-900/60 rounded-2xl animate-pulse" />}>
            <OrderStatusDonutChart />
          </Suspense>
        </div>
      </div>

      {/* Row 3: Peak Hours Bar Chart + Best Selling Items Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 min-w-0">
          <Suspense fallback={<div className="h-96 bg-slate-900/60 rounded-2xl animate-pulse" />}>
            <PeakHoursBarChart />
          </Suspense>
        </div>

        <div className="lg:col-span-6 min-w-0">
          <Suspense fallback={<div className="h-96 bg-slate-900/60 rounded-2xl animate-pulse" />}>
            <BestSellingItems />
          </Suspense>
        </div>
      </div>

      {/* Row 4: AI Customer Sentiment & Menu Insights + Recent Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 min-w-0">
          <Suspense fallback={<div className="h-96 bg-slate-900/60 rounded-2xl animate-pulse" />}>
            <AiReviewSentimentAnalytics />
          </Suspense>
        </div>

        <div className="lg:col-span-7 min-w-0">
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-5 flex flex-col h-full hover:border-slate-700/80 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white tracking-wide">
                  Đơn Hàng Gần Đây
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cập nhật các giao dịch đặt món và thanh toán mới nhất
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Thời gian thực
              </span>
            </div>

            <Suspense fallback={<div className="h-72 bg-slate-950/40 rounded-xl animate-pulse" />}>
              <OrdersTable />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}