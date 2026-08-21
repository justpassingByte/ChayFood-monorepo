'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Home, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { orderService, Order } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';
import CartToast from '../../components/cart-toast';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('session_id');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { clearCart, message, hasMessage, dismissMessage } = useCart();
  const clearedRef = useRef(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId && !sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        let data = null;
        if (orderId) {
          data = await orderService.getById(orderId);
        }
        if (data) {
          setOrder(data);
          if (!clearedRef.current) {
            await clearCart();
            clearedRef.current = true;
          }
        } else {
          throw new Error('Không thể tải thông tin đơn hàng');
        }
      } catch (error: unknown) {
        console.error('Error fetching order:', error);
        setError(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải thông tin đơn hàng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, sessionId, clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-slate-600">Đang kiểm tra kết quả thanh toán...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/')} className="bg-green-600 hover:bg-green-700">
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-slate-200 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>

        <h1 className="text-2xl font-black text-slate-950 mb-2 tracking-tight">
          Đặt Hàng Thành Công
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Cảm ơn bạn đã lựa chọn món chay thanh lành tại ChayFood
        </p>

        {order && (
          <div className="mb-6 text-left">
            <div className="bg-slate-50 p-4 rounded-2xl border mb-4 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-slate-900">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trạng thái đơn:</span>
                <span className="font-bold text-emerald-700">
                  {order.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Đang xử lý'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Thanh toán:</span>
                <span className="font-bold text-emerald-700">
                  {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t">
                <span className="text-slate-500 font-bold">Tổng tiền:</span>
                <span className="font-black text-slate-950 text-sm">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    Number(order.totalAmount),
                  )}
                </span>
              </div>
            </div>

            <div className="border-t border-b py-3 space-y-2 mb-4 text-xs">
              <h3 className="font-bold text-slate-900 mb-2">Món ăn đã đặt</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.menuItem?.name || 'Món chay'}
                  </span>
                  <span className="font-bold">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      Number(item.price) * item.quantity,
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border text-xs">
              <h3 className="font-bold text-slate-900 mb-1">Địa chỉ giao hàng</h3>
              <p className="text-slate-600">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}
                {order.deliveryAddress.additionalInfo && ` (${order.deliveryAddress.additionalInfo})`}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {order && (
            <Link
              href={`/order/${order.id}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <span>Xem Tiến Trình Đơn Hàng</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Tiếp Tục Chọn Món</span>
          </Link>
        </div>
      </div>
      {/* Cart clear notification */}
      {hasMessage && message && (
        <CartToast message={message} isError={false} onDismiss={dismissMessage} duration={4000} />
      )}
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
} 