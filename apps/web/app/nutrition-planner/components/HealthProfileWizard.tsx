'use client'

import React, { useState } from 'react'
import { HealthProfileForm } from '../types'
import { ArrowRight, Sparkles } from 'lucide-react'

interface WizardProps {
  initialData: HealthProfileForm
  onComplete: (data: HealthProfileForm) => void
}

export default function HealthProfileWizard({ initialData, onComplete }: WizardProps) {
  const [formData, setFormData] = useState<HealthProfileForm>(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  return (
    <div className="food-card p-6 sm:p-8 bg-white max-w-2xl mx-auto shadow-sm">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
          Hồ Sơ Sức Khỏe Lâm Sàng
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Khảo Sát Thể Trạng & Dinh Dưỡng
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Gender */}
        <div>
          <label className="font-bold text-slate-900 block mb-2">Giới tính sinh học</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: 'female' })}
              className={`py-2.5 px-4 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                formData.gender === 'female'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Nữ giới
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: 'male' })}
              className={`py-2.5 px-4 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                formData.gender === 'male'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Nam giới
            </button>
          </div>
        </div>

        {/* Age, Height, Weight */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="font-bold text-slate-900 block mb-1">Tuổi</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs bg-slate-50 focus:bg-white"
              min={10}
              max={100}
              required
            />
          </div>
          <div>
            <label className="font-bold text-slate-900 block mb-1">Chiều cao (cm)</label>
            <input
              type="number"
              value={formData.heightCm}
              onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs bg-slate-50 focus:bg-white"
              min={100}
              max={220}
              required
            />
          </div>
          <div>
            <label className="font-bold text-slate-900 block mb-1">Cân nặng (kg)</label>
            <input
              type="number"
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs bg-slate-50 focus:bg-white"
              min={30}
              max={200}
              required
            />
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="font-bold text-slate-900 block mb-1">Mức độ vận động hàng tuần</label>
          <select
            value={formData.activityLevel}
            onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs bg-white"
          >
            <option value="SEDENTARY">Ít vận động (Công việc văn phòng ngồi nhiều)</option>
            <option value="LIGHTLY_ACTIVE">Vận động nhẹ (Tập nhẹ 1 - 3 ngày/tuần)</option>
            <option value="MODERATELY_ACTIVE">Vận động vừa (Tập luyện 3 - 5 ngày/tuần)</option>
            <option value="VERY_ACTIVE">Vận động nặng (Tập luyện cường độ cao 6 - 7 ngày/tuần)</option>
          </select>
        </div>

        {/* Goal */}
        <div>
          <label className="font-bold text-slate-900 block mb-1">Mục tiêu thể trạng chính</label>
          <select
            value={formData.primaryGoal}
            onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value as any })}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-xs bg-white"
          >
            <option value="fat_loss">Thanh lọc giảm mỡ (Thâm hụt calo nhẹ)</option>
            <option value="muscle_gain">Thể thao tăng cơ (Bổ sung đạm thực vật sinh học)</option>
            <option value="maintenance">Duy trì vóc dáng & Cân bằng chuyển hóa</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn-primary-gradient w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white shadow-md cursor-pointer mt-4"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Tính Toán Phác Đồ Dinh Dưỡng</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
