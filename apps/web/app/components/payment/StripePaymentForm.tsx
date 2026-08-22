'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { getStripe } from '../../lib/stripe';
import { paymentService } from '../../services/paymentService';
import api from '@/lib/services/apiClient';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';


interface StripePaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CardForm = ({ orderId, amount, onSuccess, onCancel }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const intentData = await paymentService.createPaymentIntent(orderId);

      if (intentData.redirectUrl) {
        window.location.href = intentData.redirectUrl;
        return;
      }

      // If clientSecret was returned for Elements flow
      const clientSecret = intentData.clientSecret;
      if (!clientSecret) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/order/success?orderId=${orderId}`);
        }
        return;
      }

      // Confirm the payment with Stripe.js
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: 'ChayFood Customer',
          },
        },
      });

      if (result.error) {
        // Show error to customer
        const msg = result.error.message || 'Thanh toán không thành công';
        setErrorMessage(msg);
        toast.error(msg);
      } else if (result.paymentIntent.status === 'succeeded') {
        // 🌟 Xác nhận thanh toán qua API Client với token tự động
        const confirmResponse = await api.post(`/payment/confirm/${orderId}`, {
          paymentIntentId: result.paymentIntent.id,
        });

        if (confirmResponse.status === 200 || confirmResponse.data) {
          toast.success('Thanh toán đơn hàng thành công');
          
          if (onSuccess) {
            onSuccess();
          } else {
            router.push(`/order/success?orderId=${orderId}`);
          }
        } else {
          setErrorMessage('Đã thanh toán nhưng chưa cập nhật được trạng thái đơn hàng');
          toast.error('Đã thanh toán nhưng chưa cập nhật được trạng thái đơn hàng');
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Đã có lỗi xảy ra khi xử lý thanh toán');
        toast.error(error.message || 'Đã có lỗi xảy ra khi xử lý thanh toán');
      } else {
        setErrorMessage('Đã có lỗi xảy ra khi xử lý thanh toán');
        toast.error('Đã có lỗi xảy ra khi xử lý thanh toán');
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Thanh toán đơn hàng</h2>
        <p className="text-gray-600">Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}</p>
      </div>
      
      <div className="p-4 border rounded-md bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}

      <div className="flex gap-3 justify-end mt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Đang xử lý...' : 'Thanh toán ngay'}
        </Button>
      </div>
    </form>
  );
};

export const StripePaymentForm = ({ orderId, amount, onSuccess, onCancel }: StripePaymentFormProps) => {
  const stripePromise = getStripe();

  return (
    <Elements stripe={stripePromise}>
      <CardForm 
        orderId={orderId} 
        amount={amount} 
        onSuccess={onSuccess} 
        onCancel={onCancel}
      />
    </Elements>
  );
}; 