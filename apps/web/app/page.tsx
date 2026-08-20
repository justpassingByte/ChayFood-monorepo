"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useRedirectByRole } from './hooks/useRedirectByRole'
import { analyticsService } from './services/analyticsService'
import { MenuItemCard } from './components/ui/menu-item-card'
import { ChatAgent } from './components/chat/chat-agent'

interface FeaturedDish {
  id?: string
  _id?: string
  name: string
  image?: string
  price?: number
  description?: string
  category?: string
  nutritionInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
  isPopular?: boolean
  isBestSeller?: boolean
}

const defaultDishes: FeaturedDish[] = [
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

export default function Home() {
  useRedirectByRole({ adminRedirect: '/admin' })
  const [popularDishes, setPopularDishes] = useState<FeaturedDish[]>(defaultDishes)

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

  return (
    <main className="min-h-screen pt-16 bg-[#FAFBF9]">
      {/* 1. HERO SECTION - RULE-UI-001 & RULE-UI-004 */}
      <section className="relative overflow-hidden py-14 lg:py-20 border-b border-[#E5E9E2]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              <div className="px-3 py-1 rounded-full bg-[#E5E9E2]/60 text-[#1B4332] text-xs font-semibold uppercase tracking-wider mb-5">
                Ẩm thực thực vật chuẩn dinh dưỡng khoa học
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] leading-[1.18] mb-5">
                Nuôi dưỡng thể trạng với từng khẩu phần thuần thực vật{' '}
                <span className="text-[#059669]">tươi lành</span>
              </h1>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl mb-7">
                Minh bạch chỉ số vi chất trên từng đĩa ăn. Thuật toán dinh dưỡng lâm sàng cá nhân hóa thực đơn theo mục tiêu thể lực, hỗ trợ điều hòa đường huyết và mâm cơm gia đình đa thế hệ.
              </p>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <Link 
                  href="/nutrition-planner" 
                  className="btn btn-action text-sm font-semibold flex items-center gap-2 !px-6 !py-3"
                >
                  Khám phá Dinh dưỡng Cá nhân
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link 
                  href="/menu" 
                  className="btn btn-secondary text-sm font-semibold !px-6 !py-3"
                >
                  Xem Thực Đơn Hôm Nay
                </Link>
              </div>

              {/* Trust Indicators - RULE-UI-004: Zero "mọi" / Zero "100%" */}
              <div className="grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-[#E5E9E2] w-full max-w-lg">
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-[#1B4332]">Thuần Khiết</span>
                  <span className="text-xs text-[#475569] mt-0.5">Thực vật tự nhiên</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-[#1B4332]">45+ Món</span>
                  <span className="text-xs text-[#475569] mt-0.5">Đổi vị mỗi ngày</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-[#1B4332]">4.9 Sao</span>
                  <span className="text-xs text-[#475569] mt-0.5">Khách hàng đánh giá</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-lg border border-[#E5E9E2] bg-white aspect-[4/5]">
                <Image
                  src="/hero-bg.jpg"
                  alt="Ẩm thực chay cao cấp ChayFood"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081C15]/75 via-transparent to-transparent" />
                
                {/* Floating Macro Highlight Card */}
                <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-xl glassmorphism border border-[#E5E9E2] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#0F172A]">Khẩu phần dinh dưỡng mẫu</span>
                    <span className="badge-macro text-[10px]">Cân đối 4 nhóm chất</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-1.5 rounded-lg bg-[#FAFBF9] border border-[#E5E9E2]">
                      <p className="font-bold text-[#1B4332]">24g</p>
                      <p className="text-[10px] text-[#475569]">Đạm thực vật</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#FAFBF9] border border-[#E5E9E2]">
                      <p className="font-bold text-[#1B4332]">48g</p>
                      <p className="text-[10px] text-[#475569]">Carbs chậm</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#FAFBF9] border border-[#E5E9E2]">
                      <p className="font-bold text-[#D97706]">380</p>
                      <p className="text-[10px] text-[#475569]">Kcal năng lượng</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. PRECISION CLINICAL NUTRITION HIGHLIGHT */}
      <section className="py-16 bg-white border-b border-[#E5E9E2]">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-2 block">
              Công nghệ dinh dưỡng khoa học
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">
              Phòng Khám Dinh Dưỡng Thực Vật Nutri-Planner
            </h2>
            <p className="text-[#475569] text-xs sm:text-sm leading-relaxed">
              Ứng dụng phương trình lâm sàng Mifflin-St Jeor và phác đồ dinh dưỡng y khoa để gợi ý thực đơn chuẩn xác cho từng thể trạng và mục tiêu sức khỏe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="food-card p-6 flex flex-col items-start bg-[#FAFBF9]/60">
              <h3 className="text-base font-bold text-[#0F172A] mb-2">
                Cá Nhân Hóa Năng Lượng BMR & TDEE
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed mb-4">
                Tính toán năng lượng tiêu hao theo thể trọng, độ tuổi và mức độ vận động, tự động cân bằng tỷ lệ đạm, chất xơ và chất béo tốt.
              </p>
              <Link 
                href="/nutrition-planner" 
                className="text-xs font-bold text-[#059669] hover:text-[#047857] inline-flex items-center gap-1 mt-auto"
              >
                Tính chỉ số cơ thể <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="food-card p-6 flex flex-col items-start bg-[#FAFBF9]/60 border-[#2D6A4F]/30">
              <h3 className="text-base font-bold text-[#0F172A] mb-2">
                Thực Đơn Theo Phác Đồ Bệnh Lý
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed mb-4">
                Chế độ ăn kiểm soát lượng đường huyết (Low GI), hỗ trợ tim mạch ít muối và loại bỏ các chất gây dị ứng giao thoa như gluten hay đậu phộng.
              </p>
              <Link 
                href="/nutrition-planner" 
                className="text-xs font-bold text-[#059669] hover:text-[#047857] inline-flex items-center gap-1 mt-auto"
              >
                Khám phá thực đơn trị liệu <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="food-card p-6 flex flex-col items-start bg-[#FAFBF9]/60">
              <h3 className="text-base font-bold text-[#0F172A] mb-2">
                Mâm Cơm Gia Đình Đa Thế Hệ
              </h3>
              <p className="text-xs text-[#475569] leading-relaxed mb-4">
                Giải quyết trọn vẹn bài toán ông bà ăn thanh đạm dưỡng sinh, bố mẹ giữ vóc dáng và trẻ nhỏ cần năng lượng phát triển trên cùng một bàn ăn.
              </p>
              <Link 
                href="/nutrition-planner" 
                className="text-xs font-bold text-[#059669] hover:text-[#047857] inline-flex items-center gap-1 mt-auto"
              >
                Lên mâm cơm gia đình <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE SEASONAL MENU HIGHLIGHTS */}
      <section className="py-16 bg-[#FAFBF9] border-b border-[#E5E9E2]">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-1 block">
                Thực đơn tươi lành hôm nay
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
                Món Chay Dinh Dưỡng Tinh Tuyển
              </h2>
            </div>
            <Link 
              href="/menu" 
              className="mt-3 md:mt-0 text-xs font-bold text-[#059669] hover:text-[#047857] inline-flex items-center gap-1"
            >
              Xem toàn bộ 45+ món ăn <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularDishes.map((dish, idx) => (
              <MenuItemCard
                key={dish.id || dish._id || idx}
                id={dish.id || dish._id || `dish-${idx}`}
                name={dish.name}
                description={dish.description || 'Món chay chế biến tươi trong ngày từ nguyên liệu sạch'}
                price={dish.price || 75000}
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

      {/* 4. SUBSCRIPTION PLANS SHOWCASE */}
      <section className="py-16 bg-white border-b border-[#E5E9E2]">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
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
            <div className="food-card p-6 flex flex-col bg-[#FAFBF9]/60">
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

            <div className="food-card p-6 flex flex-col bg-[#FAFBF9]/60">
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

      {/* 5. CULINARY STANDARDS & COMMITMENT - RULE-UI-002: Icon minimalism */}
      <section className="py-14 bg-[#081C15] text-[#FAFBF9]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <h4 className="text-base font-bold text-white mb-1.5">Nông Trại Hữu Cơ</h4>
              <p className="text-xs text-slate-300 leading-relaxed">Rau củ chuẩn VietGAP và hữu cơ thu hoạch trong ngày từ các nông trại liên kết.</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-base font-bold text-white mb-1.5">Thuần Thực Vật Tươi Lành</h4>
              <p className="text-xs text-slate-300 leading-relaxed">Nói không với chất bảo quản, màu nhân tạo và hương liệu tổng hợp.</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-base font-bold text-white mb-1.5">Minh Bạch Dinh Dưỡng</h4>
              <p className="text-xs text-slate-300 leading-relaxed">Đo lường định lượng Calo và Macros chuẩn xác trên từng khẩu phần.</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-base font-bold text-white mb-1.5">Giao Nóng Tận Nơi</h4>
              <p className="text-xs text-slate-300 leading-relaxed">Đóng gói hộp bã mía thân thiện môi trường, giữ trọn hương vị và độ ấm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Agent Floating Widget */}
      <ChatAgent />
    </main>
  )
}