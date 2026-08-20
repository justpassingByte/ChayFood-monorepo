"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Utensils, Users, Award, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, PhoneCall } from 'lucide-react'
import { toast } from 'react-hot-toast'

const partyPackages = [
  {
    id: 'party-1',
    title: 'Tiệc Buffet Chay Doanh Nghiệp',
    target: 'Dành Cho Hội Nghị & Công Ty',
    minGuests: 'Từ 30 khách trở lên',
    price: 195000,
    unit: 'khách',
    description: 'Thực đơn 15 món tự chọn phong phú từ khai vị, món chính giàu đạm thực vật đến trà thảo mộc tráng miệng.',
    features: [
      '15 Món ăn thuần thực vật chế biến tại chỗ',
      'Khu vực quầy line buffet chuẩn phong cách hiện đại',
      'Đầy đủ dụng cụ tiệc chén dĩa sứ và ly thủy tinh',
      'Nhân viên phục vụ chuyên nghiệp trong suốt buổi tiệc'
    ]
  },
  {
    id: 'party-2',
    title: 'Mâm Tiệc Chay Truyền Thống & Cưới Hỏi',
    target: 'Dành Cho Gia Đình & Lễ Tiệc',
    minGuests: 'Bàn 10 người',
    price: 2850000,
    unit: 'bàn',
    featured: true,
    description: 'Mâm cỗ 8 món thượng hạng phối hợp tinh tế giữa ẩm thực chay truyền thống và dưỡng sinh hiện đại.',
    features: [
      'Set 8 món thịnh soạn (Khai vị, Canh tiềm, Kho nấm, Cơm lá sen...)',
      'Bày trí mâm cỗ sang trọng trang nhã',
      'Tặng kèm 2 bình trà hoa cúc dưỡng nhan',
      'Đầu bếp chính nấu và trình bày tại tư gia'
    ]
  },
  {
    id: 'party-3',
    title: 'Tiệc Finger Food & Trà Dưỡng Nhan',
    target: 'Dành Cho Workshop & Ra Mắt Sản Phẩm',
    minGuests: 'Từ 20 khách trở lên',
    price: 150000,
    unit: 'khách',
    description: 'Các món ăn nhẹ finger-food tiện lợi kết hợp trà hoa quả tươi mát, phù hợp không gian giao lưu năng động.',
    features: [
      '8 Món bánh mặn ngọt finger-food tinh xảo',
      '2 Loại nước ép cold-pressed và trà thảo mộc',
      'Set up bàn tiệc phong cách châu Âu tối giản',
      'Dọn dẹp sạch sẽ sau sự kiện'
    ]
  }
]

