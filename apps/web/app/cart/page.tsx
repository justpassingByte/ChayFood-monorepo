'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Sparkles, Utensils } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { CartEmptyState } from './components/CartEmptyState';
import { CartFreeshipProgress } from './components/CartFreeshipProgress';
import { CartItemCard } from './components/CartItemCard';
import { CartMacroOverview } from './components/CartMacroOverview';
import { CartOrderSummary } from './components/CartOrderSummary';

export default function CartPage() {
  const router = useRouter();
  const store = useCartStore();

  const totalItems = store.getTotalItems();
  const subtotal = store.getSubtotal();
  const deliveryFee = store.getDeliveryFee();
  const discountAmount = store.getDiscountAmount();
  const totalAmount = store.getTotalAmount();
  const macros = store.getMacros();

  if (store.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFBF9] pb-20">
        <CartEmptyState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBF9] pb-24">
      {/* 1. Compact Editorial Header (RULE-UI-005) */}
      <div className="bg-white border-b border-slate-200/80 mb-6 py-4 sm:py-5">
        <div className="container-custom max-w-6xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/menu" className="hover:text-emerald-800 flex items-center gap-1 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                Tiếp tục chọn món
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-bold">Giỏ hàng</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Giỏ Hàng Của Bạn
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80">
              {totalItems} khẩu phần ăn
            </span>

            <button
              type="button"
              onClick={store.clearCart}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa tất cả
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Cart Layout (2 Columns on Desktop) */}
      <div className="container-custom max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Freeship Progress, Items List & Macro Overview */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Free Shipping Threshold Progress */}
            <CartFreeshipProgress subtotal={subtotal} />

            {/* Cart Items List */}
            <div className="space-y-3.5">
              {store.items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onIncrease={store.increaseQuantity}
                  onDecrease={store.decreaseQuantity}
                  onRemove={store.removeItem}
                />
              ))}
            </div>

            {/* Macro Nutrition Summary for Whole Meal */}
            <CartMacroOverview macros={macros} totalDishesCount={totalItems} />
          </div>

          {/* Right Column: Sticky Order Summary & Voucher */}
          <div className="lg:col-span-5 xl:col-span-4">
            <CartOrderSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              discountAmount={discountAmount}
              totalAmount={totalAmount}
              appliedVoucher={store.appliedVoucher}
              deliveryNotes={store.deliveryNotes}
              onApplyVoucher={store.applyVoucher}
              onRemoveVoucher={store.removeVoucher}
              onSetDeliveryNotes={store.setDeliveryNotes}
              onProceedToCheckout={() => router.push('/checkout')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}