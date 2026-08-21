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
import { orderService, Order } from '@/services/orderService';
import {
  OrderStatus,
  ORDER_STATUS_LABELS,
} from '@chayfood/shared-types';

const statusBadgeStyles: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  CONFIRMED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PREPARING: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  READY: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  DELIVERING: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  DELIVERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  CANCELLED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const paymentBadgeStyles: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  PAID: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  FAILED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

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

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <ClipboardList className="w-6 h-6 text-emerald-400" />
            <span>Quản Lý Tiến Trình Đơn Hàng</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi tiến trình chế biến món chay, giao nhận tận nơi và trạng thái thanh toán
          </p>
        </div>

        {/* Date Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold self-start sm:self-auto">
          {(['all', 'today', 'week', 'month'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setDateRangeTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRangeTab === tab
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
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

      {/* 6 Multidimensional Filters Bar */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Mã đơn, tên, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </form>

          {/* Order Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="">Trạng thái đơn: Tất cả</option>
            {Object.keys(ORDER_STATUS_LABELS).map((st) => (
              <option key={st} value={st}>
                {ORDER_STATUS_LABELS[st as OrderStatus]}
              </option>
            ))}
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="">Thanh toán: Tất cả</option>
            <option value="PENDING">Chờ thanh toán</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="FAILED">Thất bại</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="">Phương thức: Tất cả</option>
            <option value="BANKING">Chuyển khoản VietQR</option>
            <option value="COD">Tiền mặt khi nhận (COD)</option>
            <option value="CARD">Thẻ quốc tế</option>
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400 gap-2">
          <span>
            Tìm thấy <strong className="font-mono text-emerald-400">{orders.length}</strong> đơn hàng
          </span>
          <div className="flex items-center gap-2">
            <span className="font-medium">Sắp xếp:</span>
            <button
              type="button"
              onClick={() => {
                if (sortBy === 'createdAt') {
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortBy('createdAt');
                  setSortOrder('desc');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition ${
                sortBy === 'createdAt'
                  ? 'bg-slate-800 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>Ngày đặt ({sortOrder === 'desc' ? 'Mới nhất' : 'Cũ nhất'})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (sortBy === 'totalAmount') {
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortBy('totalAmount');
                  setSortOrder('desc');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition ${
                sortBy === 'totalAmount'
                  ? 'bg-slate-800 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <ArrowUpDown className="w-3 h-3" />
              <span>Tổng tiền ({sortOrder === 'desc' ? 'Cao' : 'Thấp'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          <p className="text-xs text-slate-400 font-mono">Đang đồng bộ danh sách đơn hàng...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-6 text-center text-rose-400 text-xs font-medium">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-12 text-center text-slate-400 space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto text-slate-500" />
          <p className="text-sm font-semibold text-slate-200">Không tìm thấy đơn hàng nào</p>
          <p className="text-xs">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs divide-y divide-slate-800">
              <thead className="bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider">
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
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((order) => {
                  const normStatus = order.status.toUpperCase();
                  const normPayment = order.paymentStatus.toUpperCase();

                  return (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors duration-150 group">
                      <td className="px-5 py-4 font-mono font-bold text-slate-100 whitespace-nowrap">
                        #{order.orderNumber}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-200">
                          {order.user?.name || 'Khách vãng lai'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {order.user?.phone || order.user?.email || '—'}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {formatCurrency(Number(order.totalAmount))}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            statusBadgeStyles[normStatus] || 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {ORDER_STATUS_LABELS[normStatus as OrderStatus] || normStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold border font-mono ${
                            paymentBadgeStyles[normPayment] || 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {normPayment === 'PAID'
                            ? 'ĐÃ TT'
                            : normPayment === 'PENDING'
                            ? 'CHỜ TT'
                            : 'THẤT BẠI'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-300 whitespace-nowrap font-medium">
                        {order.paymentMethod === 'BANKING'
                          ? 'VietQR'
                          : order.paymentMethod === 'CARD'
                          ? 'Thẻ'
                          : 'Tiền mặt'}
                      </td>
                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/30 font-medium text-xs transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Chi tiết</span>
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
    </div>
  );
}