export default function PartyPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    phone: '',
    email: '',
    guestCount: 30,
    partyType: 'Tiệc Buffet Chay Doanh Nghiệp',
    eventDate: '',
    eventLocation: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.phone || !formData.eventDate) {
      toast.error('Vui lòng điền họ tên, số điện thoại và ngày diễn ra sự kiện')
      return
    }

    try {
      setIsSubmitting(true)
      await new Promise(r => setTimeout(r, 1000))
      setIsSuccess(true)
      toast.success('Yêu cầu báo giá tiệc đã được tiếp nhận')
    } catch {
      toast.error('Không thể gửi yêu cầu')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBF9] pb-24">
      {/* 1. COMPACT & STANDARDIZED HEADER BANNER */}
      <section className="bg-slate-950 text-white py-4 sm:py-5 border-b border-slate-800">
        <div className="container-custom max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold uppercase mb-1.5">
              <Sparkles className="w-3 h-3" />
              Dịch Vụ Tiệc Chay Đẳng Cấp
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Đặt Tiệc Chay & Sự Kiện Trọn Gói
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-md md:text-right leading-relaxed">
            Nấu tươi tại chỗ, bài trí sang trọng cho tiệc gia đình, lễ cưới hỏi và hội nghị doanh nghiệp
          </p>
        </div>
      </section>

      {/* 2. 4 PILLARS OF EXCELLENCE */}
      <section className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="food-card p-5 bg-white border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
              <Utensils className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Nấu Tươi Tại Chỗ</h4>
            <p className="text-xs text-slate-500">Giữ trọn hương vị thơm nóng</p>
          </div>

          <div className="food-card p-5 bg-white border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mx-auto">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Phục Vụ Tận Tâm</h4>
            <p className="text-xs text-slate-500">Đội ngũ được đào tạo bài bản</p>
          </div>

          <div className="food-card p-5 bg-white border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Chuẩn Vệ Sinh ATTP</h4>
            <p className="text-xs text-slate-500">Nguyên liệu hữu cơ nguồn gốc rõ ràng</p>
          </div>

          <div className="food-card p-5 bg-white border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Trang Trí Sang Trọng</h4>
            <p className="text-xs text-slate-500">Gốm sứ cao cấp và hoa tươi</p>
          </div>
        </div>
      </section>

      {/* 3. PARTY PACKAGES */}
      <section className="container-custom pb-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Thực Đơn Tinh Tuyển
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gói Tiệc Chay Trọn Gói
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tùy biến món ăn linh hoạt theo sở thích và yêu cầu ăn kiêng của khách mời
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partyPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`food-card p-6 flex flex-col justify-between border-2 transition-all ${
                pkg.featured
                  ? 'border-emerald-700 bg-white shadow-xl lg:scale-105'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  pkg.featured ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {pkg.target}
                </span>

                <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1">{pkg.title}</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{pkg.description}</p>

                <div className="text-2xl font-extrabold text-emerald-800 font-mono mb-4">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.price)}
                  <span className="text-xs font-normal text-slate-500 font-sans ml-1">/ {pkg.unit}</span>
                </div>

                <div className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{pkg.minGuests}</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3 mb-6">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#booking-form"
                onClick={() => setFormData(prev => ({ ...prev, partyType: pkg.title }))}
                className={`w-full py-3 rounded-xl text-xs font-bold text-center block transition-all cursor-pointer ${
                  pkg.featured
                    ? 'btn-primary-gradient text-white shadow-sm'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                Chọn Gói Này
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BOOKING FORM */}
      <section id="booking-form" className="container-custom max-w-3xl">
        <div className="food-card p-6 sm:p-10 bg-white border border-slate-200 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
              Liên Hệ & Báo Giá
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Đăng Ký Tư Vấn & Nhận Thực Đơn Tiệc Mẫu
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Đội ngũ chuyên viên sự kiện ChayFood sẽ phản hồi trong vòng 30 phút.
            </p>
          </div>

          {isSuccess ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-950">Gửi Yêu Cầu Thành Công</h4>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                Chuyên viên tiệc ChayFood sẽ liên hệ lại qua số <strong>{formData.phone}</strong> để gửi thực đơn chi tiết và khảo sát địa điểm.
              </p>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="btn-secondary px-5 py-2 rounded-xl text-xs font-bold mt-2 cursor-pointer"
              >
                Gửi Yêu Cầu Khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Họ và tên quý khách *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0932 788 120"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Loại hình tiệc quan tâm</label>
                  <select
                    value={formData.partyType}
                    onChange={e => setFormData({ ...formData, partyType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="Tiệc Buffet Chay Doanh Nghiệp">Tiệc Buffet Chay Doanh Nghiệp</option>
                    <option value="Mâm Tiệc Chay Truyền Thống & Cưới Hỏi">Mâm Tiệc Chay Truyền Thống & Cưới Hỏi</option>
                    <option value="Tiệc Finger Food & Trà Dưỡng Nhan">Tiệc Finger Food & Trà Dưỡng Nhan</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Số lượng khách dự kiến</label>
                  <input
                    type="number"
                    min={10}
                    value={formData.guestCount}
                    onChange={e => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Ngày diễn ra sự kiện *</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Địa điểm tổ chức</label>
                  <input
                    type="text"
                    value={formData.eventLocation}
                    onChange={e => setFormData({ ...formData, eventLocation: e.target.value })}
                    placeholder="Quận/Huyện hoặc tên địa điểm..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Yêu cầu đặc biệt về món ăn hoặc trang trí</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Yêu cầu món thuần chay không ngũ vị tân, dị ứng đậu phộng, trang trí hoa sen..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary-gradient w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 text-white shadow-md cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi Yêu Cầu Báo Giá Trọn Gói'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}