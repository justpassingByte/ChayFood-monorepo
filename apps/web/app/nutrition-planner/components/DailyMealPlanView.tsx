'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { DailyMealPlan, MealSlot, BiomarkerResult } from '../types'
import { MenuItem } from '../../lib/services/types'
import { Shuffle, ArrowRight, ShoppingCart, Sparkles } from 'lucide-react'

interface PlanViewProps {
  plan: DailyMealPlan
  biomarkers: BiomarkerResult
  availableItems: MenuItem[]
  onUpdateSlot: (slotId: MealSlot['slotId'], item: MenuItem) => void
  onShuffleAll: () => void
}

export default function DailyMealPlanView({
  plan,
  biomarkers,
  availableItems,
  onUpdateSlot,
  onShuffleAll
}: PlanViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Thực Đơn Gợi Ý Trong Ngày
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            Khẩu Phần 4 Bữa Chuẩn Calo ({plan.totalCalories} / {biomarkers.targetCalories} kcal)
          </h3>
        </div>

        <button
          type="button"
          onClick={onShuffleAll}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5 text-emerald-700" />
          <span>Đổi món ngẫu nhiên</span>
        </button>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {plan.slots.map((slot) => {
          const item = slot.item
          return (
            <div key={slot.slotId} className="food-card p-4 bg-white flex flex-col justify-between border border-slate-200">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    {slot.slotName}
                  </span>
                  <span className="text-xs font-bold text-amber-700 font-mono">
                    {item.calories || 380} kcal
                  </span>
                </div>

                <div className="flex gap-3 my-2">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-slate-600">
                      <span className="text-blue-700">{item.protein || 15}g Đạm</span>
                      <span>•</span>
                      <span className="text-amber-700">{item.carbs || 50}g Carbs</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                <span className="font-extrabold text-emerald-800">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price || 55000)}
                </span>
                <Link
                  href={`/menu/${item._id || item.id}`}
                  className="text-[11px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                >
                  Xem chi tiết
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA Order Daily Plan */}
      <div className="food-card p-6 bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            Gói Ăn Trọn Vẹn
          </span>
          <h4 className="text-lg font-bold text-white mt-0.5">
            Đặt Trọn Gói 4 Bữa Ăn Theo Phác Đồ Này
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Đầu bếp chế biến tươi trong ngày, giao nóng đúng từng khung giờ bữa sáng, trưa và tối.
          </p>
        </div>

        <Link
          href="/subscriptions"
          className="btn-primary-gradient px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap text-white shadow-md inline-flex items-center gap-2 cursor-pointer shrink-0"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Đăng Ký Gói Ăn Này</span>
        </Link>
      </div>
    </div>
  )
}
