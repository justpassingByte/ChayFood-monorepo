"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useRedirectByRole } from './hooks/useRedirectByRole'
import { analyticsService } from './services/analyticsService'
import { MenuItemCard } from './components/ui/menu-item-card'
import { ChatAgent } from './components/chat/chat-agent'

interface PopularDish {
  id?: string
  _id?: string
  name: string
  image?: string
  price?: number
  revenue?: number
  description?: string
  ingredients?: string[]
  category?: string
  nutritionInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
  isAvailable?: boolean
  isBestSeller?: boolean
  isPopular?: boolean
}

const defaultDishes: PopularDish[] = [
  {
    id: 'dish-1',
    name: 'Cơm Gạo Lứt Bát Bửu Hoàng Cung',
    description: 'Gạo lứt đỏ Điện Biên kết hợp hạt sen Huế, nấm hương rừng, đậu gà và rau củ hữu cơ thanh ngọt.',
    price: 85000,
    image: '/meals/meal1.jpg',
    category: 'Món chính',
    nutritionInfo: { calories: 420, protein: 18, carbs: 62, fat: 8 },
    isBestSeller: true
  },
  {
    id: 'dish-2',
    name: 'Đậu Hũ Non Sốt Nấm Đông Cô Truffle',
    description: 'Đậu hũ tươi nghệ nhân hấp mềm mượt cùng nước cốt nấm đông cô cô đặc và dầu truffle thượng hạng.',
    price: 95000,
    image: '/meals/meal2.jpg',
    category: 'Món chính',
    nutritionInfo: { calories: 340, protein: 22, carbs: 24, fat: 12 },
    isPopular: true
  },
  {
    id: 'dish-3',
    name: 'Súp Dưỡng Nhan Hạt Sen Bạch Quả',
    description: 'Nước dùng ninh từ lê tuyết, kỷ tử hữu cơ, hạt sen tươi và tuyết nhĩ giúp thanh lọc nhiệt lượng.',
    price: 65000,
    image: '/meals/meal3.jpg',
    category: 'Món súp',
    nutritionInfo: { calories: 190, protein: 9, carbs: 32, fat: 3 },
    isPopular: true
  }
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

const testimonials = [
  {
    id: 1,
    name: "Thu Trang",
    role: "Huấn luyện viên Thể hình & Yoga",
    image: "/testimonials/profile1.jpg",
    content: "Thực đơn High-Protein của ChayFood giúp tôi duy trì cơ bắp hoàn hảo mà không cần bổ sung đạm động vật. Món ăn nêm nếm rất thanh và ngon."
  },
  {
    id: 2,
    name: "Minh Quân",
    role: "Quản lý Dự án Công nghệ",
    image: "/testimonials/profile2.jpg",
    content: "Là người bận rộn, dịch vụ giao bữa ăn đúng giờ của ChayFood là giải pháp cứu cánh. Chỉ số Calo rõ ràng giúp tôi kiểm soát cân nặng rất tốt."
  },
  {
    id: 3,
    name: "Ngọc Lan",
    role: "Bác sĩ Gia đình",
    image: "/testimonials/profile3.jpg",
    content: "Tôi đánh giá rất cao tính năng phân bổ dinh dưỡng Mifflin-St Jeor và mâm cơm gia đình đa thế hệ. Rất an tâm về chất lượng rau củ hữu cơ."
  }
]

const partners = [
  { id: 1, name: "Nông Trại Hữu Cơ Đà Lạt", logo: "/partners/partner1.png" },
  { id: 2, name: "Viện Dinh Dưỡng Thực Vật", logo: "/partners/partner2.png" },
  { id: 3, name: "Hệ Sinh Thái Xanh", logo: "/partners/partner3.png" },
]

export default function Home() {
  useRedirectByRole({ adminRedirect: '/admin' })
  const [popularDishes, setPopularDishes] = useState<PopularDish[]>(defaultDishes)
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  useEffect(() => {
    async function loadDishes() {
      try {
        const data = await analyticsService.getPopularDishes()
        if (Array.isArray(data) && data.length > 0) {
          setPopularDishes(data.slice(0, 3))
        }
      } catch {
        // Fallback
      }
    }
    loadDishes()
  }, [])

  const nextTestimonial = () => setTestimonialIdx((prev) => (prev + 1) % testimonials.length)
  const prevTestimonial = () => setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <main className="min-h-screen bg-[#FAFBF9]">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt="ChayFood Hero"
          fill
          className="object-cover brightness-[0.45]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#081C15]/90 via-[#081C15]/30 to-transparent" />
        
        <div className="relative z-10 container-custom text-center text-white py-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest text-[#FAFBF9] mb-6">
              Nền tảng ẩm thực thực vật chuẩn khoa học
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Kế hoạch bữa ăn dinh dưỡng cho lối sống tươi lành
            </h1>
            <p className="text-base sm:text-xl text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Trải nghiệm món chay chế biến tươi trong ngày từ nông trại hữu cơ, minh bạch chỉ số vi chất trên từng khẩu phần.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                href="/menu" 
                className="btn btn-action !px-8 !py-3.5 !text-sm !font-bold shadow-lg hover:shadow-xl"
              >
                Đặt Món Ngay
              </Link>
              <Link 
                href="/nutrition-planner" 
                className="btn btn-secondary !px-8 !py-3.5 !text-sm !font-semibold !bg-white/15 !text-white !border-white/30 hover:!bg-white/25 backdrop-blur-sm"
              >
                Tư Vấn Thể Trạng
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. HOW IT WORKS - 4 STEPS */}
      <section className="py-20 bg-white border-b border-[#E5E9E2]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-2 block">
              Trải nghiệm tiện lợi
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Quy Trình Đặt Bữa Ăn Dễ Dàng
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="food-card p-6 flex flex-col items-center text-center bg-[#FAFBF9]/60">
                <div className="w-12 h-12 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-lg mb-5 shadow-sm">
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE POPULAR DISHES */}
      <section className="py-20 bg-[#FAFBF9] border-b border-[#E5E9E2]">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-1 block">
                Món ăn bán chạy
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                Thực Đơn Tinh Tuyển Hôm Nay
              </h2>
            </div>
            <Link 
              href="/menu" 
              className="mt-3 md:mt-0 text-xs font-bold text-[#059669] hover:text-[#047857] inline-flex items-center gap-1"
            >
              Xem tất cả món ăn <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularDishes.map((dish, idx) => (
              <MenuItemCard
                key={dish.id || dish._id || idx}
                id={dish.id || dish._id || `dish-${idx}`}
                name={dish.name}
                description={dish.description || 'Món chay chế biến tươi trong ngày từ nguyên liệu sạch'}
                price={dish.price || dish.revenue || 75000}
                image={dish.image || '/meals/meal1.jpg'}
                category={dish.category || 'Món chính'}
                nutritionInfo={dish.nutritionInfo}
                isBestSeller={dish.isBestSeller}
                isPopular={dish.isPopular}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. NUTRI-PLANNER 2.0 CLINICAL SHOWCASE */}
      <section className="py-20 bg-white border-b border-[#E5E9E2]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-2 block">
                Công nghệ dinh dưỡng y khoa
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-4">
                Phòng Khám Dinh Dưỡng Nutri-Planner 2.0
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed mb-6">
                Tính toán chính xác năng lượng tiêu hao theo phương trình lâm sàng Mifflin-St Jeor, tự động phân bổ tỷ lệ đạm thực vật, carbs chậm và loại trừ các chất gây dị ứng giao thoa.
              </p>
              <div className="space-y-3 text-xs text-[#0F172A] mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#059669]" />
                  <span>Cá nhân hóa theo độ tuổi, giới tính và mục tiêu vóc dáng</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#059669]" />
                  <span>Chế độ ăn hỗ trợ đường huyết, tim mạch và giảm axit uric</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#059669]" />
                  <span>Mâm cơm gia đình đa thế hệ hài hòa khẩu vị mọi lứa tuổi</span>
                </div>
              </div>
              <Link 
                href="/nutrition-planner" 
                className="btn btn-action !px-6 !py-3 text-xs font-bold inline-flex items-center gap-2"
              >
                Trải Nghiệm Tính Phác Đồ Ngay
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-6 food-card p-6 bg-[#FAFBF9] border-2 border-[#1B4332]">
              <div className="flex items-center justify-between border-b border-[#E5E9E2] pb-3 mb-4">
                <span className="text-xs font-bold text-[#0F172A]">Mô phỏng phác đồ mẫu</span>
                <span className="badge-macro text-[10px]">Mifflin-St Jeor</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-white border border-[#E5E9E2]">
                  <p className="text-[10px] text-[#475569]">BMR (Chuyển hóa cơ bản)</p>
                  <p className="text-base font-bold text-[#0F172A] mt-0.5">1,420 Kcal</p>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E5E9E2]">
                  <p className="text-[10px] text-[#475569]">TDEE (Năng lượng tiêu hao)</p>
                  <p className="text-base font-bold text-[#0F172A] mt-0.5">1,950 Kcal</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-[#E5E9E2]">
                  <p className="text-[10px] text-[#2D6A4F] font-bold">Đạm Thực Vật</p>
                  <p className="text-base font-bold text-[#0F172A] mt-0.5">98g</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#E5E9E2]">
                  <p className="text-[10px] text-[#D97706] font-bold">Carbs Chậm</p>
                  <p className="text-base font-bold text-[#0F172A] mt-0.5">195g</p>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#E5E9E2]">
                  <p className="text-[10px] text-[#475569] font-bold">Chất Béo Tốt</p>
                  <p className="text-base font-bold text-[#0F172A] mt-0.5">43g</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUBSCRIPTION PLANS SHOWCASE */}
      <section className="py-20 bg-[#FAFBF9] border-b border-[#E5E9E2]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-1 block">
              Gói ăn định kỳ tiện lợi
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
              Duy Trì Lối Sống Lành Mạnh Mỗi Ngày
            </h2>
            <p className="text-[#475569] text-xs leading-relaxed">
              Tiết kiệm thời gian chuẩn bị bữa ăn, giao nóng tận cửa đúng khung giờ, đổi món linh hoạt không trùng lặp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="food-card p-6 flex flex-col bg-white">
              <span className="text-[11px] font-bold text-[#2D6A4F] uppercase tracking-wider mb-1">Thanh lọc thể trạng</span>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1">Gói Detox 7 Ngày</h3>
              <p className="text-xs text-[#475569] mb-4">Tối ưu chất xơ tự nhiên, thanh nhiệt cơ thể và cải thiện hệ vi sinh đường ruột.</p>
              <div className="text-2xl font-bold text-[#1B4332] mb-5">
                490.000₫ <span className="text-xs font-normal text-[#475569]">/ tuần</span>
              </div>
              <ul className="space-y-2 text-xs text-[#475569] mb-6">
                <li>• Giao nóng trước 11:30 sáng</li>
                <li>• Kèm nước ép thanh lọc rau má hữu cơ</li>
                <li>• Tạm dừng gói ăn linh hoạt</li>
              </ul>
              <Link href="/subscriptions" className="btn btn-secondary !w-full !text-xs !py-2.5 mt-auto">
                Đăng Ký Gói Ăn
              </Link>
            </div>

            <div className="food-card p-6 flex flex-col bg-white border-2 border-[#059669] shadow-md relative">
              <div className="absolute -top-2.5 right-5 bg-[#059669] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Phổ biến nhất
              </div>
              <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wider mb-1">Thể thao & Tăng cơ</span>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1">Gói High-Protein 30 Ngày</h3>
              <p className="text-xs text-[#475569] mb-4">Bổ sung 45g đạm thực vật sinh học mỗi ngày từ đậu nành hữu cơ, diêm mạch và nấm đông cô.</p>
              <div className="text-2xl font-bold text-[#1B4332] mb-5">
                1.950.000₫ <span className="text-xs font-normal text-[#475569]">/ tháng</span>
              </div>
              <ul className="space-y-2 text-xs text-[#475569] mb-6">
                <li>• Đạt chuẩn 45g Đạm mỗi ngày</li>
                <li>• Miễn phí vận chuyển toàn thành phố</li>
                <li>• Tùy chỉnh lịch ăn thứ 2 đến thứ 6</li>
              </ul>
              <Link href="/subscriptions" className="btn btn-action !w-full !text-xs !py-2.5 mt-auto">
                Chọn Gói Ăn Này
              </Link>
            </div>

            <div className="food-card p-6 flex flex-col bg-white">
              <span className="text-[11px] font-bold text-[#2D6A4F] uppercase tracking-wider mb-1">Mâm cơm gia đình</span>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1">Gói Hài Hòa 4 Thành Viên</h3>
              <p className="text-xs text-[#475569] mb-4">Mâm cơm ấm cúng 4 món gồm canh dưỡng nhan, món mặn xào nấm và rau luộc chấm kho quẹt chay.</p>
              <div className="text-2xl font-bold text-[#1B4332] mb-5">
                2.800.000₫ <span className="text-xs font-normal text-[#475569]">/ tháng</span>
              </div>
              <ul className="space-y-2 text-xs text-[#475569] mb-6">
                <li>• Khẩu phần chuẩn cho 4 người</li>
                <li>• Không sử dụng bột ngọt hay chất bảo quản</li>
                <li>• Tùy chọn giảm muối theo yêu cầu</li>
              </ul>
              <Link href="/subscriptions" className="btn btn-secondary !w-full !text-xs !py-2.5 mt-auto">
                Đăng Ký Mâm Cơm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ENVIRONMENTAL SUSTAINABILITY SECTION */}
      <section className="py-20 bg-white border-b border-[#E5E9E2]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-1 block">
              Trách nhiệm xanh
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">
              Chung Tay Bảo Vệ Môi Trường
            </h2>
            <p className="text-[#475569] text-xs leading-relaxed">
              Các sáng kiến thân thiện với môi trường nhằm giảm thiểu rác thải nhựa và khí thải carbon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="food-card p-6 bg-[#FAFBF9]/60">
              <h3 className="text-base font-bold text-[#0F172A] mb-2">Bao Bì Bã Mía Tự Nhiên</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Sử dụng 100% hộp bã mía và muỗng gỗ có thể phân hủy sinh học hoàn toàn trong môi trường đất.
              </p>
            </div>
            <div className="food-card p-6 bg-[#FAFBF9]/60">
              <h3 className="text-base font-bold text-[#0F172A] mb-2">Tối Ưu Tuyến Đường Giao Hàng</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Thuật toán định tuyến thông minh giúp gộp đơn theo cụm khu vực, cắt giảm 35% lượng khí thải vận chuyển.
              </p>
            </div>
            <div className="food-card p-6 bg-[#FAFBF9]/60">
              <h3 className="text-base font-bold text-[#0F172A] mb-2">Không Lãng Phí Thực Phẩm</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Quản lý kho nguyên liệu theo định lượng BOM chính xác, chế biến tươi vừa đủ theo số lượng đơn đặt trước.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS SLIDER */}
      <section className="py-20 bg-[#FAFBF9] border-b border-[#E5E9E2]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-1 block">
              Trải nghiệm thực tế
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Câu Chuyện Của Khách Hàng
            </h2>
          </div>

          <div className="relative max-w-3xl mx-auto food-card p-8 bg-white shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden relative flex-shrink-0 border-2 border-[#1B4332]">
                  <Image
                    src={testimonials[testimonialIdx].image}
                    alt={testimonials[testimonialIdx].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm text-[#0F172A] italic leading-relaxed mb-4">
                    &ldquo;{testimonials[testimonialIdx].content}&rdquo;
                  </p>
                  <h4 className="text-sm font-bold text-[#1B4332]">{testimonials[testimonialIdx].name}</h4>
                  <span className="text-xs text-[#475569]">{testimonials[testimonialIdx].role}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-[#E5E9E2]">
              <button
                type="button"
                onClick={prevTestimonial}
                className="p-2 rounded-full border border-[#E5E9E2] hover:bg-[#FAFBF9] text-[#475569]"
                aria-label="Previous testimonial"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium text-[#475569]">
                {testimonialIdx + 1} / {testimonials.length}
              </span>
              <button
                type="button"
                onClick={nextTestimonial}
                className="p-2 rounded-full border border-[#E5E9E2] hover:bg-[#FAFBF9] text-[#475569]"
                aria-label="Next testimonial"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PARTNERS SECTION */}
      <section className="py-16 bg-white border-b border-[#E5E9E2]">
        <div className="container-custom text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-2 block">
            Hợp tác bền vững
          </span>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-8">
            Đối Tác Nông Trại & Tổ Chức Dinh Dưỡng
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {partners.map((partner) => (
              <div key={partner.id} className="p-4 rounded-xl border border-[#E5E9E2] bg-[#FAFBF9] flex items-center justify-center text-xs font-semibold text-[#1B4332]">
                {partner.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CULINARY COMMITMENTS */}
      <section className="py-14 bg-[#081C15] text-[#FAFBF9]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <h4 className="text-base font-bold text-white mb-1.5">Nông Trại Hữu Cơ</h4>
              <p className="text-xs text-slate-300 leading-relaxed">Rau củ chuẩn VietGAP và hữu cơ thu hoạch trong ngày từ các nông trại liên kết.</p>
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1.5">Thuần Thực Vật Tươi Lành</h4>
              <p className="text-xs text-slate-300 leading-relaxed">Nói không với chất bảo quản, màu nhân tạo và hương liệu tổng hợp.</p>
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1.5">Minh Bạch Dinh Dưỡng</h4>
              <p className="text-xs text-slate-300 leading-relaxed">Đo lường định lượng Calo và Macros chuẩn xác trên từng khẩu phần.</p>
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1.5">Giao Nóng Tận Nơi</h4>
              <p className="text-xs text-slate-300 leading-relaxed">Đóng gói hộp bã mía thân thiện môi trường, giữ trọn hương vị và độ ấm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating AI Chat Agent */}
      <ChatAgent />
    </main>
  )
}