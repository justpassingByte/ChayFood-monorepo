'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export function CartEmptyState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-5 border border-emerald-100/80 shadow-2xs">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3">
          <Sparkles className="w-3 h-3" />
          Ẩm Thực Thực Vật Tươi Lành
        </span>

        <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mb-2">
          Giỏ Hàng Chưa Có Món Ăn
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-8">
          Khám phá thực đơn chay đa dạng với các món ăn cân bằng dinh dưỡng, chế biến từ nông sản hữu cơ tươi mới trong ngày
        </p>

        <div className="space-y-3">
          <Link
            href="/menu"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-slate-950 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer group"
          >
            Khám phá thực đơn
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/nutrition-planner"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Tạo thực đơn cá nhân hóa cùng AI
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Cam kết rau củ hữu cơ chuẩn VietGAP & GlobalGAP</span>
        </div>
      </div>
    </div>
  );
}
