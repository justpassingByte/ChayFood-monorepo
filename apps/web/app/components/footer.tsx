'use client'

import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 mt-16">
      <div className="container-custom">
        {/* 4 Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800 mb-12">
          <div className="border-l-2 border-emerald-600 pl-4 py-1">
            <h4 className="text-sm font-bold text-slate-200">Thuần Thực Vật</h4>
            <p className="text-xs text-slate-500 mt-0.5">Nguyên liệu thực vật hữu cơ</p>
          </div>

          <div className="border-l-2 border-blue-600 pl-4 py-1">
            <h4 className="text-sm font-bold text-slate-200">Minh Bạch Macro</h4>
            <p className="text-xs text-slate-500 mt-0.5">Chuẩn Calo và Protein</p>
          </div>

          <div className="border-l-2 border-amber-600 pl-4 py-1">
            <h4 className="text-sm font-bold text-slate-200">Chuẩn Vệ Sinh ATTP</h4>
            <p className="text-xs text-slate-500 mt-0.5">Chứng nhận an toàn thực phẩm</p>
          </div>

          <div className="border-l-2 border-teal-600 pl-4 py-1">
            <h4 className="text-sm font-bold text-slate-200">Giao Tận Nơi</h4>
            <p className="text-xs text-slate-500 mt-0.5">Giữ trọn độ tươi nóng</p>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg">
                C
              </div>
              <span className="font-extrabold text-xl text-white">ChayFood</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Nền tảng ẩm thực chay và gói dinh dưỡng định kỳ theo mục tiêu sức khỏe thể hình và thanh lọc cơ thể.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <p>📍 TP. Hồ Chí Minh & Hà Nội</p>
              <p>📞 Hotline: 1900 6868 (8:00 - 21:00)</p>
              <p>✉️ support@chayfood.vn</p>
            </div>
          </div>

          {/* Menu Discovery */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Khám Phá Thực Đơn</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/menu" className="hover:text-emerald-400 transition-colors">Thực đơn Món Chính Giàu Đạm</Link></li>
              <li><Link href="/menu?category=side" className="hover:text-emerald-400 transition-colors">Món Phụ và Gỏi Khai Vị</Link></li>
              <li><Link href="/menu?category=beverage" className="hover:text-emerald-400 transition-colors">Trà Thảo Mộc Dưỡng Nhan</Link></li>
              <li><Link href="/subscriptions" className="hover:text-emerald-400 transition-colors">Gói Ăn Chay Tuần và Tháng</Link></li>
            </ul>
          </div>

          {/* Technical Architecture */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Hệ Thống Kỹ Thuật</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="http://localhost:5000/api/docs" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">NestJS Swagger API Documentation</a></li>
              <li><span className="text-slate-500">Frontend: Next.js 15 App Router</span></li>
              <li><span className="text-slate-500">Backend: NestJS 11 và PostgreSQL 16</span></li>
              <li><span className="text-slate-500">Monorepo: Turborepo và pnpm</span></li>
            </ul>
          </div>

          {/* Nutrition Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Bản Tin Dinh Dưỡng</h4>
            <p className="text-xs text-slate-400 mb-3">Nhận cẩm nang thực đơn chay cân bằng Macro miễn phí hàng tuần.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn..."
                className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 w-full"
              />
              <button type="submit" className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap text-white cursor-pointer">
                Đăng Ký
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 ChayFood Monorepo. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/faqs" className="hover:text-slate-300">Chính sách bảo mật</Link>
            <Link href="/faqs" className="hover:text-slate-300">Điều khoản dịch vụ</Link>
            <Link href="/faqs" className="hover:text-slate-300">Chứng nhận an toàn</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
