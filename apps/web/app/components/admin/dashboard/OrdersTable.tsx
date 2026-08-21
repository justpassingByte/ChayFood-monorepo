'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Loader2 } from 'lucide-react';
import { orderService, Order } from '@/services/orderService';
import { ORDER_STATUS_LABELS, OrderStatus } from '@chayfood/shared-types';

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

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await orderService.getAll({ sortBy: 'createdAt', sortOrder: 'desc' });
        setOrders(data.slice(0, 10));
        setLoading(false);
      } catch (err: unknown) {
        setError('Không thể tải danh sách đơn hàng gần đây');
        setLoading(false);
        setOrders([]);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 space-x-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
        <span className="text-xs text-slate-500 font-medium">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-xs text-red-500 font-bold p-4">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 text-xs text-slate-400 font-medium">
        Chưa có đơn hàng nào
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
    }).format(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-xs divide-y divide-slate-100">
        <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
          <tr>
            <th className="px-5 py-3">Mã Đơn</th>
            <th className="px-5 py-3">Khách Hàng</th>
            <th className="px-5 py-3">Ngày Đặt</th>
            <th className="px-5 py-3">Tổng Tiền</th>
            <th className="px-5 py-3">Trạng Thái Đơn</th>
            <th className="px-5 py-3">Thanh Toán</th>
            <th className="px-5 py-3 text-right">Thao Tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {orders.map((order) => {
            const normStatus = order.status.toUpperCase();
            const normPayment = order.paymentStatus.toUpperCase();

            return (
              <tr key={order.id} className="hover:bg-slate-50/60 transition">
                <td className="px-5 py-3.5 font-mono font-bold text-slate-950">
                  #{order.orderNumber}
                </td>
                <td className="px-5 py-3.5 font-bold text-slate-900">
                  {order.user?.name || 'Khách vãng lai'}
                </td>
                <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-5 py-3.5 font-black text-emerald-800">
                  {formatCurrency(Number(order.totalAmount))}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      statusBadgeStyles[normStatus] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ORDER_STATUS_LABELS[normStatus as OrderStatus] || normStatus}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black ${
                      paymentBadgeStyles[normPayment] || 'bg-slate-100 text-slate-700'
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
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Xem</span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 text-xs">
        <span className="text-slate-400">Hiển thị {orders.length} đơn hàng gần nhất</span>
        <Link
          href="/admin/orders"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
        >
          Xem tất cả đơn hàng &rarr;
        </Link>
      </div>
    </div>
  );
}