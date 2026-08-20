"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Layers, BarChart3, CheckCircle2, ChevronLeft, ChevronRight, Leaf, ShieldCheck } from 'lucide-react'
import { MenuItemCard } from './components/ui/menu-item-card'
import { useRedirectByRole } from './hooks/useRedirectByRole'
import { MenuItem } from './lib/services/types'

const initialFeaturedFoods: MenuItem[] = [
  {
    _id: 'f-1',
    id: 'f-1',
    name: 'Cơm Tấm Sườn Chay Sốt Nấm Đông Cô',
    description: 'Sườn non làm từ đạm đậu nành ủ sốt nấm đông cô cô đặc, ăn kèm chả nấm, bì thính gạo lứt và đồ chua nhà làm tươi giòn.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    category: 'main',
    calories: 480,
    protein: 18.5,
    carbs: 65.0,
    fat: 12.0,
    isAvailable: true,
    preparationTime: 15,
    ingredients: ['Đạm đậu nành Non-GMO', 'Gạo tấm', 'Nấm đông cô', 'Bì thính gạo lứt'],
    isVegetarian: true,
  },
  {
    _id: 'f-2',
    id: 'f-2',
    name: 'Bún Bò Huế Chay Chả Nấm & Nước Dùng Thảo Mộc',
    description: 'Nước dùng ninh 8 tiếng từ củ quả và mía lau, thơm ngát sả gừng, topping chả nấm mối, tàu hũ ky và đậu hũ non chiên giòn.',
    price: 49000,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600',
    category: 'main',
    calories: 410,
    protein: 16.0,
    carbs: 58.0,
    fat: 9.0,
    isAvailable: true,
    preparationTime: 12,
    ingredients: ['Bún tươi', 'Nấm mối', 'Tàu hũ ky', 'Nước dùng củ quả', 'Rau thơm'],
    isVegetarian: true,
  },
  {
    _id: 'f-3',
    id: 'f-3',
    name: 'Salad Quinoa Bơ Sáp & Hạt Sen Sốt Chanh Dây',
    description: 'Hạt diêm mạch 3 màu kết hợp bơ sáp Đắk Lắk, hạt sen tươi hấp mềm và xà lách hữu cơ hòa quyện sốt chanh dây thanh mát.',
    price: 62000,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    category: 'side',
    calories: 340,
    protein: 14.0,
    carbs: 42.0,
    fat: 11.5,
    isAvailable: true,
    preparationTime: 10,
    ingredients: ['Hạt Quinoa', 'Bơ sáp', 'Hạt sen', 'Rau hữu cơ', 'Sốt chanh dây'],
    isVegetarian: true,
  },
  {
    _id: 'f-4',
    id: 'f-4',
    name: 'Lẩu Nấm Dưỡng Sinh Hoàng Kim Mini',
    description: 'Set lẩu mini cho 1 người với 5 loại nấm quý: nấm linh chi, nấm đùi gà, nấm bào ngư cùng nước hầm táo đỏ kỷ tử bổ khí huyết.',
    price: 89000,
    image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=600',
    category: 'main',
    calories: 520,
    protein: 21.0,
    carbs: 72.0,
    fat: 11.0,
    isAvailable: true,
    preparationTime: 25,
    ingredients: ['Nấm linh chi', 'Nấm đùi gà', 'Tàu hũ tươi', 'Rau tần ô', 'Mía lau'],
    isVegetarian: true,
  },
  {
    _id: 'f-5',
    id: 'f-5',
    name: 'Gỏi Cuốn Ngũ Sắc Sốt Tương Bơ Đậu Phộng',
    description: 'Bánh tráng cuốn bún tươi, xà lách hữu cơ, bơ sáp dẻo, dưa leo, đậu hũ chiên giòn chấm cùng sốt tương bơ đậu phộng béo bùi.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
    category: 'side',
    calories: 280,
    protein: 11.0,
    carbs: 45.0,
    fat: 8.0,
    isAvailable: true,
    preparationTime: 10,
    ingredients: ['Bánh tráng', 'Bún tươi', 'Bơ sáp', 'Đậu hũ', 'Tương bơ đậu phộng'],
    isVegetarian: true,
  },
  {
    _id: 'f-6',
    id: 'f-6',
    name: 'Trà Hoa Cúc Thảo Mộc Thanh Nhiệt Dưỡng Nhan',
    description: 'Trà hoa cúc nguyên bông ướp mật ong hoa nhãn, kỷ tử đỏ và táo tàu giúp thanh lọc gan, ngủ ngon và đẹp da.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600',
    category: 'beverage',
    calories: 85,
    protein: 1.0,
    carbs: 21.0,
    fat: 0.0,
    isAvailable: true,
    preparationTime: 5,
    ingredients: ['Hoa cúc', 'Kỷ tử', 'Táo đỏ', 'Mật ong hoa rừng'],
    isVegetarian: true,
  },
]

