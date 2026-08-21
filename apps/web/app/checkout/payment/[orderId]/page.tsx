'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { orderService, Order } from '../../../services/orderService';
import { VietQRPaymentView } from './components/VietQRPaymentView';

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await orderService.getById(orderId);

        if (!data) {
          setError('Không tìm thấy thông tin đơn hàng');
          return;
        }

        if (data.paymentStatus === 'PAID') {
          toast.success('Đơn hàng này đã được thanh toán');
          router.push(`/order/success?orderId=${orderId}`);
          return;
        }

        setOrder(data);
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải thông tin đơn hàng');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, router]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-slate-600">Đang chuẩn bị mã thanh toán VietQR...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Không Thể Tải Đơn Hàng</h1>
          <p className="text-xs text-slate-500">{error || 'Vui lòng kiểm tra lại đường dẫn'}</p>
          <Link
            href="/cart"
            className="inline-block px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition"
          >
            Quay Lại Giỏ Hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBF9] pb-24">
      {/* Compact Editorial Subpage Header */}
      <div className="bg-white border-b border-slate-200/80 mb-8 py-4 sm:py-5">
        <div className="container-custom max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/order/${orderId}`}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition"
              title="Xem chi tiết đơn hàng"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Thanh Toán Đơn Hàng
              </h1>
              <p className="text-[11px] text-slate-500">Mã đơn: #{order.orderNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom max-w-4xl">
        <VietQRPaymentView
          orderId={order.id}
          orderNumber={order.orderNumber}
          sequenceNumber={order.sequenceNumber || 1}
          totalAmount={Number(order.totalAmount)}
          createdAt={order.createdAt}
          onPaymentSuccess={() => router.push(`/order/success?orderId=${order.id}`)}
        />
      </div>
    </div>
  );
}