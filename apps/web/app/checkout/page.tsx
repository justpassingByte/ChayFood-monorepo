'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';
import { userService } from '../lib/services/userService';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { formatApiErrorMessage } from '../lib/utils/formatError';
import { CreateOrderSchema } from '@chayfood/shared-types';
import {
  CheckoutAddressSection,
  AddressFormData,
  SavedAddress,
} from './components/CheckoutAddressSection';
import {
  CheckoutPaymentSection,
  PaymentMethod,
} from './components/CheckoutPaymentSection';
import { CheckoutDeliveryNotesSection } from './components/CheckoutDeliveryNotesSection';
import { CheckoutOrderSummary } from './components/CheckoutOrderSummary';

export default function CheckoutPage() {
  const router = useRouter();
  const store = useCartStore();
  const { user, isAuthenticated } = useAuth();

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isUsingCustomAddress, setIsUsingCustomAddress] = useState<boolean>(false);
  const [customAddress, setCustomAddress] = useState<AddressFormData>({
    recipientName: '',
    phone: '',
    street: '',
    city: 'TP. Hồ Chí Minh',
    additionalInfo: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('banking');
  const [deliveryTimeType, setDeliveryTimeType] = useState<'asap' | 'lunch' | 'dinner'>('asap');
  const [kitchenNotes, setKitchenNotes] = useState<string>(store.deliveryNotes || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 1. Redirect to /cart if cart is empty
  useEffect(() => {
    if (store.items.length === 0) {
      router.push('/cart');
    }
  }, [store.items.length, router]);

  // 2. Fetch saved addresses if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const loadAddresses = async () => {
        try {
          let addrs: SavedAddress[] = [];
          try {
            const res = await userService.getAddresses();
            if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
              addrs = res.data;
            }
          } catch {
            // fallback
          }

          if (addrs.length === 0) {
            try {
              const profileRes = await userService.getProfile();
              if (profileRes.status === 'success' && profileRes.data?.addresses) {
                addrs = profileRes.data.addresses;
              }
            } catch {
              // fallback
            }
          }

          if (addrs.length > 0) {
            setSavedAddresses(addrs);
            const def = addrs.find((a) => a.isDefault) || addrs[0];
            setSelectedAddressId(def._id);
            setIsUsingCustomAddress(false);
          } else {
            setIsUsingCustomAddress(true);
          }
        } catch {
          setIsUsingCustomAddress(true);
        }
      };

      loadAddresses();
    } else {
      setIsUsingCustomAddress(true);
    }
  }, [isAuthenticated]);

  // 3. Prepopulate custom address name/phone with user info if available
  useEffect(() => {
    if (user) {
      setCustomAddress((prev) => ({
        ...prev,
        recipientName: prev.recipientName || user.name || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // 4. Handle Order Submission
  const handleSubmitOrder = async () => {
    // Determine address payload
    let deliveryAddress: {
      street: string;
      city: string;
      state?: string;
      postalCode?: string;
      additionalInfo?: string;
    };

    if (isUsingCustomAddress || savedAddresses.length === 0) {
      if (!customAddress.recipientName.trim()) {
        toast.error('Vui lòng nhập tên người nhận');
        return;
      }
      if (!customAddress.phone.trim()) {
        toast.error('Vui lòng nhập số điện thoại nhận hàng');
        return;
      }
      if (!customAddress.street.trim()) {
        toast.error('Vui lòng nhập địa chỉ số nhà, tên đường');
        return;
      }

      deliveryAddress = {
        street: customAddress.street,
        city: customAddress.city,
        state: 'Việt Nam',
        postalCode: '70000',
        additionalInfo: `${customAddress.recipientName} (${customAddress.phone}) ${customAddress.additionalInfo ? '- ' + customAddress.additionalInfo : ''}`.trim(),
      };
    } else {
      const found = savedAddresses.find((a) => a._id === selectedAddressId);
      if (!found) {
        toast.error('Vui lòng chọn địa chỉ giao hàng');
        return;
      }
      deliveryAddress = {
        street: found.street,
        city: found.city,
        state: found.state || 'Việt Nam',
        postalCode: found.postalCode || '70000',
        additionalInfo: found.additionalInfo,
      };
    }

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để tiến hành thanh toán đơn hàng');
      router.push('/auth');
      return;
    }

    if (store.items.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống. Vui lòng chọn món trước');
      return;
    }

    const orderItems = store.items.map((it) => {
      const dish = it.menuItem;
      let dishId = String(dish?.id || dish?._id || '').trim();

      // Fallback extraction from lineId if needed
      if (!dishId && it.id && it.id.includes('-')) {
        const parts = it.id.split('-');
        const candidate = parts.slice(0, -2).join('-');
        if (candidate && candidate !== 'dish') {
          dishId = candidate;
        }
      }

      return {
        menuItemId: dishId,
        dishName: dish?.name || 'Món chay',
        quantity: it.quantity,
        price: dish?.price || 0,
        specialInstructions: it.specialInstructions || '',
      };
    });

    // Check if any cart item has missing ID
    const invalidItem = orderItems.find((it) => !it.menuItemId);
    if (invalidItem) {
      toast.error(`Món "${invalidItem.dishName}" thiếu mã sản phẩm. Vui lòng vào thực đơn chọn lại món`);
      return;
    }

    const finalNotes = [
      deliveryTimeType === 'lunch'
        ? '[Khung giờ: Bữa trưa 11:00-12:00]'
        : deliveryTimeType === 'dinner'
        ? '[Khung giờ: Bữa tối 17:30-18:30]'
        : '[Giao ngay]',
      kitchenNotes,
    ]
      .filter(Boolean)
      .join(' ');

    const backendPaymentMethod: 'COD' | 'CARD' | 'BANKING' =
      paymentMethod === 'banking' ? 'BANKING' : paymentMethod === 'stripe' ? 'CARD' : 'COD';

    // 5. Pre-validate payload with SSOT Zod Schema
    const orderPayload = {
      items: orderItems.map((it) => ({
        menuItemId: it.menuItemId,
        quantity: it.quantity,
        specialInstructions: it.specialInstructions || undefined,
      })),
      deliveryAddress,
      paymentMethod: backendPaymentMethod,
      specialInstructions: finalNotes || undefined,
    };

    const validation = CreateOrderSchema.safeParse(orderPayload);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      toast.error(firstIssue?.message || 'Thông tin đặt hàng không hợp lệ');
      return;
    }

    setIsSubmitting(true);

    try {
      // Branch 1: Stripe Payment Strategy
      if (paymentMethod === 'stripe') {
        const res = await paymentService.createCheckoutSessionWithCart({
          items: orderItems,
          deliveryAddress,
          paymentMethod: 'stripe',
          specialInstructions: finalNotes,
          user: user ? { _id: user._id, email: user.email, name: user.name } : undefined,
        });

        if (res.status === 'success' && res.url) {
          store.clearCart();
          window.location.href = res.url;
          return;
        } else {
          toast.error(res.message || 'Không thể khởi tạo cổng thanh toán Stripe');
          setIsSubmitting(false);
          return;
        }
      }

      // Branch 2 & 3: VietQR Banking & COD
      const orderRes = await orderService.create(orderPayload);

      if (orderRes.status === 'success' && orderRes.data) {
        const createdOrder = orderRes.data;
        const orderId = createdOrder._id || createdOrder.id || 'ORDER_' + Date.now();

        store.clearCart();

        if (paymentMethod === 'banking') {
          toast.success('Đã tạo đơn hàng! Vui lòng quét mã VietQR để hoàn tất');
          router.push(`/checkout/payment/${orderId}`);
        } else {
          toast.success('Đặt hàng thành công! Món chay đang được chuẩn bị');
          router.push(`/order/success?orderId=${orderId}`);
        }
      } else {
        const errMsg = orderRes.message || 'Không thể tạo đơn hàng. Vui lòng thử lại sau';
        toast.error(errMsg);
      }
    } catch (err: unknown) {
      const msg = formatApiErrorMessage(err, 'Không thể xử lý đơn hàng. Vui lòng thử lại');
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const macros = store.getMacros();

  return (
    <div className="min-h-screen bg-[#FAFBF9] pb-24">
      {/* 1. Compact Editorial Subpage Header (RULE-UI-005) */}
      <div className="bg-white border-b border-slate-200/80 mb-6 py-4 sm:py-5">
        <div className="container-custom max-w-6xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/cart" className="hover:text-emerald-800 flex items-center gap-1 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                Quay lại giỏ hàng
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-bold">Thanh toán</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Xác Nhận & Thanh Toán
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Thanh toán bảo mật & tiện lợi</span>
          </div>
        </div>
      </div>

      {/* 2. Main Checkout Layout (2 Columns on Desktop) */}
      <div className="container-custom max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Address, Payment Method, Delivery Timing */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <CheckoutAddressSection
              savedAddresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              onSelectSavedAddress={setSelectedAddressId}
              customAddress={customAddress}
              onChangeCustomAddress={setCustomAddress}
              isUsingCustomAddress={isUsingCustomAddress}
              onToggleCustomAddress={setIsUsingCustomAddress}
            />

            <CheckoutPaymentSection
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />

            <CheckoutDeliveryNotesSection
              deliveryTimeType={deliveryTimeType}
              onSelectTimeType={setDeliveryTimeType}
              kitchenNotes={kitchenNotes}
              onChangeKitchenNotes={setKitchenNotes}
            />
          </div>

          {/* Right Column: Order Summary & Place Order Button */}
          <div className="lg:col-span-5 xl:col-span-4">
            <CheckoutOrderSummary
              items={store.items}
              subtotal={store.getSubtotal()}
              deliveryFee={store.getDeliveryFee()}
              discountAmount={store.getDiscountAmount()}
              totalAmount={store.getTotalAmount()}
              appliedVoucher={store.appliedVoucher}
              macros={{
                calories: macros.calories,
                protein: macros.protein,
              }}
              isSubmitting={isSubmitting}
              onSubmitOrder={handleSubmitOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}