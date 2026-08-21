'use client';

import React from 'react';
import { QrCode, Banknote, CreditCard, Check, ShieldCheck, Sparkles } from 'lucide-react';

export type PaymentMethod = 'banking' | 'cod' | 'stripe';

interface CheckoutPaymentSectionProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

export function CheckoutPaymentSection({
  selectedMethod,
  onSelectMethod,
}: CheckoutPaymentSectionProps) {
  const paymentOptions: Array<{
    id: PaymentMethod;
    title: string;
    description: string;
    badge?: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'banking',
      title: 'Chuyển khoản VietQR tức thì',
      description: 'Quét mã QR tự động xác nhận trong 10 giây qua 40+ app ngân hàng, không phí trung gian',
      badge: 'Khuyên dùng',
      icon: <QrCode className="w-5 h-5 text-emerald-700" />,
    },
    {
      id: 'cod',
      title: 'Tiền mặt khi nhận hàng (COD)',
      description: 'Thanh toán trực tiếp cho tài xế khi nhận món ăn nóng hổi, kiểm tra món trước khi nhận',
      icon: <Banknote className="w-5 h-5 text-slate-700" />,
    },
    {
      id: 'stripe',
      title: 'Thẻ quốc tế (Visa, Mastercard, JCB)',
      description: 'Thanh toán qua cổng bảo mật Stripe chuẩn PCI-DSS Level 1, mã hóa SSL 256-bit',
      badge: 'Stripe Secure',
      icon: <CreditCard className="w-5 h-5 text-blue-700" />,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-xs border border-emerald-200/80">
          2
        </div>
        <div>
          <h2 className="text-base font-black text-slate-950 tracking-tight">
            Phương Thức Thanh Toán
          </h2>
          <p className="text-[11px] text-slate-500">
            Lựa chọn hình thức thanh toán an toàn và tiện lợi
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {paymentOptions.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onSelectMethod(opt.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100/80 border border-slate-200/80 shrink-0">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-950">
                        {opt.title}
                      </span>
                      {opt.badge && (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-lg">
                      {opt.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 font-medium border-t border-slate-100">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Giao dịch được mã hóa an toàn và bảo mật thông tin tuyệt đối</span>
      </div>
    </div>
  );
}
