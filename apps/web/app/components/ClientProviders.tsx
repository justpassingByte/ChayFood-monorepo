'use client';

import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
import CartNotificationProvider from './CartNotificationProvider';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <CartNotificationProvider>
          {children}
          <Toaster
            position="top-right"
            gutter={10}
            containerStyle={{
              top: 76,
              right: 20,
            }}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.98)',
                color: '#0F172A',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                padding: '12px 18px',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                maxWidth: '420px',
                backdropFilter: 'blur(12px)',
              },
              success: {
                iconTheme: {
                  primary: '#059669',
                  secondary: '#ECFDF5',
                },
                style: {
                  border: '1px solid rgba(167, 243, 208, 0.9)',
                  background: 'rgba(236, 253, 245, 0.98)',
                  color: '#064E3B',
                },
              },
              error: {
                iconTheme: {
                  primary: '#E11D48',
                  secondary: '#FFF1F2',
                },
                style: {
                  border: '1px solid rgba(254, 205, 211, 0.9)',
                  background: 'rgba(255, 241, 242, 0.98)',
                  color: '#881337',
                },
              },
            }}
          />
        </CartNotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}