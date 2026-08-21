'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  QrCode,
  RotateCcw,
  MapPin,
  Phone,
  User,
  CreditCard,
  Truck,
  ShieldCheck,
  Headphones,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { orderService, Order, OrderItem } from '../../services/orderService';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline';
import { VietQRPaymentView } from '../../checkout/payment/[orderId]/components/VietQRPaymentView';
import { ORDER_STATUS_LABELS, OrderStatus } from '@chayfood/shared-types';
import { useCartStore } from '../../store/useCartStore';
import { MenuItem } from '../../lib/services/types';

const statusBadgeStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-900 border-amber-300 ring-4 ring-amber-50/50',
  CONFIRMED: 'bg-blue-50 text-blue-900 border-blue-300 ring-4 ring-blue-50/50',
  PREPARING: 'bg-purple-50 text-purple-900 border-purple-300 ring-4 ring-purple-50/50',
  READY: 'bg-indigo-50 text-indigo-900 border-indigo-300 ring-4 ring-indigo-50/50',
  DELIVERING: 'bg-cyan-50 text-cyan-900 border-cyan-300 ring-4 ring-cyan-50/50',
  DELIVERED: 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-4 ring-emerald-50/50',
  CANCELLED: 'bg-red-50 text-red-900 border-red-300 ring-4 ring-red-50/50',
};

const paymentBadgeStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-900 border border-amber-200',
  PAID: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
  FAILED: 'bg-red-100 text-red-900 border border-red-200',
};

