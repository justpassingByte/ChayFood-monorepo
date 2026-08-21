'use client';

import React from 'react';
import { Flame, Sparkles, Activity, ShieldCheck } from 'lucide-react';

interface CartMacroOverviewProps {
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  totalDishesCount: number;
}

export function CartMacroOverview({ macros, totalDishesCount }: CartMacroOverviewProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs mt-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <Activity className="w-3 h-3" />
            Minh Bạch Chỉ Số
          </span>
          <h3 className="text-base font-black text-slate-950 tracking-tight mt-1.5">
            Tổng Dinh Dưỡng Bữa Ăn ({totalDishesCount} phần)
          </h3>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50/60 px-3 py-1 rounded-xl border border-emerald-100">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Khoa học thực vật</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Calories */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-700 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Flame className="w-3 h-3" />
            Năng lượng
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-950">
            {macros.calories}{' '}
            <span className="text-xs font-bold text-slate-500">kcal</span>
          </div>
        </div>

        {/* Protein */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            Đạm thực vật
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-950">
            {macros.protein.toFixed(1)}{' '}
            <span className="text-xs font-bold text-slate-500">g</span>
          </div>
        </div>

        {/* Carbs */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
            Tinh bột chậm
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900">
            {macros.carbs.toFixed(1)}{' '}
            <span className="text-xs font-bold text-slate-500">g</span>
          </div>
        </div>

        {/* Fat */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
          <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
            Chất béo lành
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900">
            {macros.fat.toFixed(1)}{' '}
            <span className="text-xs font-bold text-slate-500">g</span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed mt-3 text-center sm:text-left">
        Khẩu phần giàu chất xơ và đạm thực vật từ đậu nành hữu cơ, nấm sạch và các loại hạt dinh dưỡng
      </p>
    </div>
  );
}
