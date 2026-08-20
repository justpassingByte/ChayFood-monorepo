"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import ForgotPasswordForm from './ForgotPasswordForm'
import ResetPasswordForm from './ResetPasswordForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: 'signin' | 'signup' | 'forgotPassword' | 'resetPassword'
  resetToken?: string
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialView = 'signin',
  resetToken 
}: AuthModalProps) {
  const [view, setView] = useState<'signin' | 'signup' | 'forgotPassword' | 'resetPassword'>(initialView)
  
  useEffect(() => {
    if (isOpen) {
      setView(initialView)
    }
  }, [isOpen, initialView])
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscKey)
    }
    return () => {
      window.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onClose])
  
  useEffect(() => {
    const handleSwitchView = (e: Event) => {
      const customEvent = e as CustomEvent<'signin' | 'signup' | 'forgotPassword' | 'resetPassword'>
      setView(customEvent.detail)
    }
    window.addEventListener('switchAuthView', handleSwitchView as EventListener)
    return () => {
      window.removeEventListener('switchAuthView', handleSwitchView as EventListener)
    }
  }, [])
  
  const renderTitle = () => {
    switch (view) {
      case 'signin':
        return 'Đăng Nhập';
      case 'signup':
        return 'Đăng Ký Tài Khoản';
      case 'forgotPassword':
        return 'Khôi Phục Mật Khẩu';
      case 'resetPassword':
        return 'Đặt Lại Mật Khẩu';
      default:
        return 'Tài Khoản';
    }
  };

  const renderForm = () => {
    switch (view) {
      case 'signin':
        return <SignInForm onSuccess={onClose} />;
      case 'signup':
        return <SignUpForm onSuccess={() => setView('signin')} onSignInClick={() => setView('signin')} />;
      case 'forgotPassword':
        return <ForgotPasswordForm onClose={onClose} onToggleForm={() => setView('signin')} />;
      case 'resetPassword':
        return <ResetPasswordForm onClose={onClose} tokenFromProps={resetToken} />;
      default:
        return <SignInForm onSuccess={onClose} />;
    }
  };

  const showTabs = view === 'signin' || view === 'signup';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Decoration */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 px-6 pt-5 pb-4 text-white relative">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center font-bold text-sm">
                  C
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-tight flex items-center gap-1.5">
                    ChayFood
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      NUTRI 2.0
                    </span>
                  </h3>
                  <p className="text-[10px] text-emerald-200/80">
                    Ẩm Thực Thực Vật Chuẩn Dinh Dưỡng Khoa Học
                  </p>
                </div>
              </div>
            </div>

            {/* Header Tabs */}
            <div className="p-6 pb-2">
              {showTabs ? (
                <div className="flex bg-slate-100 p-1 rounded-2xl mb-2">
                  <button
                    type="button"
                    onClick={() => setView('signin')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      view === 'signin'
                        ? 'bg-white text-emerald-950 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Đăng Nhập
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setView('signup')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      view === 'signup'
                        ? 'bg-white text-emerald-950 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Đăng Ký
                  </button>
                </div>
              ) : (
                <div className="border-b border-slate-100 pb-3 mb-2">
                  <h2 className="text-base font-bold text-slate-900">{renderTitle()}</h2>
                </div>
              )}
            </div>
            
            {/* Modal Body Form */}
            <div className="px-6 pb-6 pt-0">
              {renderForm()}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}