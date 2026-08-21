'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowUpDown,
  Eye,
  Loader2,
  AlertCircle,
  Calendar,
  ClipboardList,
} from 'lucide-react';
import {
  ClipboardDocumentCheckIcon,
  TruckIcon,
  CheckCircleIcon,
  BanknotesIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { orderService, Order } from '@/services/orderService';
import {
  OrderStatus,
  ORDER_STATUS_LABELS,
} from '@chayfood/shared-types';

import AdminMetricCard from '@/components/admin/ui/AdminMetricCard';
import AdminFilterBar from '@/components/admin/ui/AdminFilterBar';
import AdminPagination from '@/components/admin/ui/AdminPagination';
import AdminDrawer from '@/components/admin/ui/AdminDrawer';

const statusBadgeStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PREPARING: 'bg-purple-50 text-purple-700 border-purple-200',
  READY: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERING: 'bg-sky-50 text-sky-700 border-sky-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
};

const paymentBadgeStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  FAILED: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 6 Filters State
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRangeTab, setDateRangeTab] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'totalAmount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Drawer and Pagination
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let startDate: string | undefined;
      let endDate: string | undefined;

      const now = new Date();
      if (dateRangeTab === 'today') {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startDate = start.toISOString();
      } else if (dateRangeTab === 'week') {
        const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate = start.toISOString();
      } else if (dateRangeTab === 'month') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = start.toISOString();
      }

      const result = await orderService.getAll({
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        paymentMethod: paymentMethodFilter || undefined,
        search: searchQuery || undefined,
        startDate,
        endDate,
        sortBy,
        sortOrder,
      });

      setOrders(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể tải danh sách đơn hàng');
      }
    } finally {
      setLoading(false);
    }
  }, [
    statusFilter,
    paymentStatusFilter,
    paymentMethodFilter,
    searchQuery,
    dateRangeTab,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(d);
  };

  const handleOpenDrawer = (order: Order) => {
    setSelectedOrder(order);
    setShowDrawer(true);
  };

  const totalPages = Math.max(1, Math.ceil(orders.length / itemsPerPage));
  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalAmountSum = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const preparingCount = orders.filter((o) => ['CONFIRMED', 'PREPARING', 'READY', 'DELIVERING'].includes(o.status)).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <ClipboardList className="w-6 h-6 text-emerald-600" />
            <span>Quản Lý Tiến Trình Đơn Hàng</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi tiến trình chế biến món chay, giao nhận tận nơi và trạng thái thanh toán
          </p>
        </div>

        {/* Date Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs self-start sm:self-auto">
          {(['all', 'today', 'week', 'month'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setDateRangeTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRangeTab === tab
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'all'
                ? 'Tất cả'
                : tab === 'today'
                ? 'Hôm nay'
                : tab === 'week'
                ? '7 ngày'
                : 'Tháng này'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Quick KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard
          title="Tổng Đơn Đã Đặt"
          value={String(orders.length)}
          subtitle="Toàn bộ đơn hàng ghi nhận"
          icon={ClipboardDocumentCheckIcon}
          accentColor="indigo"
          sparklineData={[12, 18, 15, 22, 28, 30, orders.length || 32]}
        />
        <AdminMetricCard
          title="Đang Xử Lý & Giao"
          value={String(preparingCount)}
          subtitle="Đang chế biến hoặc trên đường"
          icon={TruckIcon}
          accentColor="sky"
          sparklineData={[5, 8, 7, 10, 9, 8, preparingCount || 8]}
        />
        <AdminMetricCard
          title="Giao Thành Công"
          value={String(deliveredCount)}
          subtitle="Đã hoàn tất thanh toán"
          icon={CheckCircleIcon}
          accentColor="emerald"
          sparklineData={[6, 9, 8, 12, 18, 20, deliveredCount || 22]}
        />
        <AdminMetricCard
          title="Tổng Giá Trị Đơn"
          value={formatCurrency(totalAmountSum)}
          subtitle="Dòng tiền đơn hàng hiện tại"
          icon={BanknotesIcon}
          accentColor="amber"
          sparklineData={[20, 35, 40, 55, 60, 75, 85]}
        />
      </div>

      {/* Unified AdminFilterBar */}
      <AdminFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        searchPlaceholder="Tìm theo mã đơn #CF, tên khách hàng, số điện thoại..."
        filters={[
          {
            id: 'status',
            value: statusFilter,
            onChange: (v) => setStatusFilter(v),
            options: [
              { label: 'Trạng thái đơn: Tất cả', value: '' },
              ...Object.keys(ORDER_STATUS_LABELS).map((st) => ({
                label: ORDER_STATUS_LABELS[st as OrderStatus],
                value: st,
              })),
            ],
          },
          {
            id: 'paymentStatus',
            value: paymentStatusFilter,
            onChange: (v) => setPaymentStatusFilter(v),
            options: [
              { label: 'Thanh toán: Tất cả', value: '' },
              { label: 'Chờ thanh toán', value: 'PENDING' },
              { label: 'Đã thanh toán', value: 'PAID' },
              { label: 'Thất bại', value: 'FAILED' },
            ],
          },
          {
            id: 'paymentMethod',
            value: paymentMethodFilter,
            onChange: (v) => setPaymentMethodFilter(v),
            options: [
              { label: 'Phương thức: Tất cả', value: '' },
              { label: 'Chuyển khoản VietQR', value: 'BANKING' },
              { label: 'Tiền mặt (COD)', value: 'COD' },
              { label: 'Thẻ quốc tế', value: 'CARD' },
            ],
          },
        ]}
        totalResults={orders.length}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('');
          setPaymentStatusFilter('');
          setPaymentMethodFilter('');
          setDateRangeTab('all');
        }}
      />

      {/* Orders Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <p className="text-xs text-slate-500 font-mono">Đang đồng bộ danh sách đơn hàng...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-700 text-xs font-semibold">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 space-y-2 shadow-xs">
          <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm font-bold text-slate-800">Không tìm thấy đơn hàng nào</p>
          <p className="text-xs">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 whitespace-nowrap">Mã Đơn Hàng</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Khách Hàng</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Tổng Tiền</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Trạng Thái Đơn</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Thanh Toán</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Phương Thức</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Ngày Đặt</th>
                  <th className="px-5 py-3.5 text-right whitespace-nowrap">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedOrders.map((order) => {
                  const normStatus = order.status.toUpperCase();
                  const normPayment = order.paymentStatus.toUpperCase();

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors duration-150 group">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        #{order.orderNumber}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">
                          {order.user?.name || 'Khách vãng lai'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {order.user?.phone || order.user?.email || '—'}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                        {formatCurrency(Number(order.totalAmount))}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            statusBadgeStyles[normStatus] || 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {ORDER_STATUS_LABELS[normStatus as OrderStatus] || normStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold border font-mono ${
                            paymentBadgeStyles[normPayment] || 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {normPayment === 'PAID'
                            ? 'ĐÃ TT'
                            : normPayment === 'PENDING'
                            ? 'CHỜ TT'
                            : 'THẤT BẠI'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-700 whitespace-nowrap font-medium">
                        {order.paymentMethod === 'BANKING'
                          ? 'VietQR'
                          : order.paymentMethod === 'CARD'
                          ? 'Thẻ'
                          : 'Tiền mặt'}
                      </td>
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenDrawer(order)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs transition"
                          title="Xem nhanh đơn hàng"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem Nhanh</span>
                        </button>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition"
                        >
                          <span>Quản Lý Tiến Trình</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={orders.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* Order Quick View Drawer */}
      <AdminDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        title={`Đơn Hàng #${selectedOrder?.orderNumber || ''}`}
        subtitle="Chi tiết thông tin món ăn và địa chỉ giao hàng"
        icon={ClipboardList}
        width="lg"
        footerActions={
          selectedOrder && (
            <div className="flex items-center justify-between w-full">
              <span className="font-mono font-bold text-emerald-700 text-sm">
                Tổng: {formatCurrency(Number(selectedOrder.totalAmount))}
              </span>
              <Link
                href={`/admin/orders/${selectedOrder.id}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Trang Chi Tiết Đầy Đủ ↗
              </Link>
            </div>
          )
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            {/* Customer info card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-slate-900 font-bold">
                <UserIcon className="w-4 h-4 text-emerald-600" />
                <span>{selectedOrder.user?.name || 'Khách vãng lai'}</span>
              </div>
              <div className="text-slate-600 text-xs flex items-center space-x-2">
                <PhoneIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedOrder.user?.phone || 'Chưa có số điện thoại'}</span>
              </div>
              <div className="text-slate-600 text-xs flex items-start space-x-2">
                <MapPinIcon className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>
                  {typeof selectedOrder.deliveryAddress === 'string'
                    ? selectedOrder.deliveryAddress
                    : (selectedOrder.deliveryAddress as { street?: string; city?: string })?.street ||
                      'Địa chỉ mặc định'}
                </span>
              </div>
            </div>

            {/* Status pills */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Trạng Thái Đơn</span>
                <span className="font-bold text-xs text-slate-900 mt-0.5 block">
                  {ORDER_STATUS_LABELS[selectedOrder.status.toUpperCase() as OrderStatus] || selectedOrder.status}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Thanh Toán</span>
                <span className="font-bold text-xs text-emerald-700 mt-0.5 block">
                  {selectedOrder.paymentStatus.toUpperCase() === 'PAID' ? 'Đã Thanh Toán' : 'Chờ Thanh Toán'}
                </span>
              </div>
            </div>

            {/* Order Items list */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Danh Sách Món Ăn
              </h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{item.menuItem?.name || 'Món chay'}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {item.quantity} x {formatCurrency(Number(item.price))}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(item.quantity * Number(item.price))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}