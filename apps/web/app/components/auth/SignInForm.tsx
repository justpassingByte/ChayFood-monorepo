"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

type FormValues = {
  email: string
  password: string
}

interface SignInFormProps {
  onSuccess?: () => void
}

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: FormValues) {
    setError('')
    setIsLoading(true)

    try {
      const user = await login(values.email, values.password)

      if (user) {
        toast.success(`Chào mừng ${user.name || 'bạn'} trở lại`)
        if (onSuccess) onSuccess()
        const redirectPath = localStorage.getItem('redirectAfterAuth') || '/'
        localStorage.removeItem('redirectAfterAuth')
        router.push(redirectPath)
      } else {
        setError('Email hoặc mật khẩu không chính xác')
      }
    } catch {
      setError('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = (provider: string) => {
    setError('')
    setOauthLoading(provider)

    try {
      localStorage.setItem('redirectAfterAuth', window.location.pathname)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      window.location.href = `${apiUrl}/auth/${provider.toLowerCase()}`
    } catch {
      setError(`Không thể kết nối với dịch vụ ${provider}`)
      setOauthLoading(null)
    }
  }

  const switchToForgotPassword = () => {
    const event = new CustomEvent('switchAuthView', { detail: 'forgotPassword' })
    window.dispatchEvent(event)
  }

  return (
    <div className="space-y-4 w-full text-xs">
      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fade-in">
          {error}
        </div>
      )}

      {/* Google Quick Login Button */}
      <button
        type="button"
        onClick={() => handleOAuthLogin('google')}
        disabled={isLoading || oauthLoading !== null}
        className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
      >
        {oauthLoading === 'google' ? (
          <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>Tiếp tục với Google</span>
      </button>

      <div className="relative flex items-center justify-center my-2">
        <div className="border-t border-slate-100 w-full" />
        <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Hoặc email
        </span>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Email Field */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Địa chỉ Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="tenban@gmail.com"
              required
              disabled={isLoading}
              {...form.register('email', { required: true })}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-slate-700 font-bold">Mật khẩu</label>
            <button
              type="button"
              onClick={switchToForgotPassword}
              className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              disabled={isLoading}
              {...form.register('password', { required: true })}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary-gradient w-full py-3 rounded-2xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            <>
              <span>Đăng Nhập Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}