const steps = [
  {
    number: '01',
    title: 'Chọn Gói Ăn Phù Hợp',
    description: 'Lựa chọn gói ăn cá nhân theo chỉ số dinh dưỡng hoặc mâm cơm ấm cúng cho cả gia đình'
  },
  {
    number: '02',
    title: 'Đầu Bếp Nấu Tươi',
    description: 'Nguyên liệu thu hoạch trong ngày từ nông trại hữu cơ, chế biến theo công thức chuẩn y khoa'
  },
  {
    number: '03',
    title: 'Giao Nóng Đúng Giờ',
    description: 'Phần ăn được giao nóng tận cửa bằng hộp bã mía thân thiện môi trường trước mỗi bữa ăn'
  },
  {
    number: '04',
    title: 'Thưởng Thức Trọn Vị',
    description: 'Không tốn thời gian đi chợ hay nấu nướng dầu mỡ, sẵn sàng bữa ăn thơm ngon và đủ chất'
  }
]

const mealPlans = [
  {
    id: 'plan-1',
    name: 'Chay Thanh Tịnh Tuần',
    tag: 'Gói 7 Ngày',
    description: 'Thanh lọc cơ thể nhẹ nhàng và hỗ trợ đường tiêu hóa hoạt động êm dịu',
    price: 350000,
    duration: '7 ngày (7 bữa)',
    features: [
      '1 Bữa chính thanh đạm mỗi ngày',
      '1 Phần nước thảo mộc thanh nhiệt',
      'Thực đơn thay đổi luân phiên',
      'Miễn phí giao hàng nội thành'
    ]
  },
  {
    id: 'plan-2',
    name: 'Chay Năng Lượng Gym & Fit',
    tag: 'Gói Thể Hình Khuyên Dùng',
    description: 'Khẩu phần giàu Protein thực vật (từ 25g - 35g đạm mỗi bữa) cho người vận động thể thao',
    price: 550000,
    duration: '7 ngày (14 bữa)',
    featured: true,
    features: [
      '2 Bữa chính High-Protein chuẩn Macro',
      '1 Sinh tố hạt dinh dưỡng tăng cơ',
      'Tư vấn trực tiếp cùng chuyên gia dinh dưỡng',
      'Ưu tiên giao nóng đúng khung giờ'
    ]
  },
  {
    id: 'plan-3',
    name: 'Chay Tháng Cân Bằng',
    tag: 'Gói 30 Ngày',
    description: 'Thực đơn 30 ngày đa dạng dinh dưỡng và hỗ trợ duy trì thói quen ăn lành mạnh',
    price: 1350000,
    duration: '30 ngày (30 bữa)',
    features: [
      '30 Bữa ăn cao cấp đa dạng món',
      'Tặng 4 set lẩu nấm dưỡng sinh cuối tuần',
      'Hỗ trợ tạm dừng hoặc đổi ngày linh hoạt',
      'Tặng thẻ thành viên ChayFood VIP'
    ]
  }
]

