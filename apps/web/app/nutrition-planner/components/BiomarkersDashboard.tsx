'use client'

import React from 'react'
import { BiomarkerResult, HealthProfileForm } from '../types'
import { RotateCcw, Activity, ShieldCheck, Heart } from 'lucide-react'

interface DashboardProps {
  biomarkers: BiomarkerResult
  profile: HealthProfileForm
  onReset: () => void
}

export default function BiomarkersDashboard({ biomarkers, profile, onReset }: DashboardProps) {
  return (
    <div className="food-card p-6 sm:p-8 bg-white shadow-sm border-2 border-emerald-700/80 space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 uppercase tracking-wider">
              Chuẩn Y Khoa
            </span>
            <span className="text-xs font-semibold text-slate-500">Mifflin-St Jeor Equation</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Báo Cáo Phân Tích Chuyển Hóa
          </h2>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Sửa thông tin</span>
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block">Chỉ số khối BMI</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{biomarkers.bmi}</div>
          <span className="text-[10px] font-bold text-emerald-700 mt-0.5 block">{biomarkers.bmiCategory}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block">Chuyển hóa cơ bản BMR</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{biomarkers.bmr}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">kcal / ngày</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block">Tiêu hao năng lượng TDEE</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{biomarkers.tdee}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">kcal / ngày</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-900 block">Mục tiêu nạp hằng ngày</span>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1 font-mono">{biomarkers.targetCalories}</div>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">kcal mục tiêu</span>
        </div>
      </div>

      {/* Macro Split Breakdown */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
        <h4 className="text-xs font-bold text-slate-800">
          Phân Bổ Định Lượng Vi Chất Chuẩn Khẩu Phần
        </h4>

        <div className="macro-progress-track">
          <div className="macro-seg-protein" style={{ width: `${biomarkers.macroPercentages.protein}%` }} />
          <div className="macro-seg-carbs" style={{ width: `${biomarkers.macroPercentages.carbs}%` }} />
          <div className="macro-seg-fat" style={{ width: `${biomarkers.macroPercentages.fat}%` }} />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100">
            <span className="text-[11px] font-bold text-blue-700 block">Đạm Thực Vật ({biomarkers.macroPercentages.protein}%)</span>
            <span className="text-lg font-extrabold text-blue-900 font-mono mt-0.5 block">{biomarkers.targetProteinGrams}g</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-100">
            <span className="text-[11px] font-bold text-amber-700 block">Tinh Bột Chậm ({biomarkers.macroPercentages.carbs}%)</span>
            <span className="text-lg font-extrabold text-amber-900 font-mono mt-0.5 block">{biomarkers.targetCarbsGrams}g</span>
          </div>

          <div className="p-3 rounded-xl bg-pink-50/80 border border-pink-100">
            <span className="text-[11px] font-bold text-pink-700 block">Chất Béo Tốt ({biomarkers.macroPercentages.fat}%)</span>
            <span className="text-lg font-extrabold text-pink-900 font-mono mt-0.5 block">{biomarkers.targetFatGrams}g</span>
          </div>
        </div>
      </div>

      {/* Clinical Advice */}
      {biomarkers.clinicalAdvice && biomarkers.clinicalAdvice.length > 0 && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-teal-950">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Khuyến Nghị Chuyên Sâu</span>
          </div>
          {biomarkers.clinicalAdvice.map((advice, i) => (
            <p key={i} className="leading-relaxed pl-6">• {advice}</p>
          ))}
        </div>
      )}
    </div>
  )
}
