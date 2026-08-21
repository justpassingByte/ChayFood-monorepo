'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Calendar,
  CreditCard,
  QrCode,
  RotateCcw,
  Eye,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { orderService, Order, OrderItem } from '../../services/orderService';
import { ORDER_STATUS_LABELS, OrderStatus } from '@chayfood/shared-types';
import { useCartStore } from '../../store/useCartStore';
import { MenuItem } from '../../lib/services/types';

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

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const cartStore = useCartStore();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch {
      setError('Không thể tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Hủy đơn hàng (khi PENDING)
  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
    try {
      setActionLoadingId(orderId);
      await orderService.cancel(orderId);
      toast.success('Đã hủy đơn hàng');
      await fetchOrders();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể hủy đơn hàng';
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Mua lại đơn này (Reorder)
  const handleReorder = (order: Order) => {
    let addedCount = 0;
    order.items.forEach((item: OrderItem) => {
      if (item.menuItem) {
        const itemId = item.menuItemId || item.menuItem.id || 'item';
        const dummyMenuItem: MenuItem = {
          _id: itemId,
          id: itemId,
          name: item.menuItem.name,
          price: Number(item.price),
          image: item.menuItem.image || '',
          category: 'MON_CHINH',
          description: '',
          isAvailable: true,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
        cartStore.addItem(dummyMenuItem, item.quantity);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast.success(`Đã thêm ${addedCount} món vào giỏ hàng`);
      cartStore.setCartDrawerOpen(true);
    } else {
      toast.error('Không tìm thấy thông tin món ăn để đặt lại');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const st = o.status.toUpperCase();
    if (activeTab === 'all') return true;
    if (activeTab === 'active') {
      return ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING'].includes(st);
    }
    if (activeTab === 'completed') return st === 'DELIVERED';
    if (activeTab === 'cancelled') return st === 'CANCELLED';
    return true;
  });

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(d);
    } catch {
      return iso;
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-950 tracking-tight">
              Lịch Sử Đơn Hàng
            </h2>
            <p className="text-[11px] text-slate-500">
              Xem lại các bữa ăn thanh lành và theo dõi tiến trình giao nhận
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Tổng cộng: <strong className="text-slate-900">{orders.length}</strong> đơn hàng
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold overflow-x-auto">
          {(
            [
              { id: 'all', label: 'Tất cả đơn' },
              { id: 'active', label: 'Đang xử lý' },
              { id: 'completed', label: 'Đã giao' },
              { id: 'cancelled', label: 'Đã hủy' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-xs text-slate-500 font-medium">Đang tải danh sách đơn hàng...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center text-red-700 text-xs font-bold">
          {error}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Chưa có đơn hàng nào</h3>
            <p className="text-xs text-slate-400 mt-1">
              Thưởng thức các món chay thanh lành, giàu dinh dưỡng mỗi ngày
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
          >
            <span>Khám Phá Thực Đơn</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const normStatus = order.status.toUpperCase();
            const normPayment = order.paymentStatus.toUpperCase();
            const isPending = normStatus === 'PENDING';
            const canPayQr = isPending && order.paymentMethod === 'BANKING' && normPayment === 'PENDING';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition space-y-4"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-700 font-mono font-black text-xs">
                      #{order.orderNumber}
                    </div>
                    <div className="text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        statusBadgeStyles[normStatus] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ORDER_STATUS_LABELS[normStatus as OrderStatus] || normStatus}
                    </span>

                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black ${
                        paymentBadgeStyles[normPayment] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {normPayment === 'PAID'
                        ? 'ĐÃ THANH TOÁN'
                        : normPayment === 'PENDING'
                        ? 'CHỜ THANH TOÁN'
                        : 'THẤT BẠI'}
                    </span>
                  </div>
                </div>

                {/* Card Items Preview */}
                <div className="divide-y divide-slate-50">
                  {order.items.slice(0, 3).map((item: OrderItem, idx: number) => (
                    <div key={idx} className="py-2 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border">
                          {item.menuItem?.image ? (
                            <Image
                              src={item.menuItem.image}
                              alt={item.menuItem.name || 'Món chay'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400 font-bold">
                              Chay
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">
                            {item.menuItem?.name || 'Món chay tươi ngon'}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            Số lượng: {item.quantity}
                          </span>
                        </div>
                      </div>

                      <span className="font-black text-slate-900">
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}

                  {order.items.length > 3 && (
                    <p className="text-[11px] text-slate-400 pt-1.5 font-medium">
                      + và {order.items.length - 3} món khác
                    </p>
                  )}
                </div>

                {/* Card Footer & Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="text-slate-500 font-medium">Tổng thanh toán: </span>
                    <strong className="text-emerald-700 font-black text-sm sm:text-base">
                      {formatCurrency(Number(order.totalAmount))}
                    </strong>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Nút Thanh toán ngay nếu chưa TT qua VietQR */}
                    {canPayQr && (
                      <Link
                        href={`/checkout/payment/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-xs animate-pulse"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Thanh toán ngay</span>
                      </Link>
                    )}

                    {/* Nút Xem chi tiết & tiến trình */}
                    <Link
                      href={`/order/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi tiết & Tiến trình</span>
                    </Link>

                    {/* Nút Đặt lại đơn này */}
                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition border border-emerald-200/80"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Đặt lại đơn này</span>
                    </button>

                    {/* Nút Hủy đơn khi PENDING */}
                    {isPending && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={actionLoadingId === order.id}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition border border-red-200"
                        title="Hủy đơn hàng"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Hủy</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}