'use client';

import React, { useState } from 'react';
import { Tag, ArrowRight, X, ShieldCheck, Clock, Check, Sparkles } from 'lucide-react';
import { CartVoucher, AVAILABLE_VOUCHERS } from '../../store/useCartStore';
import { toast } from 'react-hot-toast';

interface CartOrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  appliedVoucher: CartVoucher | null;
  deliveryNotes: string;
  onApplyVoucher: (code: string) => { success: boolean; message: string };
  onRemoveVoucher: () => void;
  onSetDeliveryNotes: (notes: string) => void;
  onProceedToCheckout: () => void;
}

export function CartOrderSummary({
  subtotal,
  deliveryFee,
  discountAmount,
  totalAmount,
  appliedVoucher,
  deliveryNotes,
  onApplyVoucher,
  onRemoveVoucher,
  onSetDeliveryNotes,
  onProceedToCheckout,
}: CartOrderSummaryProps) {
  const [voucherInput, setVoucherInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = (codeToApply?: string) => {
    const code = codeToApply || voucherInput;
    if (!code.trim()) {
      toast.error('Vui lòng nhập mã ưu đãi');
      return;
    }

    setIsApplying(true);
    const result = onApplyVoucher(code);
    setIsApplying(false);

    if (result.success) {
      toast.success(result.message);
      setVoucherInput('');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs sticky top-28 space-y-6">
      <div>
        <h3 className="text-lg font-black text-slate-950 tracking-tight">
          Tóm Tắt Đơn Hàng
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Giá đã bao gồm thuế và định lượng chuẩn hóa
        </p>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span>Tạm tính món ăn</span>
          <span className="font-bold text-slate-900">{subtotal.toLocaleString('vi-VN')} đ</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Phí giao hàng</span>
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
          <div className="flex items-center justify-between text-emerald-700 font-bold bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Ưu đãi voucher ({appliedVoucher?.code})</span>
            </div>
            <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
          </div>
        )}

        <div className="flex items-baseline justify-between pt-3 border-t border-slate-200 text-slate-950">
          <div>
            <div className="font-black text-sm">Tổng thanh toán</div>
            <div className="text-[10px] text-slate-400 font-normal">Đã bao gồm VAT</div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-950">
            {totalAmount.toLocaleString('vi-VN')}{' '}
            <span className="text-xs font-bold text-emerald-800">đ</span>
          </div>
        </div>
      </div>

      {/* Voucher Input & Quick Chips */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          Mã ưu đãi ChayFood
        </label>

        {appliedVoucher ? (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <div className="font-black text-emerald-900">{appliedVoucher.code}</div>
                <div className="text-[11px] text-emerald-700 leading-tight">
                  {appliedVoucher.description}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onRemoveVoucher();
                toast.success('Đã hủy áp dụng mã ưu đãi');
              }}
              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
              title="Hủy mã ưu đãi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập mã ưu đãi..."
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 uppercase font-bold"
              />
              <button
                type="button"
                onClick={() => handleApply()}
                disabled={isApplying || !voucherInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-emerald-900 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-40"
              >
                Áp dụng
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {AVAILABLE_VOUCHERS.map((v) => (
                <button
                  key={v.code}
                  type="button"
                  onClick={() => handleApply(v.code)}
                  className="text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  +{v.code}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* General Delivery / Kitchen Notes */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
          Ghi chú giao hàng chung
        </label>
        <textarea
          rows={2}
          placeholder="Ví dụ: Giao trước 12h, gửi lễ tân tòa nhà..."
          value={deliveryNotes}
          onChange={(e) => onSetDeliveryNotes(e.target.value)}
          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 resize-none"
        />
      </div>

      {/* Primary Checkout CTA */}
      <button
        type="button"
        onClick={onProceedToCheckout}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-slate-950 hover:bg-emerald-900 text-white font-black text-sm transition-all shadow-md hover:shadow-lg cursor-pointer group"
      >
        Tiến hành thanh toán
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Trust Badges */}
      <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Giao nóng tận nơi trong 30 - 45 phút</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Bao bì phân hủy sinh học thân thiện môi trường</span>
        </div>
      </div>
    </div>
  );
}
