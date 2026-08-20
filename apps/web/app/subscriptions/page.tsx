"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, Clock, Calendar, Heart, Leaf } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

interface SubscriptionPlan {
  id: string
  name: string
  tag: string
  price: number
  duration: string
  description: string
  mealsPerDay: number
  features: string[]
  recommended?: boolean
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan-1',
    name: 'Chay Thanh Tịnh Tuần',
    tag: 'Gói 7 Ngày',
    price: 350000,
    duration: '7 ngày (7 bữa)',
    mealsPerDay: 1,
    description: 'Thanh lọc cơ thể nhẹ nhàng và hỗ trợ đường tiêu hóa hoạt động êm dịu',
    features: [
      '1 Bữa chính thanh đạm mỗi ngày',
      '1 Phần nước thảo mộc thanh nhiệt',
      'Thực đơn thay đổi luân phiên hằng ngày',
      'Miễn phí giao hàng nội thành đúng giờ'
    ]
  },
  {
    id: 'plan-2',
    name: 'Chay Năng Lượng Gym & Fit',
    tag: 'Khuyên Dùng Cho Thể Thao',
    price: 550000,
    duration: '7 ngày (14 bữa)',
    mealsPerDay: 2,
    recommended: true,
    description: 'Khẩu phần giàu Protein thực vật (từ 25g - 35g đạm mỗi bữa) cho người vận động',
    features: [
      '2 Bữa chính High-Protein chuẩn Macro',
      '1 Sinh tố hạt dinh dưỡng tăng cơ',
      'Tư vấn trực tiếp cùng chuyên gia dinh dưỡng',
      'Ưu tiên giao nóng đúng khung giờ tập luyện'
    ]
  },
  {
    id: 'plan-3',
    name: 'Chay Tháng Cân Bằng',
    tag: 'Gói Tiết Kiệm 30 Ngày',
    price: 1350000,
    duration: '30 ngày (30 bữa)',
    mealsPerDay: 1,
    description: 'Thực đơn 30 ngày đa dạng dinh dưỡng và hỗ trợ duy trì thói quen ăn lành mạnh',
    features: [
      '30 Bữa ăn cao cấp đổi vị mỗi ngày',
      'Tặng 4 set lẩu nấm dưỡng sinh cuối tuần',
      'Hỗ trợ tạm dừng hoặc đổi ngày linh hoạt',
      'Tặng thẻ thành viên ChayFood VIP'
    ]
  },
  {
    id: 'plan-4',
    name: 'Mâm Cơm Gia Đình Đa Thế Hệ',
    tag: 'Gói Gia Đình 4 Người',
    price: 1850000,
    duration: '7 ngày (7 mâm cơm)',
    mealsPerDay: 4,
    description: 'Mâm cơm 4 món đủ đầy dinh dưỡng cho cả ông bà, bố mẹ và con nhỏ',
    features: [
      'Mâm cơm 4 món (Canh, Kho, Xào, Cơm lứt/Quinoa)',
      'Tự động loại trừ nguyên liệu dị ứng theo từng thành viên',
      'Giao nóng trước giờ cơm gia đình',
      'Tặng kèm trà dưỡng nhan thảo mộc'
    ]
  }
]

