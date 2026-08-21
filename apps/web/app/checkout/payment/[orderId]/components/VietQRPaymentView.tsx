'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Copy, Check, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { paymentService } from '../../../../services/paymentService';
import { generateVietQRUrl, getDefaultBankConfig } from '../../../../lib/vietqr';
import { generateTransferContent } from '@chayfood/shared-types';

interface VietQRPaymentViewProps {
  orderId: string;
  orderNumber: string;
  sequenceNumber?: number;
  totalAmount: number;
  createdAt: string;
  onPaymentSuccess?: () => void;
}

export function VietQRPaymentView({
  orderId,
  orderNumber,
  sequenceNumber = 1,
  totalAmount,
  createdAt,
  onPaymentSuccess,
}: VietQRPaymentViewProps) {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // 15 phút
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const bankConfig = getDefaultBankConfig();

  const transferContent = generateTransferContent(
    new Date(createdAt || Date.now()),
    sequenceNumber,
  );

  const qrUrl = generateVietQRUrl(totalAmount, transferContent, bankConfig);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Countdown Timer (15 phút)
  useEffect(() => {
    const createdTime = new Date(createdAt).getTime();
    const expiryTime = createdTime + 15 * 60 * 1000;

    const timer = setInterval(() => {
      const now = Date.now();
      const remainingSeconds = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setTimeLeft(remainingSeconds);

      if (remainingSeconds <= 0) {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt]);

  // 2. Polling trạng thái thanh toán mỗi 3 giây
  useEffect(() => {
    if (isExpired) return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await paymentService.getPaymentStatus(orderId);
        if (res.paymentStatus === 'PAID') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          toast.success('Thanh toán thành công');
          if (onPaymentSuccess) {
            onPaymentSuccess();
          } else {
            router.push(`/order/success?orderId=${orderId}`);
          }
        }
      } catch (err) {
        // Polling silent catch
      }
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [orderId, isExpired, onPaymentSuccess, router]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Đã sao chép ${fieldName}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(totalAmount);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
      {/* Header & Expiry Alert */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Chuyển khoản VietQR tức thì
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Quét Mã QR Để Thanh Toán
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Mở ứng dụng ngân hàng bất kỳ để quét mã. Đơn hàng tự động xác nhận sau khi nhận tiền.
        </p>

        {/* Countdown Pill */}
        {!isExpired ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mt-2">
            <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span>Mã QR hết hạn sau: {formattedTime}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-900 border border-red-200 text-xs font-bold mt-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-700" />
            <span>Mã QR đã hết hạn thanh toán</span>
          </div>
        )}
      </div>

      {/* QR Code Display */}
      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="relative w-60 h-60 sm:w-64 sm:h-64 bg-white p-3 rounded-xl border shadow-xs">
          <Image
            src={qrUrl}
            alt="VietQR Code"
            fill
            className={`object-contain p-2 ${isExpired ? 'opacity-20 grayscale' : ''}`}
            unoptimized
          />
          {isExpired && (
            <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-red-600">
              Hết hạn thanh toán
            </div>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-medium">
          Hỗ trợ hơn 40+ ứng dụng ngân hàng và ví điện tử
        </p>
      </div>

      {/* Bank Details Table with 1-Click Copy */}
      <div className="space-y-3 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80 text-xs sm:text-sm">
        <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
          <span className="text-slate-500 font-medium">Ngân hàng</span>
          <span className="font-bold text-slate-900">BIDV (Ngân hàng Đầu tư và Phát triển)</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
          <span className="text-slate-500 font-medium">Chủ tài khoản</span>
          <span className="font-bold text-slate-900 uppercase">{bankConfig.accountName}</span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
          <span className="text-slate-500 font-medium">Số tài khoản</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-slate-950 text-sm sm:text-base">
              {bankConfig.accountNumber}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(bankConfig.accountNumber, 'Số tài khoản')}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition"
              title="Sao chép số tài khoản"
            >
              {copiedField === 'Số tài khoản' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
          <span className="text-slate-500 font-medium">Số tiền</span>
          <span className="font-black text-emerald-700 text-sm sm:text-base">
            {formattedAmount}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 bg-amber-50/80 -mx-2 px-3 rounded-xl border border-amber-200/60">
          <span className="text-amber-900 font-bold">Nội dung CK</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-amber-950 text-sm">
              {transferContent}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(transferContent, 'Nội dung chuyển khoản')}
              className="p-1.5 hover:bg-amber-200 rounded-lg text-amber-800 transition"
              title="Sao chép nội dung chuyển khoản"
            >
              {copiedField === 'Nội dung chuyển khoản' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Note Notice */}
      <div className="text-[11px] text-slate-500 leading-relaxed bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 flex items-start gap-2">
        <span className="font-bold text-blue-700 shrink-0">Lưu ý:</span>
        <span>
          Vui lòng giữ nguyên nội dung chuyển khoản <strong className="text-slate-800">{transferContent}</strong> để hệ thống nhận diện và kích hoạt đơn hàng tự động.
        </span>
      </div>
    </div>
  );
}
