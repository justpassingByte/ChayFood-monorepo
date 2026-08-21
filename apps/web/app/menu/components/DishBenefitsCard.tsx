"use client"

import React from "react"
import { ShieldCheck, Flame, Dumbbell, HeartPulse, Sparkles, Leaf, CheckCircle2 } from "lucide-react"

interface DishBenefitsCardProps {
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients?: string[]
  tags?: string[]
}

export function DishBenefitsCard({
  calories,
  protein,
  carbs,
  fat,
  ingredients = [],
  tags = [],
}: DishBenefitsCardProps) {
  return (
    <div className="space-y-6">
      {/* 1. 4 Key Macro Nutritional Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Năng lượng
            </span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {calories} <span className="text-xs font-semibold text-slate-500">kcal</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Khẩu phần chuẩn</div>
        </div>

        <div className="bg-white border border-emerald-200/90 rounded-2xl p-3.5 text-center shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 mb-1">
            <Dumbbell className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Đạm thực vật
            </span>
          </div>
          <div className="text-xl font-black text-emerald-950">
            {protein} <span className="text-xs font-semibold text-emerald-700">gam</span>
          </div>
          <div className="text-[10px] text-emerald-600/80 mt-0.5">Từ đậu nành & hạt</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Tinh bột chậm
            </span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {carbs} <span className="text-xs font-semibold text-slate-500">gam</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Chỉ số GI thấp</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 text-center shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-rose-600 mb-1">
            <HeartPulse className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Chất béo tốt
            </span>
          </div>
          <div className="text-xl font-black text-slate-900">
            {fat} <span className="text-xs font-semibold text-slate-500">gam</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Từ mè và hạt dẻ</div>
        </div>
      </div>

      {/* 2. Tangible Health Benefits */}
      <div className="bg-emerald-950 text-white rounded-2xl p-5 border border-emerald-800/80 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-emerald-800 flex items-center justify-center text-emerald-300">
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold tracking-wide uppercase text-emerald-200">
            Công dụng thực tế cho sức khỏe
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white mb-0.5">Hỗ trợ săn chắc cơ & Năng lượng bền</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Đạm thực vật cô đặc giúp nuôi dưỡng cơ bắp, no lâu mà không gây cảm giác đầy ức sau khi ăn
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white mb-0.5">Thanh nhiệt dưỡng nhan & Nhẹ bụng</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Hàm lượng chất xơ dồi dào hỗ trợ hệ tiêu hóa vận hành trơn tru, giúp thanh lọc cơ thể
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white mb-0.5">Ổn định đường huyết & Tốt cho tim</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Tinh bột hấp thu chậm không làm tăng vọt insulin, an tâm cho người kiêng đường
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white mb-0.5">Tươi lành thuần khiết</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Không bột ngọt công nghiệp, gia vị tự nhiên từ nấm và củ quả tươi ninh kỹ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Farm-to-Table Ingredients */}
      {ingredients.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Nguyên liệu tươi liên kết nông trại
            </h4>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Canh tác an toàn
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {ing}
              </span>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Cam kết 100% nguyên liệu thực vật tươi sạch trong ngày, không chất bảo quản</span>
          </div>
        </div>
      )}
    </div>
  )
}
