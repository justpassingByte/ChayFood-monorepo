'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Loader2,
  AlertCircle,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { orderService, Order } from '@/services/orderService';
import {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  ORDER_STATUS_LABELS,
} from '@chayfood/shared-types';

const statusBadgeStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-900 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-900 border-blue-200',
  PREPARING: 'bg-purple-50 text-purple-900 border-purple-200',
  READY: 'bg-indigo-50 text-indigo-900 border-indigo-200',
  DELIVERING: 'bg-cyan-50 text-cyan-900 border-cyan-200',
  DELIVERED: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-900 border-red-200',
};

const paymentBadgeStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-900',
  PAID: 'bg-emerald-100 text-emerald-900',
  FAILED: 'bg-red-100 text-red-900',
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
      setError('Không thể tải danh sách đơn hàng');
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
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Quản Lý Đơn Hàng
          </h1>
          <p className="text-xs text-slate-500">
            Theo dõi tiến trình chế biến, giao nhận và trạng thái thanh toán
          </p>
        </div>

        {/* Date Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border text-xs font-bold">
          {(['all', 'today', 'week', 'month'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setDateRangeTab(tab)}
              className={`px-3 py-1.5 rounded-xl transition ${
                dateRangeTab === tab
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
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
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Mã đơn, tên, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-emerald-600 font-medium"
            />
          </form>

          {/* Order Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
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
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
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
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
          >
            <option value="">Phương thức: Tất cả</option>
            <option value="BANKING">Chuyển khoản VietQR</option>
            <option value="COD">Tiền mặt (COD)</option>
            <option value="CARD">Thẻ quốc tế</option>
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Tìm thấy {orders.length} đơn hàng</span>
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition ${
                sortBy === 'createdAt' ? 'bg-slate-100 text-slate-900 border-slate-300' : 'border-slate-200'
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition ${
                sortBy === 'totalAmount' ? 'bg-slate-100 text-slate-900 border-slate-300' : 'border-slate-200'
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
        <div className="flex flex-col items-center justify-center h-64 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <p className="text-xs text-slate-500 font-medium">Đang tải danh sách đơn hàng...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 text-xs font-bold">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm font-bold text-slate-700">Không tìm thấy đơn hàng nào</p>
          <p className="text-xs">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Mã Đơn</th>
                  <th className="px-5 py-3.5">Khách Hàng</th>
                  <th className="px-5 py-3.5">Tổng Tiền</th>
                  <th className="px-5 py-3.5">Trạng Thái Đơn</th>
                  <th className="px-5 py-3.5">Thanh Toán</th>
                  <th className="px-5 py-3.5">Phương Thức</th>
                  <th className="px-5 py-3.5">Ngày Đặt</th>
                  <th className="px-5 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const normStatus = order.status.toUpperCase();
                  const normPayment = order.paymentStatus.toUpperCase();

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4 font-mono font-bold text-slate-950">
                        #{order.orderNumber}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">
                          {order.user?.name || 'Khách vãng lai'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {order.user?.phone || order.user?.email || '—'}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-black text-emerald-800">
                        {formatCurrency(Number(order.totalAmount))}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            statusBadgeStyles[normStatus] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ORDER_STATUS_LABELS[normStatus as OrderStatus] || normStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black ${
                            paymentBadgeStyles[normPayment] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {normPayment === 'PAID'
                            ? 'ĐÃ THANH TOÁN'
                            : normPayment === 'PENDING'
                            ? 'CHỜ TT'
                            : 'THẤT BẠI'}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-600">
                        {order.paymentMethod === 'BANKING'
                          ? 'VietQR'
                          : order.paymentMethod === 'CARD'
                          ? 'Thẻ'
                          : 'COD'}
                      </td>
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
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