export default function Home() {
  useRedirectByRole()

  const [foods] = useState<MenuItem[]>(initialFeaturedFoods)
  const [viewMode, setViewMode] = useState<'visual' | 'macro'>('visual')
  const [selectedGoal, setSelectedGoal] = useState<'all' | 'high-protein' | 'low-cal' | 'beverage'>('all')
  const [calculatorGoal, setCalculatorGoal] = useState<'fit' | 'lose' | 'zen'>('fit')

  const filteredFoods = foods.filter((food) => {
    const protein = Number(food.protein ?? food.nutritionInfo?.protein ?? 0)
    const calories = Number(food.calories ?? food.nutritionInfo?.calories ?? 0)

    if (selectedGoal === 'high-protein') return protein >= 18
    if (selectedGoal === 'low-cal') return calories <= 400
    if (selectedGoal === 'beverage') return food.category === 'beverage'
    return true
  })

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* 1. HERO SECTION: Editorial Food Tech */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-stone-100/60 via-white to-stone-50/40">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200/80 shadow-sm text-xs font-bold text-emerald-900 mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                THỰC ĐƠN DINH DƯỠNG THỰC VẬT CHUẨN MỰC
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-slate-900 leading-[1.18] mb-6">
                <span className="block">Ẩm Thực Chay Tươi Lành</span>
                <span className="block bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 bg-clip-text text-transparent mt-1">
                  Dinh Dưỡng Thực Vật Chuẩn Mực
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                Minh bạch chỉ số Calo, Protein thực vật và vi chất cho từng khẩu phần. Nguyên liệu hữu cơ tươi sạch canh tác chuẩn tự nhiên được chế biến và giao nóng mỗi ngày.
              </p>

              {/* Hero Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Link
                  href="/menu"
                  className="btn-primary-gradient px-7 py-3.5 rounded-2xl text-sm font-bold inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all text-white cursor-pointer"
                >
                  Khám Phá Thực Đơn
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/subscriptions"
                  className="px-6 py-3.5 rounded-2xl text-sm font-bold bg-white text-slate-800 border border-slate-200 hover:border-emerald-700 hover:text-emerald-800 shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  Gói Ăn Định Kỳ
                </Link>
              </div>

              {/* Nutrition Guarantees */}
              <div className="mt-10 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6 w-full text-left">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">Hữu Cơ</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Nông trại liên kết</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-blue-700 font-mono">≥25g</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Đạm thực vật mỗi phần Fit</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-emerald-700 font-mono">Chuẩn ATTP</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Không phụ gia độc hại</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative w-full">
              <div className="relative mx-auto max-w-md rounded-3xl p-3.5 bg-white border border-slate-200/90 shadow-xl">
                <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                  <Image
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800"
                    alt="Buddha Bowl Quinoa"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                  
                  {/* Calorie Badge */}
                  <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-sm text-white text-xs font-bold font-mono">
                    460 kcal
                  </div>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-700">
                      Khẩu Phần Mẫu
                    </span>
                    <h3 className="font-extrabold text-base sm:text-lg mt-1 text-white leading-snug">
                      Buddha Bowl Quinoa & Đậu Hũ Nướng
                    </h3>
                  </div>
                </div>

                {/* Macro Nutrition Specs */}
                <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Phân Bổ Vi Chất Chuẩn Hóa</span>
                    <span className="text-emerald-700 font-medium text-[11px]">ISO-Nutri 2.0</span>
                  </div>
                  <div className="macro-progress-track">
                    <div className="macro-seg-protein" style={{ width: '30%' }} title="Đạm: 24g" />
                    <div className="macro-seg-carbs" style={{ width: '50%' }} title="Tinh bột: 48g" />
                    <div className="macro-seg-fat" style={{ width: '20%' }} title="Chất béo: 14g" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold pt-1">
                    <span className="text-blue-700 font-mono">Đạm: 24g</span>
                    <span className="text-amber-700 font-mono">Carbs: 48g</span>
                    <span className="text-pink-700 font-mono">Béo: 14g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL VIEW MODE FEATURED MENU SECTION */}
      <section className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              Thực Đơn Khoa Học
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Món Chay Dinh Dưỡng Hôm Nay
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Lựa chọn món ăn theo mục tiêu thể trạng và chế độ ăn của riêng bạn
            </p>
          </div>

          {/* DUAL VIEW MODE SWITCHER */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'visual'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-700" />
              Thực Đơn Trực Quan
            </button>

            <button
              type="button"
              onClick={() => setViewMode('macro')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'macro'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-700" />
              Dinh Dưỡng Macro
            </button>
          </div>
        </div>

        {/* GOAL-ORIENTED FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedGoal('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedGoal === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            Tất Cả Thực Đơn ({foods.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedGoal('high-protein')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedGoal === 'high-protein'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            Tăng Cơ Giàu Đạm (Protein ≥ 18g)
          </button>

          <button
            type="button"
            onClick={() => setSelectedGoal('low-cal')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedGoal === 'low-cal'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            Giảm Mỡ Low-Calo (≤ 400 kcal)
          </button>

          <button
            type="button"
            onClick={() => setSelectedGoal('beverage')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedGoal === 'beverage'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            Trà Thảo Mộc Dưỡng Nhan
          </button>
        </div>

        {/* FOOD GRID */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredFoods.map((food) => (
              <MenuItemCard
                key={food._id || food.name}
                item={food}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 3. 4-STEP ORDERING PROCESS */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 block">
              Quy Trình Tiện Lợi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Thưởng Thức Bữa Ăn Dễ Dàng
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="food-card p-6 flex flex-col items-center text-center bg-slate-50/50">
                <div className="w-12 h-12 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE CLINICAL NUTRITION CALCULATOR */}
      <section className="container-custom">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="max-w-2xl mx-auto text-center mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Công Nghệ Mifflin-St Jeor
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tính Toán Nhu Cầu Dinh Dưỡng Khoa Học
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Chọn mục tiêu thể trạng để xem định lượng vi chất phù hợp nhất cho bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <button
              type="button"
              onClick={() => setCalculatorGoal('fit')}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                calculatorGoal === 'fit'
                  ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-sm font-bold text-slate-900 mb-1">Tăng Cơ & Thể Thao</div>
              <div className="text-xs text-slate-500">Đạm cao, phục hồi cơ bắp</div>
            </button>

            <button
              type="button"
              onClick={() => setCalculatorGoal('lose')}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                calculatorGoal === 'lose'
                  ? 'border-amber-600 bg-amber-50/60 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-sm font-bold text-slate-900 mb-1">Giảm Mỡ & Thon Gọn</div>
              <div className="text-xs text-slate-500">Kiểm soát calo, no lâu</div>
            </button>

            <button
              type="button"
              onClick={() => setCalculatorGoal('zen')}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                calculatorGoal === 'zen'
                  ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-sm font-bold text-slate-900 mb-1">Dưỡng Sinh & Thải Độc</div>
              <div className="text-xs text-slate-500">Thanh lọc nhẹ nhàng</div>
            </button>
          </div>

          {/* Target Result Box */}
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Khuyến Nghị Khẩu Phần Hằng Ngày
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Năng lượng</div>
                <div className="text-lg font-extrabold text-slate-900 font-mono">
                  {calculatorGoal === 'fit' ? '2.150' : calculatorGoal === 'lose' ? '1.550' : '1.800'} kcal
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="text-xs text-blue-700 font-semibold mb-1">Đạm thực vật</div>
                <div className="text-lg font-extrabold text-blue-800 font-mono">
                  {calculatorGoal === 'fit' ? '110g' : calculatorGoal === 'lose' ? '75g' : '85g'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <div className="text-xs text-amber-700 font-semibold mb-1">Tinh bột chậm</div>
                <div className="text-lg font-extrabold text-amber-800 font-mono">
                  {calculatorGoal === 'fit' ? '240g' : calculatorGoal === 'lose' ? '140g' : '190g'}
                </div>
              </div>
            </div>

            <Link
              href="/nutrition-planner"
              className="btn-primary-gradient px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2 text-white shadow-sm mt-2 cursor-pointer"
            >
              Thiết Kế Thực Đơn Theo Thể Trạng Cá Nhân
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. MEAL PLANS SUBSCRIPTION SHOWCASE */}
      <section className="bg-slate-950 text-white py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 lg:px-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Gói Ăn Cá Nhân Hóa
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 mb-3 text-white tracking-tight">
            Gói Ăn Chay Dinh Dưỡng Định Kỳ
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Tiết kiệm chi phí, đổi mới khẩu vị mỗi ngày, giao tận nơi đúng khung giờ bạn chọn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mealPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-3xl border flex flex-col justify-between transition-all ${
                plan.featured
                  ? 'bg-gradient-to-b from-emerald-950 to-slate-900 border-emerald-500 shadow-xl lg:scale-105'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                <span className={`text-[11px] font-bold uppercase ${plan.featured ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {plan.tag}
                </span>
                <h3 className="text-xl font-bold text-white mt-1 mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {plan.description}
                </p>
                <div className="text-3xl font-extrabold text-white mb-6 font-mono">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan.price)}
                  <span className="text-xs font-normal text-slate-400 ml-1 font-sans">/ {plan.duration}</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/subscriptions"
                className={`w-full py-3.5 rounded-2xl font-bold text-xs text-center transition-all cursor-pointer ${
                  plan.featured
                    ? 'btn-primary-gradient text-white shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                Đăng Ký Gói Này
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. GREEN RESPONSIBILITY & ORGANIC FARMS */}
      <section className="container-custom">
        <div className="food-card p-8 bg-gradient-to-r from-emerald-950 to-slate-950 text-white border border-emerald-800/60 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/60 border border-emerald-700 text-emerald-300">
              <Leaf className="w-3.5 h-3.5" />
              Trách Nhiệm Xanh
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Bao Bì Bã Mía & Không Lãng Phí Thực Phẩm
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mỗi khẩu phần giao tận nơi đều sử dụng hộp bã mía và muỗng gỗ tự phân hủy sinh học. Thuật toán định lượng nguyên liệu chuẩn xác giúp tối ưu hóa chuỗi cung ứng và giảm thiểu dư thừa.
            </p>
          </div>

          <div className="space-y-3 md:border-l md:border-slate-800 md:pl-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-900/60 border border-teal-700 text-teal-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Nông Trại Hữu Cơ Liên Kết
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Nguồn Nông Sản Tươi Lành Mỗi Ngày
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hợp tác trực tiếp cùng các nông trại hữu cơ tại Đà Lạt và Củ Chi. Rau củ quả và nấm tươi được sơ chế và nấu nóng ngay trong ngày, giữ trọn vẹn hương vị và dưỡng chất tự nhiên.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}