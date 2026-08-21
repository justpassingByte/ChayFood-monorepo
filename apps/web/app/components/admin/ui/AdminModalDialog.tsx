'use client';

import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AdminModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  children: React.ReactNode;
  footerActions?: React.ReactNode;
}

export default function AdminModalDialog({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  maxWidth = '2xl',
  children,
  footerActions,
}: AdminModalDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full ${
          maxWidthClasses[maxWidth]
        } z-10 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-scaleUp`}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center font-bold flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">{title}</h2>
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Đóng cửa sổ"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs text-slate-700">
          {children}
        </div>

        {/* Modal Footer */}
        {footerActions && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end space-x-2.5">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
}