export default function SubscriptionsPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState<string>('plan-2')
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    district: '',
    city: 'TP. Hồ Chí Minh',
    timeSlot: '11:30 - 12:00',
    startDate: '',
    dietaryNotes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const activePlanObj = subscriptionPlans.find(p => p.id === selectedPlan) || subscriptionPlans[1]

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.phone || !formData.street) {
        toast.error('Vui lòng điền họ tên, số điện thoại và địa chỉ giao nhận')
        return
      }
    }
    setCurrentStep(prev => prev + 1)
  }

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true)
      await new Promise(r => setTimeout(r, 1000))
      setIsSuccess(true)
      toast.success('Đăng ký gói ăn định kỳ thành công')
    } catch {
      toast.error('Không thể gửi thông tin đăng ký')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBF9] pb-24">
      {/* Header Banner - Compact & Standardized */}
      <section className="bg-slate-950 text-white py-4 sm:py-5 border-b border-slate-800">
        <div className="container-custom max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold uppercase mb-1.5">
              <Sparkles className="w-3 h-3" />
              Dinh Dưỡng Định Kỳ Chuẩn Mực
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Gói Ăn Chay Dinh Dưỡng Tuần & Tháng
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-md md:text-right leading-relaxed">
            Đầu bếp nấu tươi mỗi ngày, giao nóng đúng khung giờ bạn chọn, thực đơn đổi món liên tục
          </p>
        </div>
      </section>

      {/* Progress Step Bar */}
      <div className="container-custom max-w-3xl pt-5 pb-4">
        <div className="flex items-center justify-between relative mb-8">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
          {['Chọn Gói Ăn', 'Địa Chỉ & Khung Giờ', 'Xác Nhận Đăng Ký'].map((label, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-1.5 bg-[#FAFBF9] px-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  idx <= currentStep
                    ? 'bg-emerald-700 text-white shadow-sm ring-4 ring-emerald-100'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {idx + 1}
              </div>
              <span className={`text-xs font-bold ${idx <= currentStep ? 'text-emerald-900' : 'text-slate-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: CHOOSE PLAN */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscriptionPlans.map((plan) => {
                const isSelected = selectedPlan === plan.id
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`food-card p-6 cursor-pointer border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/40 shadow-md ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          plan.recommended ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {plan.tag}
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mt-1">{plan.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">{plan.description}</p>

                      <div className="text-2xl font-extrabold text-emerald-800 font-mono mb-4">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan.price)}
                        <span className="text-xs font-normal text-slate-500 font-sans ml-1">/ {plan.duration}</span>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary-gradient px-8 py-3 rounded-2xl text-xs font-bold inline-flex items-center gap-2 text-white shadow-md cursor-pointer"
              >
                <span>Tiếp Tục Điền Thông Tin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DELIVERY INFO */}
        {currentStep === 1 && (
          <div className="food-card p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Khung Giờ & Nơi Nhận Món
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Thông Tin Nhận Bữa Ăn ({activePlanObj.name})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-900 block mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0932 788 120"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-900 block mb-1">Địa chỉ giao hàng</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={e => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Số nhà, tên đường, phường, quận..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Khung giờ giao bữa trưa</label>
                <select
                  value={formData.timeSlot}
                  onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="10:30 - 11:00">10:30 - 11:00 (Sớm)</option>
                  <option value="11:30 - 12:00">11:30 - 12:00 (Chuẩn bữa trưa)</option>
                  <option value="12:00 - 12:30">12:00 - 12:30 (Muộn)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Ghi chú ăn kiêng / Dị ứng</label>
                <input
                  type="text"
                  value={formData.dietaryNotes}
                  onChange={e => setFormData({ ...formData, dietaryNotes: e.target.value })}
                  placeholder="Không hành tỏi, dị ứng nấm mỡ, ăn nhạt..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(0)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="btn-primary-gradient px-8 py-3 rounded-2xl text-xs font-bold inline-flex items-center gap-2 text-white shadow-md cursor-pointer"
              >
                <span>Xem Lại Đơn Đăng Ký</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & CONFIRM */}
        {currentStep === 2 && !isSuccess && (
          <div className="food-card p-6 sm:p-8 bg-white border border-slate-200 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Bước Cuối Cùng
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Xác Nhận Thông Tin Đăng Ký Gói Ăn
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500">Gói đã chọn:</span>
                <span className="font-bold text-slate-900">{activePlanObj.name} ({activePlanObj.duration})</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500">Người nhận & SĐT:</span>
                <span className="font-bold text-slate-900">{formData.fullName} • {formData.phone}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500">Địa chỉ giao hàng:</span>
                <span className="font-bold text-slate-900">{formData.street}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500">Khung giờ giao:</span>
                <span className="font-bold text-emerald-800">{formData.timeSlot}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
                <span className="text-xl font-extrabold text-emerald-800 font-mono">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activePlanObj.price)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sửa thông tin</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="btn-primary-gradient px-8 py-3 rounded-2xl text-xs font-bold inline-flex items-center gap-2 text-white shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Đang kích hoạt...' : 'Hoàn Tất Đăng Ký Gói'}
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS CONFIRMATION */}
        {isSuccess && (
          <div className="food-card p-8 sm:p-12 bg-white border border-emerald-300 text-center space-y-4 max-w-lg mx-auto shadow-lg">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-700" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Đăng Ký Thành Công</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Chuyên viên dinh dưỡng của ChayFood sẽ liên hệ qua số điện thoại <strong>{formData.phone}</strong> để xác nhận khẩu vị và lịch giao bữa ăn đầu tiên.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link href="/menu" className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-bold">
                Xem Thực Đơn
              </Link>
              <Link href="/" className="btn-primary-gradient px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm">
                Về Trang Chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}