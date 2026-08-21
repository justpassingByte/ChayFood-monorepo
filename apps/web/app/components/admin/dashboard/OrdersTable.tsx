'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Loader2, ArrowRight } from 'lucide-react';
import { orderService, Order } from '@/services/orderService';
import { ORDER_STATUS_LABELS, OrderStatus } from '@chayfood/shared-types';

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

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await orderService.getAll({ sortBy: 'createdAt', sortOrder: 'desc' });
        setOrders(data.slice(0, 8));
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Không thể tải danh sách đơn hàng gần đây');
        }
        setLoading(false);
        setOrders([]);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-52 space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        <span className="text-xs text-slate-400 font-mono">Đang đồng bộ đơn hàng gần nhất...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs text-rose-400 font-medium p-6 text-center bg-rose-950/20 rounded-xl border border-rose-500/20">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 text-xs text-slate-500 font-medium">
        Chưa có đơn hàng nào trong hệ thống
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full text-left text-xs divide-y divide-slate-800">
          <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Mã Đơn Hàng</th>
              <th className="px-5 py-3.5">Khách Hàng</th>
              <th className="px-5 py-3.5">Thời Gian</th>
              <th className="px-5 py-3.5">Tổng Tiền</th>
              <th className="px-5 py-3.5">Trạng Thái Đơn</th>
              <th className="px-5 py-3.5">Thanh Toán</th>
              <th className="px-5 py-3.5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {orders.map((order) => {
              const normStatus = order.status.toUpperCase();
              const normPayment = order.paymentStatus.toUpperCase();

              return (
                <tr
                  key={order.id}
                  className="hover:bg-slate-800/40 transition-colors duration-150 group"
                >
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-100">
                    #{order.orderNumber}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-200">
                    {order.user?.name || 'Khách vãng lai'}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-emerald-400">
                    {formatCurrency(Number(order.totalAmount))}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                        statusBadgeStyles[normStatus] || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {ORDER_STATUS_LABELS[normStatus as OrderStatus] || normStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
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
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/30 font-medium text-[11px] transition-all"
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

      {/* Table Footer Link */}
      <div className="flex justify-between items-center px-5 py-3.5 bg-slate-950/40 border-t border-slate-800/80 text-xs">
        <span className="text-slate-400">
          Hiển thị <span className="font-mono text-slate-200">{orders.length}</span> đơn hàng mới nhất
        </span>
        <Link
          href="/admin/orders"
          className="inline-flex items-center space-x-1 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>Xem danh sách đầy đủ</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}