import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/navbar'
import Footer from './components/footer'
import ClientProviders from './components/ClientProviders'
import { ChatAgent } from './components/chat/chat-agent'

export const metadata: Metadata = {
  title: 'ChayFood - Ẩm Thực Chay Dinh Dưỡng Khoa Học',
  description: 'Nền tảng ẩm thực chay và gói ăn định kỳ chuẩn Macro Calo và Protein thực vật. Thực phẩm hữu cơ tươi sạch giao tận nơi mỗi ngày.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAFBF9] text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <ClientProviders>
          {/* Main Top Navigation */}
          <Navbar />

          {/* Page Content with sleek top clearance */}
          <main className="flex-1 pt-16">
            {children}
          </main>

          {/* Luxury Editorial Footer */}
          <Footer />

          {/* AI Chat Agent */}
          <ChatAgent />
        </ClientProviders>
      </body>
    </html>
  )
}