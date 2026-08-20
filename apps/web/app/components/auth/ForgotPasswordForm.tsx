'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Địa chỉ email không hợp lệ'),
});

interface ForgotPasswordFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
  onToggleForm?: () => void;
}

export default function ForgotPasswordForm({
  onClose,
  onSuccess,
  onToggleForm,
}: ForgotPasswordFormProps) {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await forgotPassword(values.email);
      if (result.success) {
        setSuccess('Đã gửi liên kết khôi phục vào hộp thư của bạn. Vui lòng kiểm tra email.');
        form.reset();
        if (onSuccess) onSuccess();
      } else {
        setError(result.message || 'Không thể gửi email khôi phục. Vui lòng thử lại');
      }
    } catch {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4 w-full text-xs">
      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fade-in">
          {error}
        </div>
      )}

      {success ? (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
          <p className="text-xs font-bold text-emerald-950">{success}</p>
          <button
            type="button"
            onClick={onToggleForm}
            className="btn-primary-gradient px-4 py-2 rounded-xl text-white font-bold inline-flex items-center gap-1.5 mt-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại đăng nhập</span>
          </button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
          <p className="text-slate-500 leading-relaxed">
            Nhập email đã đăng ký. Hệ thống sẽ gửi cho bạn liên kết đặt lại mật khẩu an toàn.
          </p>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="tenban@gmail.com"
                disabled={isLoading}
                {...form.register('email')}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-rose-600 text-[10px] mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary-gradient w-full py-3 rounded-2xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang gửi mã...</span>
              </>
            ) : (
              <span>Gửi Liên Kết Khôi Phục</span>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onToggleForm}
              className="text-[11px] font-bold text-slate-500 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại đăng nhập</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}