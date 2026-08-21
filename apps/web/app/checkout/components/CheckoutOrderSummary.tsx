'use client';

import React from 'react';
import Image from 'next/image';
import { CartLineItem, CartVoucher } from '../../store/useCartStore';
import { Flame, ShieldCheck, Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface CheckoutOrderSummaryProps {
  items: CartLineItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  appliedVoucher: CartVoucher | null;
  macros: { calories: number; protein: number };
  isSubmitting: boolean;
  onSubmitOrder: () => void;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  deliveryFee,
  discountAmount,
  totalAmount,
  appliedVoucher,
  macros,
  isSubmitting,
  onSubmitOrder,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs sticky top-20 space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-950 tracking-tight">
            Đơn Hàng Của Bạn
          </h3>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/80">
            {items.reduce((s, it) => s + it.quantity, 0)} phần
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Danh sách món ăn được chuẩn bị tươi mới trong ngày
        </p>
      </div>

      {/* Dish Items Mini List */}
      <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2">
        {items.map((it) => {
          const dish = it.menuItem;
          const lineTotal = (dish.price || 0) * it.quantity;
          return (
            <div key={it.id} className="pt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                  <Image
                    src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                    alt={dish.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-950 truncate">{dish.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {it.portionName ? `${it.portionName} • ` : ''}Số lượng: {it.quantity}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-black text-xs text-slate-950">
                  {lineTotal.toLocaleString('vi-VN')} đ
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Macro Nutrition Summary */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs">
        <div className="flex items-center gap-1.5 text-amber-800 font-bold">
          <Flame className="w-4 h-4 text-amber-600" />
          <span>Tổng dinh dưỡng</span>
        </div>
        <span className="font-black text-slate-900">
          {macros.calories} kcal • {macros.protein.toFixed(1)}g Đạm
        </span>
      </div>

      {/* Financial Details */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span>Tạm tính</span>
          <span className="font-bold text-slate-900">{subtotal.toLocaleString('vi-VN')} đ</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Phí vận chuyển</span>
          <span>
            {deliveryFee === 0 ? (
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                Miễn phí
              </span>
            ) : (
              <span className="font-bold text-slate-900">{deliveryFee.toLocaleString('vi-VN')} đ</span>
            )}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-700 font-bold bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/80">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ưu đãi ({appliedVoucher?.code})</span>
            </div>
            <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
          </div>
        )}

        <div className="flex items-baseline justify-between pt-3 border-t border-slate-200 text-slate-950">
          <div>
            <div className="font-black text-sm">Tổng thanh toán</div>
            <div className="text-[10px] text-slate-400 font-normal">Đã gồm VAT & phí giao</div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-950">
            {totalAmount.toLocaleString('vi-VN')}{' '}
            <span className="text-xs font-bold text-emerald-800">đ</span>
          </div>
        </div>
      </div>

      {/* Primary Submit Button */}
      <button
        type="button"
        onClick={onSubmitOrder}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-slate-950 hover:bg-emerald-900 text-white font-black text-sm transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang xử lý đơn hàng...</span>
          </>
        ) : (
          <>
            <span>Xác nhận đặt hàng</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {/* Reassurance Badges */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Giao nóng đúng giờ • Hoàn tiền nếu không hài lòng</span>
      </div>
    </div>
  );
}
