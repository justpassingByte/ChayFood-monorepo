'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Loader2, ArrowRight } from 'lucide-react';
import { orderService, Order } from '@/services/orderService';
import { ORDER_STATUS_LABELS, OrderStatus } from '@chayfood/shared-types';

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
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="text-xs text-slate-500 font-mono">Đang đồng bộ đơn hàng gần nhất...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs text-rose-600 font-bold p-6 text-center bg-rose-50 rounded-xl border border-rose-200">
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
        <table className="min-w-full text-left text-xs divide-y divide-slate-200">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
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
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const normStatus = order.status.toUpperCase();
              const normPayment = order.paymentStatus.toUpperCase();

              return (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/80 transition-colors duration-150 group"
                >
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                    #{order.orderNumber}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">
                    {order.user?.name || 'Khách vãng lai'}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-3.5 font-mono font-bold text-emerald-700">
                    {formatCurrency(Number(order.totalAmount))}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        statusBadgeStyles[normStatus] || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {ORDER_STATUS_LABELS[normStatus as OrderStatus] || normStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
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
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 font-bold text-[11px] transition-all"
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
      <div className="flex justify-between items-center px-5 py-3.5 bg-slate-50 border-t border-slate-200 text-xs">
        <span className="text-slate-500">
          Hiển thị <span className="font-mono text-slate-800 font-bold">{orders.length}</span> đơn hàng mới nhất
        </span>
        <Link
          href="/admin/orders"
          className="inline-flex items-center space-x-1 font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <span>Xem danh sách đầy đủ</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}