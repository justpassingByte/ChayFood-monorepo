'use client';

import React from 'react';
import { Truck, CheckCircle2, Sparkles } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../../store/useCartStore';

interface CartFreeshipProgressProps {
  subtotal: number;
}

export function CartFreeshipProgress({ subtotal }: CartFreeshipProgressProps) {
  const isQualified = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const percentage = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
              isQualified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isQualified ? <CheckCircle2 className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
          </div>
          <div className="text-xs">
            {isQualified ? (
              <span className="font-bold text-emerald-900">
                Đơn hàng của bạn đã đạt điều kiện Miễn phí giao hàng
              </span>
            ) : (
              <span className="text-slate-700">
                Mua thêm{' '}
                <strong className="text-emerald-800 font-extrabold">
                  {remaining.toLocaleString('vi-VN')} đ
                </strong>{' '}
                để được <strong className="text-slate-900">Miễn phí giao hàng</strong>
              </span>
            )}
          </div>
        </div>

        <span className="text-[11px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg shrink-0">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isQualified ? 'bg-emerald-600' : 'bg-gradient-to-r from-emerald-700 to-emerald-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isQualified && (
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mt-2">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Tiết kiệm 25.000 đ chi phí vận chuyển</span>
        </div>
      )}
    </div>
  );
}
