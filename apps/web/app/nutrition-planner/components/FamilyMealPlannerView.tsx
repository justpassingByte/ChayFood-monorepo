'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FamilyMemberProfile } from '../types'
import { Users, Plus, Trash2, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react'

const initialFamilyMembers: FamilyMemberProfile[] = [
  {
    id: 'mem-1',
    name: 'Ông Bà',
    relation: 'GRANDPARENT',
    age: 68,
    gender: 'female',
    targetCalories: 1550,
    allergies: ['Đậu phộng'],
    dietaryNotes: 'Ăn dưỡng sinh, ít dầu mỡ, giảm muối',
  },
  {
    id: 'mem-2',
    name: 'Bố Mẹ',
    relation: 'SELF',
    age: 36,
    gender: 'male',
    targetCalories: 2100,
    allergies: [],
    dietaryNotes: 'Bổ sung đạm thực vật, kiểm soát đường huyết',
  },
  {
    id: 'mem-3',
    name: 'Bé Nhỏ',
    relation: 'CHILD',
    age: 8,
    gender: 'female',
    targetCalories: 1400,
    allergies: ['Nấm mỡ'],
    dietaryNotes: 'Tăng cường Canxi, Magie và Vitamin nhóm B',
  },
]

export default function FamilyMealPlannerView() {
  const [members, setMembers] = useState<FamilyMemberProfile[]>(initialFamilyMembers)

  const handleRemove = (id: string) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  const totalFamilyCalories = members.reduce((sum, m) => sum + m.targetCalories, 0)

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="food-card p-6 sm:p-8 bg-white border-2 border-emerald-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 uppercase tracking-wider">
                Đa Thế Hệ
              </span>
              <span className="text-xs font-semibold text-slate-500">Khẩu Phần Hài Hòa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Mâm Cơm Gia Đình ({members.length} Thành Viên)
            </h2>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-right self-start sm:self-auto">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Tổng năng lượng mâm cơm</span>
            <span className="text-xl font-extrabold text-emerald-900 font-mono">{totalFamilyCalories} kcal</span>
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {members.map((member) => (
            <div key={member.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-900">{member.name} ({member.age} tuổi)</span>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemove(member.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Xóa thành viên"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{member.dietaryNotes}</p>
                {member.allergies.length > 0 && (
                  <div className="mt-2 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md inline-block">
                    Dị ứng: {member.allergies.join(', ')}
                  </div>
                )}
              </div>
              <div className="pt-2 border-t border-slate-200/80 mt-3 text-[11px] font-bold text-emerald-800">
                Nhu cầu: {member.targetCalories} kcal / ngày
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested 4-Course Family Meal */}
      <div className="food-card p-6 sm:p-8 bg-white border border-slate-200 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Thực Đơn Hài Hòa
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            Mâm Cơm 4 Món Gợi Ý Cho Cả Gia Đình
          </h3>
          <p className="text-xs text-slate-500">
            Tự động loại trừ đậu phộng và nấm mỡ, tối ưu cho cả trẻ nhỏ và người lớn tuổi.
          </p>
        </div>

        <ul className="space-y-3 text-xs text-slate-800 divide-y divide-slate-100">
          <li className="pt-2 flex items-center justify-between">
            <span className="font-semibold">1. Canh Rong Biển Hạt Sen Đậu Phụ Non</span>
            <span className="text-emerald-800 font-bold">Thanh nhiệt, dưỡng tâm</span>
          </li>
          <li className="pt-3 flex items-center justify-between">
            <span className="font-semibold">2. Nấm Đùi Gà Kho Tiêu Xanh Nước Dừa</span>
            <span className="text-emerald-800 font-bold">Đậm đà, giàu chất xơ</span>
          </li>
          <li className="pt-3 flex items-center justify-between">
            <span className="font-semibold">3. Bông Cải Xanh Xào Bắp Non Hạt Điều</span>
            <span className="text-emerald-800 font-bold">Bổ sung Canxi & Magie</span>
          </li>
          <li className="pt-3 flex items-center justify-between">
            <span className="font-semibold">4. Cơm Gạo Lứt Huyết Rồng Hạt Quinoa</span>
            <span className="text-emerald-800 font-bold">Chỉ số GI thấp, no lâu</span>
          </li>
        </ul>

        <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Phục vụ nóng kèm đồ chua nhà làm và trà hoa cúc thảo mộc.
          </div>
          <Link
            href="/subscriptions"
            className="btn-primary-gradient px-6 py-3 rounded-xl text-xs font-bold text-white shadow-md inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>Đặt Gói Mâm Cơm Gia Đình Tuần / Tháng</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
