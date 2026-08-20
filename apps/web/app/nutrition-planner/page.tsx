"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { calculateTargetCalories } from './nutritionEngine'

export default function NutritionPlannerPage() {
  const [plannerMode, setPlannerMode] = useState<'individual' | 'family'>('individual')

  // Form State
  const [gender, setGender] = useState<'male' | 'female'>('female')
  const [age, setAge] = useState<number>(28)
  const [height, setHeight] = useState<number>(162)
  const [weight, setWeight] = useState<number>(54)
  const [activity, setActivity] = useState<'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE'>('MODERATELY_ACTIVE')
  const [goal, setGoal] = useState<'MAINTAIN' | 'WEIGHT_LOSS' | 'MUSCLE_GAIN'>('WEIGHT_LOSS')
  const [hasCalculated, setHasCalculated] = useState(false)

  // Result State
  const [result, setResult] = useState<{
    bmr: number
    tdee: number
    targetCalories: number
    macros: { proteinGrams: number; carbGrams: number; fatGrams: number }
  } | null>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const engineResult = calculateTargetCalories({
      age,
      gender,
      heightCm: height,
      weightKg: weight,
      activityLevel: activity,
      goal,
    })

    setResult(engineResult)
    setHasCalculated(true)
  }

  return (
    <main className="min-h-screen pt-16 pb-16 bg-[#FAFBF9]">
      {/* Compact Subpage Header - RULE-UI-005 */}
      <section className="py-6 border-b border-[#E5E9E2] bg-white mb-8">
        <div className="container-custom flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#2D6A4F] uppercase tracking-wider block mb-1">
              Phòng khám dinh dưỡng thực vật
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Nutri-Planner 2.0
            </h1>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FAFBF9] border border-[#E5E9E2] rounded-xl shadow-sm">
            <button
              type="button"
              onClick={() => setPlannerMode('individual')}
              className={`py-1.5 px-4 rounded-lg text-xs font-semibold transition-all ${
                plannerMode === 'individual'
                  ? 'bg-[#1B4332] text-white shadow-sm'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              Cá Nhân Hóa Thể Trạng
            </button>
            <button
              type="button"
              onClick={() => setPlannerMode('family')}
              className={`py-1.5 px-4 rounded-lg text-xs font-semibold transition-all ${
                plannerMode === 'family'
                  ? 'bg-[#1B4332] text-white shadow-sm'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              Mâm Cơm Gia Đình
            </button>
          </div>
        </div>
      </section>

      <div className="container-custom">
        {plannerMode === 'individual' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            {/* Form Card */}
            <div className="lg:col-span-6 food-card p-6 bg-white">
              <h2 className="text-base font-bold text-[#0F172A] mb-4">
                Thông Số Thể Trạng
              </h2>

              <form onSubmit={handleCalculate} className="space-y-4 text-xs">
                {/* Gender */}
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1.5">Giới tính sinh học</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                        gender === 'female'
                          ? 'border-[#1B4332] bg-[#FAFBF9] text-[#1B4332] font-bold'
                          : 'border-[#E5E9E2] text-[#475569]'
                      }`}
                    >
                      Nữ
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                        gender === 'male'
                          ? 'border-[#1B4332] bg-[#FAFBF9] text-[#1B4332] font-bold'
                          : 'border-[#E5E9E2] text-[#475569]'
                      }`}
                    >
                      Nam
                    </button>
                  </div>
                </div>

                {/* Age & Height & Weight */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Tuổi</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E9E2] focus:outline-none focus:border-[#1B4332] text-xs"
                      min={10}
                      max={100}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Chiều cao (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E9E2] focus:outline-none focus:border-[#1B4332] text-xs"
                      min={100}
                      max={220}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">Cân nặng (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E9E2] focus:outline-none focus:border-[#1B4332] text-xs"
                      min={30}
                      max={200}
                      required
                    />
                  </div>
                </div>

                {/* Activity Level */}
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Mức độ vận động</label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#E5E9E2] focus:outline-none focus:border-[#1B4332] text-xs bg-white"
                  >
                    <option value="SEDENTARY">Ít vận động (Ngồi văn phòng)</option>
                    <option value="LIGHTLY_ACTIVE">Vận động nhẹ (Tập nhẹ 1-3 ngày/tuần)</option>
                    <option value="MODERATELY_ACTIVE">Vận động vừa (Tập luyện 3-5 ngày/tuần)</option>
                    <option value="VERY_ACTIVE">Vận động nặng (Thể thao 6-7 ngày/tuần)</option>
                  </select>
                </div>

                {/* Goal */}
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Mục tiêu thể trạng</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-[#E5E9E2] focus:outline-none focus:border-[#1B4332] text-xs bg-white"
                  >
                    <option value="WEIGHT_LOSS">Thanh lọc giảm mỡ (Deficit calo nhẹ)</option>
                    <option value="MAINTAIN">Duy trì vóc dáng & Năng lượng cân đối</option>
                    <option value="MUSCLE_GAIN">Thể thao tăng cơ (Bổ sung đạm thực vật)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-action w-full !py-2.5 !text-xs !font-bold mt-2"
                >
                  Tính Toán Phác Đồ Dinh Dưỡng
                </button>
              </form>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-6 space-y-4">
              {hasCalculated && result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="food-card p-6 bg-white border-2 border-[#1B4332]"
                >
                  <div className="flex items-center justify-between border-b border-[#E5E9E2] pb-3 mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#2D6A4F]">
                        Năng lượng khuyến nghị
                      </span>
                      <h3 className="text-2xl font-bold text-[#0F172A]">
                        {result.targetCalories} <span className="text-xs font-normal text-[#475569]">Kcal / ngày</span>
                      </h3>
                    </div>
                    <span className="badge-macro text-[10px]">
                      Chuẩn Y Khoa
                    </span>
                  </div>

                  {/* Metabolic Breakdown */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E2]">
                      <p className="text-[10px] text-[#475569]">Chuyển hóa cơ bản (BMR)</p>
                      <p className="text-base font-bold text-[#0F172A] mt-0.5">{result.bmr} Kcal</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E2]">
                      <p className="text-[10px] text-[#475569]">Tổng tiêu hao (TDEE)</p>
                      <p className="text-base font-bold text-[#0F172A] mt-0.5">{result.tdee} Kcal</p>
                    </div>
                  </div>

                  {/* Macro Distribution */}
                  <h4 className="text-xs font-bold text-[#0F172A] mb-2">
                    Phân Bổ Tỷ Lệ Vi Chất Khẩu Phần
                  </h4>
                  <div className="grid grid-cols-3 gap-2.5 text-center mb-6">
                    <div className="p-2.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E2]">
                      <p className="text-[10px] text-[#2D6A4F] font-bold">Đạm Thực Vật</p>
                      <p className="text-base font-bold text-[#0F172A] mt-0.5">{result.macros.proteinGrams}g</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E2]">
                      <p className="text-[10px] text-[#D97706] font-bold">Carbs Chậm</p>
                      <p className="text-base font-bold text-[#0F172A] mt-0.5">{result.macros.carbGrams}g</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E2]">
                      <p className="text-[10px] text-[#475569] font-bold">Chất Béo Tốt</p>
                      <p className="text-base font-bold text-[#0F172A] mt-0.5">{result.macros.fatGrams}g</p>
                    </div>
                  </div>

                  <Link
                    href={`/menu?maxCalories=${Math.round(result.targetCalories / 3)}`}
                    className="btn btn-primary w-full !py-2.5 !text-xs !font-bold flex items-center justify-center gap-1.5"
                  >
                    Xem Món Ăn Phù Hợp Với Thể Trạng Này
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                <div className="food-card p-8 bg-white flex flex-col items-center justify-center text-center h-full min-h-[320px] border-dashed border-2 border-[#E5E9E2]">
                  <h3 className="text-sm font-bold text-[#0F172A] mb-1">
                    Sẵn Sàng Tính Toán Phác Đồ
                  </h3>
                  <p className="text-xs text-[#475569] max-w-xs leading-relaxed">
                    Điền đầy đủ thông tin chiều cao, cân nặng và mức độ vận động ở cột bên trái để nhận bảng phân bổ đạm và calo chuẩn xác.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Family Meal Planner Mode */
          <div className="max-w-3xl mx-auto food-card p-8 bg-white shadow-md">
            <div className="mb-6 pb-3 border-b border-[#E5E9E2]">
              <h2 className="text-xl font-bold text-[#0F172A]">
                Mâm Cơm Gia Đình Đa Thế Hệ
              </h2>
              <p className="text-xs text-[#475569] mt-0.5">
                Tự động loại trừ dị ứng giao thoa và tối ưu thực đơn hài hòa cho các lứa tuổi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
              <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E2]">
                <span className="text-[10px] font-bold text-[#2D6A4F] uppercase">Thành viên 1</span>
                <p className="text-xs font-bold text-[#0F172A] mt-0.5">Ông Bà (68 tuổi)</p>
                <p className="text-[11px] text-[#475569] mt-0.5">Ăn dưỡng sinh, ít muối, hạn chế đường</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E2]">
                <span className="text-[10px] font-bold text-[#D97706] uppercase">Thành viên 2</span>
                <p className="text-xs font-bold text-[#0F172A] mt-0.5">Bố Mẹ (35 tuổi)</p>
                <p className="text-[11px] text-[#475569] mt-0.5">Giữ vóc dáng, bổ sung đạm thực vật</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E2]">
                <span className="text-[10px] font-bold text-[#475569] uppercase">Thành viên 3</span>
                <p className="text-xs font-bold text-[#0F172A] mt-0.5">Trẻ nhỏ (8 tuổi)</p>
                <p className="text-[11px] text-[#475569] mt-0.5">Dị ứng đậu phộng, cần nhiều canxi</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E2] mb-6">
              <h3 className="text-xs font-bold text-[#0F172A] mb-3">
                Mâm Cơm 4 Món Gợi Ý Cho Gia Đình
              </h3>
              <ul className="space-y-2 text-xs text-[#0F172A]">
                <li className="flex items-center justify-between border-b border-[#E5E9E2] pb-1.5">
                  <span>Canh rong biển hạt sen đậu phụ non</span>
                  <span className="font-semibold text-[#2D6A4F]">Thanh nhiệt, dưỡng tâm</span>
                </li>
                <li className="flex items-center justify-between border-b border-[#E5E9E2] pb-1.5">
                  <span>Nấm đùi gà kho tiêu xanh nước dừa</span>
                  <span className="font-semibold text-[#2D6A4F]">Đậm đà, giàu chất xơ</span>
                </li>
                <li className="flex items-center justify-between border-b border-[#E5E9E2] pb-1.5">
                  <span>Bông cải xanh xào bắp non hạt điều</span>
                  <span className="font-semibold text-[#2D6A4F]">Bổ sung Canxi & Magie</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Cơm gạo lứt huyết rồng trộn hạt quinoa</span>
                  <span className="font-semibold text-[#2D6A4F]">Chỉ số GI thấp</span>
                </li>
              </ul>
            </div>

            <Link
              href="/subscriptions"
              className="btn btn-action w-full !py-2.5 !text-xs !font-bold flex items-center justify-center gap-1.5"
            >
              Đặt Gói Mâm Cơm Gia Đình Giao Tận Nơi
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
