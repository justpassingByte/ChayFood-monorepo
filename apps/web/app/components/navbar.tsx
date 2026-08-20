"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { UserIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../context/AuthContext'
import MobileNav from './MobileNav'
import AuthModal from './auth/AuthModal'

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/menu', label: 'Thực đơn' },
  { href: '/nutrition-planner', label: 'Dinh dưỡng cá nhân' },
  { href: '/subscriptions', label: 'Gói ăn định kỳ' },
  { href: '/party', label: 'Đặt tiệc chay' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout, isLoading, refreshAuthState } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const { totalItems } = useCart()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalView, setAuthModalView] = useState<'signin' | 'signup'>('signin')
  const [lastRefresh, setLastRefresh] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  useEffect(() => {
    const checkAuthState = async () => {
      const now = Date.now()
      if (isRefreshing || now - (lastRefresh ?? 0) < 5000) {
        return
      }
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      const shouldRefresh = token && !isAuthenticated && !isLoading
      
      if (shouldRefresh) {
        setIsRefreshing(true)
        await refreshAuthState()
        setLastRefresh(Date.now())
        setIsRefreshing(false)
      }
    }
    
    checkAuthState()
  }, [isAuthenticated, isLoading, refreshAuthState, lastRefresh, isRefreshing])
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-180 ${
          scrolled 
            ? 'glassmorphism border-b border-[#E5E9E2] shadow-sm py-2.5' 
            : 'bg-[#FAFBF9]/95 backdrop-blur-sm py-3.5 border-b border-[#E5E9E2]/60'
        }`}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Brand Logo - RULE-UI-001 */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#1B4332] flex items-center justify-center text-[#FFFFFF] shadow-sm group-hover:bg-[#2D6A4F] transition-colors">
              <span className="font-bold text-lg">C</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-[#0F172A] tracking-tight leading-none group-hover:text-[#1B4332] transition-colors">
                ChayFood
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#2D6A4F] mt-0.5">
                Precision Nutrition
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links - RULE-UI-003: No trailing dots */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors relative py-1 ${
                    isActive 
                      ? 'text-[#1B4332] font-bold' 
                      : 'text-[#475569] font-medium hover:text-[#0F172A]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#059669] rounded-full"
                      transition={{ duration: 0.18 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3.5">
            {/* Cart Button */}
            <Link
              href="/cart"
              aria-label="Giỏ hàng"
              className="relative p-2 rounded-xl text-[#1B4332] hover:bg-[#F3F6F2] transition-colors"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#059669] text-[#FFFFFF] text-[10px] font-bold flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-[#F3F6F2] transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1B4332] text-[#FFFFFF] font-semibold text-xs flex items-center justify-center">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-[#0F172A] max-w-[100px] truncate">
                    {user.name || 'Tài khoản'}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-[#E5E9E2] shadow-lg py-1.5 z-50 text-xs"
                    >
                      <div className="px-3.5 py-2 border-b border-[#E5E9E2]">
                        <p className="font-bold text-[#0F172A] truncate">{user.name}</p>
                        <p className="text-[11px] text-[#475569] truncate">{user.email}</p>
                      </div>
                      
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-3.5 py-2 font-semibold text-[#1B4332] hover:bg-[#F3F6F2]"
                        >
                          Cổng Quản Trị Viên
                        </Link>
                      )}

                      <Link
                        href="/account"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-3.5 py-2 text-[#475569] hover:bg-[#F3F6F2]"
                      >
                        Hồ sơ & Sổ địa chỉ
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-3.5 py-2 text-[#475569] hover:bg-[#F3F6F2]"
                      >
                        Lịch sử đơn hàng
                      </Link>

                      <div className="border-t border-[#E5E9E2] mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false)
                            logout()
                          }}
                          className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 font-medium"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalView('signin')
                    setShowAuthModal(true)
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#475569] hover:text-[#0F172A] transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalView('signup')
                    setShowAuthModal(true)
                  }}
                  className="btn btn-action !px-4 !py-1.5 !text-xs"
                >
                  Trải nghiệm
                </button>
              </div>
            )}

            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialView={authModalView}
      />
    </>
  )
}