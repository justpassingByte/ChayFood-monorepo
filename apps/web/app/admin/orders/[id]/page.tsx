'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Truck,
  Check,
  XCircle,
  CreditCard,
  User as UserIcon,
  MapPin,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { orderService, Order } from '@/services/orderService';
import { OrderStatusTimeline } from '@/order/components/OrderStatusTimeline';
import {
  OrderStatus,
  getNextStatuses,
  TRANSITION_ACTION_LABELS,
  ORDER_STATUS_LABELS,
} from '@chayfood/shared-types';

const ACTION_ICONS: Partial<Record<OrderStatus, React.ComponentType<{ className?: string }>>> = {
  PREPARING: ChefHat,
  READY: PackageCheck,
  DELIVERING: Truck,
  DELIVERED: Check,
  CANCELLED: XCircle,
  CONFIRMED: CheckCircle2,
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getById(id);
      if (data) {
        setOrder(data);
      } else {
        setError('Không tìm thấy thông tin đơn hàng');
      }
    } catch {
      setError('Lỗi khi tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id, fetchOrder]);

  const handleTransition = async (nextStatus: OrderStatus) => {
    const actionLabel = TRANSITION_ACTION_LABELS[nextStatus] || nextStatus;
    if (!window.confirm(`Xác nhận thực hiện "${actionLabel}" cho đơn hàng này?`)) return;

    try {
      setUpdating(true);
      await orderService.updateStatus(id, nextStatus);
      toast.success(`Đã chuyển trạng thái sang "${ORDER_STATUS_LABELS[nextStatus]}"`);
      await fetchOrder();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái';
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        <p className="text-xs text-slate-400 font-mono">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-8 text-center space-y-4 max-w-xl mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-base font-bold text-white">{error || 'Không tìm thấy đơn'}</h2>
        <Link
          href="/admin/orders"
          className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold"
        >
          Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  const normStatus = order.status.toUpperCase() as OrderStatus;
  const nextAllowedStatuses = getNextStatuses(normStatus);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white border border-slate-800 transition"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                Đơn Hàng #{order.orderNumber}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {ORDER_STATUS_LABELS[normStatus] || normStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>

        {/* State Machine Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {nextAllowedStatuses.length === 0 ? (
            <span className="text-xs text-slate-500 font-mono py-1 px-3 bg-slate-900 border border-slate-800 rounded-xl">
              Đã hoàn tất vòng đời
            </span>
          ) : (
            nextAllowedStatuses.map((st) => {
              const isCancel = st === 'CANCELLED';
              const label = TRANSITION_ACTION_LABELS[st] || st;
              const Icon = ACTION_ICONS[st] || Check;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleTransition(st)}
                  disabled={updating}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                    isCancel
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline & Items */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-5">
            <OrderStatusTimeline
              currentStatus={order.status}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
            />
          </div>

          {/* Items Table */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-semibold text-white tracking-wide">
              Danh Sách Món Ăn ({order.items.length})
            </h3>

            <div className="divide-y divide-slate-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                      {item.menuItem?.image ? (
                        <Image
                          src={item.menuItem.image}
                          alt={item.menuItem.name || 'Món chay'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold">
                          Chay
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-200">
                        {item.menuItem?.name || 'Món chay'}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {Number(item.price).toLocaleString('vi-VN')}₫ × {item.quantity}
                      </p>
                      {item.specialInstructions && (
                        <p className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded mt-1 inline-block">
                          Ghi chú: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                    {(Number(item.price) * item.quantity).toLocaleString('vi-VN')}₫
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-semibold text-sm text-slate-200">
              <span>Tổng Tiền Đơn Hàng</span>
              <span className="text-emerald-400 font-mono font-bold text-base">
                {Number(order.totalAmount).toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Payment Cards */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <UserIcon className="w-4 h-4 text-emerald-400" />
              <h3>Thông Tin Khách Hàng</h3>
            </div>
            <div className="text-xs text-slate-300 space-y-1.5">
              <p>
                <strong className="text-white font-semibold">{order.user?.name || 'Khách vãng lai'}</strong>
              </p>
              <p>Email: {order.user?.email || '—'}</p>
              <p>SĐT: {order.user?.phone || '—'}</p>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h3>Địa Chỉ Giao Hàng</h3>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-white">{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}</p>
              {order.deliveryAddress.additionalInfo && (
                <p className="text-slate-400 mt-1 pt-1 border-t border-slate-800">
                  Ghi chú: {order.deliveryAddress.additionalInfo}
                </p>
              )}
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h3>Thông Tin Thanh Toán</h3>
            </div>
            <div className="text-xs text-slate-300 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Phương thức</span>
                <span className="font-semibold text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Trạng thái TT</span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : order.paymentStatus === 'FAILED'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {order.paymentTransactions && order.paymentTransactions.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 block mb-1">Giao dịch gần nhất:</span>
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-0.5">
                    <p>Provider: {order.paymentTransactions[0].provider}</p>
                    <p>TxID: {order.paymentTransactions[0].providerTxId || '—'}</p>
                    <p>Status: {order.paymentTransactions[0].status}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
