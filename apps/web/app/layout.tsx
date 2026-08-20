'use client'

import './globals.css'
import Navbar from './components/navbar'
import ClientProviders from './components/ClientProviders'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="bg-pearl-100 text-charcoal-950 font-sans antialiased min-h-screen flex flex-col selection:bg-saffron-200 selection:text-sage-950">
        <ClientProviders>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <footer className="bg-charcoal-950 text-pearl-200 border-t border-charcoal-800 pt-16 pb-12 mt-20">
            <div className="container-custom">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                {/* Brand Column */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-saffron-500 text-charcoal-950 flex items-center justify-center font-serif font-bold text-lg">
                      C
                    </div>
                    <span className="font-serif font-bold text-2xl text-pearl-50">ChayFood</span>
                  </div>
                  <p className="text-xs text-pearl-400 leading-relaxed mb-4">
                    Nền tảng ẩm thực thực vật chuẩn dinh dưỡng khoa học, minh bạch chỉ số vi chất và đồng hành cùng sức khỏe gia đình Việt.
                  </p>
                  <p className="text-xs text-pearl-400">Hotline: (+84) 932 788 120</p>
                  <p className="text-xs text-pearl-400">Email: info@chayfood.vn</p>
                </div>

                {/* Navigation Links */}
                <div>
                  <h3 className="font-serif font-bold text-base text-pearl-50 mb-4">Khám Phá Dịch Vụ</h3>
                  <ul className="space-y-2.5 text-xs text-pearl-400">
                    <li><a href="/menu" className="hover:text-saffron-400 transition-colors">Thực Đơn 45+ Món Chay</a></li>
                    <li><a href="/nutrition-planner" className="hover:text-saffron-400 transition-colors">Phòng Khám Dinh Dưỡng Nutri-Planner</a></li>
                    <li><a href="/subscriptions" className="hover:text-saffron-400 transition-colors">Gói Ăn Định Kỳ Cá Nhân Hóa</a></li>
                    <li><a href="/party" className="hover:text-saffron-400 transition-colors">Dịch Vụ Đặt Tiệc Chay Trọn Gói</a></li>
                  </ul>
                </div>

                {/* Policies */}
                <div>
                  <h3 className="font-serif font-bold text-base text-pearl-50 mb-4">Quy Định & Cam Kết</h3>
                  <ul className="space-y-2.5 text-xs text-pearl-400">
                    <li><a href="/faqs" className="hover:text-saffron-400 transition-colors">Chính Sách Nguồn Gốc Hữu Cơ</a></li>
                    <li><a href="/faqs" className="hover:text-saffron-400 transition-colors">Quy Trình Giao Nóng Đúng Giờ</a></li>
                    <li><a href="/faqs" className="hover:text-saffron-400 transition-colors">Bảo Mật Dữ Liệu Sức Khỏe</a></li>
                    <li><a href="/faqs" className="hover:text-saffron-400 transition-colors">Chính Sách Đổi Trả Đơn Hàng</a></li>
                  </ul>
                </div>

                {/* Newsletter */}
                <div>
                  <h3 className="font-serif font-bold text-base text-pearl-50 mb-4">Bản Tin Dinh Dưỡng</h3>
                  <p className="text-xs text-pearl-400 leading-relaxed mb-4">
                    Nhận các bài viết chuyên sâu về dinh dưỡng thực vật và cẩm nang ẩm thực dưỡng sinh hàng tuần.
                  </p>
                  <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="px-3.5 py-2 text-xs rounded-full bg-charcoal-900 border border-charcoal-700 text-pearl-100 focus:outline-none focus:border-saffron-500 flex-1 placeholder:text-pearl-500"
                    />
                    <button
                      type="submit"
                      className="btn btn-accent !px-4 !py-2 !text-xs"
                    >
                      Đăng ký
                    </button>
                  </form>
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="pt-8 border-t border-charcoal-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-pearl-500 gap-4">
                <p>© 2026 ChayFood Nutri-Tech. Ẩm thực thực vật chuẩn khoa học.</p>
                <p className="flex items-center gap-4">
                  <a href="/faqs" className="hover:text-pearl-300">Điều khoản</a>
                  <span>•</span>
                  <a href="/faqs" className="hover:text-pearl-300">Bảo mật</a>
                  <span>•</span>
                  <a href="/faqs" className="hover:text-pearl-300">Hỗ trợ khách hàng</a>
                </p>
              </div>
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  )
}