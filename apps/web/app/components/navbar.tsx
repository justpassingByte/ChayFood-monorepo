'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../context/AuthContext'
import AuthModal from './auth/AuthModal'
import { ShoppingBag, User, Users, Menu as MenuIcon, X, LogOut, Settings, Sparkles, BookOpen, Clock } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/menu', label: 'Thực đơn & Macro' },
  { href: '/nutrition-planner', label: 'Dinh dưỡng cá nhân' },
  { href: '/subscriptions', label: 'Gói ăn định kỳ' },
  { href: '/party', label: 'Đặt tiệc chay' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalView, setAuthModalView] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-header py-2.5 shadow-sm'
            : 'bg-white/90 backdrop-blur-md py-3.5 border-b border-slate-100'
        }`}
      >
        <div className="container-custom flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-[#2D6A4F] transition-colors">
              C
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
                ChayFood
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  NUTRI 2.0
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-wide hidden sm:block mt-0.5">
                Dinh Dưỡng Thực Vật Chuẩn Mực
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-800 to-teal-800 rounded-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* 🌟 Dynamic Swagger Docs URL: Tự động trỏ đúng cổng của API (4000/5000/Prod) thay vì hardcode */}
            <a
              href={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/api$/, '')}/api/docs`}
              target="_blank"
              rel="noreferrer"
              className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors"
              title="Tài liệu NestJS Swagger API"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              API Docs
            </a>



            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 transition-all"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center shadow"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </Link>

            {/* User Profile / Single Auth Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline line-clamp-1 max-w-[100px]">{user.name || 'Tài khoản'}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      {user.role?.toLowerCase() === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 font-bold text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors"
                        >
                          <Settings className="w-4 h-4 text-emerald-700" />
                          Cổng Quản Trị Viên
                        </Link>
                      )}

                      <Link
                        href="/account"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        Hồ sơ cá nhân
                      </Link>

                      <Link
                        href="/account/family"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 font-semibold text-emerald-900 hover:bg-emerald-50 rounded-xl transition-colors"
                      >
                        <Users className="w-4 h-4 text-emerald-700" />
                        Hồ sơ gia đình
                      </Link>

                      <Link
                        href="/account/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <Clock className="w-4 h-4 text-slate-500" />
                        Lịch sử đơn hàng
                      </Link>

                      <Link
                        href="/subscriptions"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Gói ăn định kỳ
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false)
                            logout()
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* SINGLE COMBINED AUTH BUTTON TO PREVENT NAVBAR STRETCHING */
              <button
                type="button"
                onClick={() => {
                  setAuthModalView('signin')
                  setShowAuthModal(true)
                }}
                className="btn-primary-gradient px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5" />
                <span>Đăng nhập / Đăng ký</span>
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl lg:hidden text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 py-4"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      pathname === link.href
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="http://localhost:5000/api/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl text-sm font-bold bg-teal-50 text-teal-800 border border-teal-200 mt-2"
                >
                  Tài Liệu NestJS Swagger API
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialView={authModalView}
      />
    </>
  )
}