const paymentMethodLabels: Record<string, string> = {
  BANKING: 'Chuyển khoản VietQR',
  COD: 'Thanh toán khi nhận hàng (COD)',
  CARD: 'Thẻ thanh toán quốc tế (Stripe)',
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const cartStore = useCartStore();

  const fetchOrderDetails = useCallback(async () => {
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
      setError('Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id, fetchOrderDetails]);

  // Hủy đơn hàng (User chỉ được hủy khi PENDING)
  const handleCancelOrder = async () => {
    if (!order || !id) return;
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

    try {
      setActionLoading(true);
      await orderService.cancel(id);
      toast.success('Đã hủy đơn hàng');
      await fetchOrderDetails();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể hủy đơn hàng';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Xác nhận đã nhận món (User chỉ được xác nhận khi DELIVERING)
  const handleMarkReceived = async () => {
    if (!order || !id) return;
    if (!window.confirm('Xác nhận bạn đã nhận được món ăn tươi ngon?')) return;

    try {
      setActionLoading(true);
      await orderService.markAsReceived(id);
      toast.success('Cảm ơn bạn đã xác nhận nhận hàng');
      await fetchOrderDetails();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Mua lại đơn này (Reorder)
  const handleReorder = () => {
    if (!order) return;
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
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(d);
    } catch {
      return isoString;
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Đang tải thông tin đơn hàng...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Không Tìm Thấy Đơn Hàng</h1>
          <p className="text-xs text-slate-500">{error || 'Vui lòng kiểm tra lại đường dẫn'}</p>
          <Link
            href="/account/orders"
            className="inline-block px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition"
          >
            Về Danh Sách Đơn Hàng
          </Link>
        </div>
      </div>
    );
  }

  const normStatus = order.status.toUpperCase() as OrderStatus;
  const normPayment = order.paymentStatus.toUpperCase();
  const isPending = normStatus === 'PENDING';
  const isDelivering = normStatus === 'DELIVERING';
  const isDelivered = normStatus === 'DELIVERED';
  const needsVietQRPayment = isPending && order.paymentMethod === 'BANKING' && normPayment === 'PENDING';

  return (
    <div className="min-h-screen bg-[#FAFBF9] pb-24">
      {/* 1. Header with Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80 mb-6 py-5">
        <div className="container-custom max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <Link href="/" className="hover:text-emerald-800 font-medium">
              Trang chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link href="/account/orders" className="hover:text-emerald-800 font-medium">
              Lịch sử đơn hàng
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-bold">#{order.orderNumber}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/account/orders"
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 transition"
                title="Quay lại danh sách"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                    Đơn Hàng #{order.orderNumber}
                  </h1>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                      statusBadgeStyles[normStatus] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ORDER_STATUS_LABELS[normStatus] || normStatus}
                  </span>
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-black ${
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
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Đặt lúc: {formatDate(order.createdAt)}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReorder}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition border border-emerald-200/80 shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt Lại Đơn Này</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="container-custom max-w-6xl space-y-6">
        {/* If user needs to pay via VietQR */}
        {needsVietQRPayment && (
          <div className="animate-fadeIn">
            <VietQRPaymentView
              orderId={order.id}
              orderNumber={order.orderNumber}
              sequenceNumber={order.sequenceNumber || 1}
              totalAmount={Number(order.totalAmount)}
              createdAt={order.createdAt}
              onPaymentSuccess={fetchOrderDetails}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Visual Timeline & Items Breakdown */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Timeline Stepper */}
            <OrderStatusTimeline
              currentStatus={order.status}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
            />

            {/* Items Breakdown Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-950 tracking-tight">
                      Món Ăn Đã Đặt ({order.items.length})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Chế biến tươi trong ngày theo tiêu chuẩn thuần thực vật
                    </p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {order.items.map((item: OrderItem, idx: number) => {
                  const itemTotal = Number(item.price) * item.quantity;
                  return (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 shadow-2xs">
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

                        <div className="space-y-0.5">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {item.menuItem?.name || 'Món chay tươi ngon'}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <span>Đơn giá: {formatCurrency(Number(item.price))}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-700">SL: {item.quantity}</span>
                          </div>
                          {item.specialInstructions && (
                            <p className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-1">
                              Ghi chú: {item.specialInstructions}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-xs sm:text-sm font-black text-slate-950 shrink-0 font-mono">
                        {formatCurrency(itemTotal)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Pricing Summary */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Tạm tính món ăn</span>
                  <span className="font-bold text-slate-700">
                    {formatCurrency(Number(order.totalAmount))}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Phí giao hàng tận nơi</span>
                  <span className="font-bold text-emerald-700">Miễn phí giao hàng</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-black text-sm text-slate-950">
                  <span>Tổng Thanh Toán</span>
                  <span className="text-emerald-700 font-black text-lg sm:text-xl font-mono">
                    {formatCurrency(Number(order.totalAmount))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Delivery & Customer Info & Context Actions */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Delivery Address & Customer Info */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-950">Địa Chỉ Nhận Món</h3>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                {order.user && (
                  <div className="flex items-start gap-2.5">
                    <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">{order.user.name}</span>
                      <span className="text-slate-400 text-[11px]">{order.user.email}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold text-slate-900 block">
                      {order.deliveryAddress.street}
                    </span>
                    <span className="text-slate-500">{order.deliveryAddress.city}</span>
                  </div>
                </div>

                {order.deliveryAddress.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-bold text-slate-900">{order.deliveryAddress.phone}</span>
                  </div>
                )}

                {order.deliveryAddress.additionalInfo && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
                    <strong className="text-slate-900">Ghi chú giao hàng:</strong>{' '}
                    {order.deliveryAddress.additionalInfo}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-950">Hình Thức Thanh Toán</h3>
              </div>

              <div className="text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Phương thức:</span>
                  <span className="font-bold text-slate-900">
                    {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Trạng thái:</span>
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
            </div>

            {/* Context-Aware Action Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-black text-slate-950">Thao Tác Đơn Hàng</h3>

              {isPending && (
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={actionLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>Hủy Đơn Hàng Này</span>
                </button>
              )}

              {isDelivering && (
                <button
                  type="button"
                  onClick={handleMarkReceived}
                  disabled={actionLoading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Đã Nhận Được Món Ăn</span>
                </button>
              )}

              {isDelivered && (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-medium">
                    Đơn hàng đã được giao thành công. Chúc bạn ngon miệng!
                  </div>
                  <button
                    type="button"
                    onClick={handleReorder}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Đặt Lại Đơn Này</span>
                  </button>
                </div>
              )}

              {normStatus === 'CANCELLED' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center text-xs text-red-700 font-medium">
                  Đơn hàng đã hủy
                </div>
              )}
            </div>

            {/* Customer Support Card */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-5 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Headphones className="w-4 h-4 text-emerald-700" />
                <span>Cần Hỗ Trợ Đơn Hàng?</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Đội ngũ chăm sóc khách hàng ChayFood sẵn sàng hỗ trợ bạn qua Hotline <strong>1900 6868</strong> hoặc kênh Zalo Official.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}