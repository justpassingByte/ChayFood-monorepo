'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Check, User, Phone, Home } from 'lucide-react';

export interface AddressFormData {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  additionalInfo: string;
}

export interface SavedAddress {
  _id: string;
  name?: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  phone: string;
  additionalInfo?: string;
  isDefault?: boolean;
}

interface CheckoutAddressSectionProps {
  savedAddresses: SavedAddress[];
  selectedAddressId: string;
  onSelectSavedAddress: (id: string) => void;
  customAddress: AddressFormData;
  onChangeCustomAddress: (data: AddressFormData) => void;
  isUsingCustomAddress: boolean;
  onToggleCustomAddress: (useCustom: boolean) => void;
}

export function CheckoutAddressSection({
  savedAddresses,
  selectedAddressId,
  onSelectSavedAddress,
  customAddress,
  onChangeCustomAddress,
  isUsingCustomAddress,
  onToggleCustomAddress,
}: CheckoutAddressSectionProps) {
  const hasSavedAddresses = savedAddresses.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-xs border border-emerald-200/80">
            1
          </div>
          <div>
            <h2 className="text-base font-black text-slate-950 tracking-tight">
              Địa Chỉ Nhận Hàng
            </h2>
            <p className="text-[11px] text-slate-500">
              Vui lòng cung cấp địa chỉ chính xác để đầu bếp và shipper giao nóng
            </p>
          </div>
        </div>

        {hasSavedAddresses && (
          <button
            type="button"
            onClick={() => onToggleCustomAddress(!isUsingCustomAddress)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer transition-colors"
          >
            {isUsingCustomAddress ? 'Chọn địa chỉ đã lưu' : '+ Nhập địa chỉ khác'}
          </button>
        )}
      </div>

      {/* 1. Saved Addresses Selection (if available and not using custom) */}
      {hasSavedAddresses && !isUsingCustomAddress ? (
        <div className="space-y-2.5 pt-2">
          {savedAddresses.map((addr) => {
            const isSelected = selectedAddressId === addr._id;
            return (
              <div
                key={addr._id}
                onClick={() => onSelectSavedAddress(addr._id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-950">
                        {addr.name || 'Người nhận'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        • {addr.phone}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {addr.street}, {addr.city}
                    </div>
                    {addr.additionalInfo && (
                      <div className="text-[11px] text-slate-400 italic mt-0.5">
                        Ghi chú: {addr.additionalInfo}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 2. Direct Address Input Form */
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tên người nhận
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={customAddress.recipientName}
                  onChange={(e) =>
                    onChangeCustomAddress({ ...customAddress, recipientName: e.target.value })
                  }
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Số điện thoại nhận hàng
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  placeholder="Ví dụ: 0912 345 678"
                  value={customAddress.phone}
                  onChange={(e) =>
                    onChangeCustomAddress({ ...customAddress, phone: e.target.value })
                  }
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Số nhà, tên đường, tòa nhà
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ví dụ: Tòa Landmark 81, 720A Điện Biên Phủ"
                  value={customAddress.street}
                  onChange={(e) =>
                    onChangeCustomAddress({ ...customAddress, street: e.target.value })
                  }
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Quận / Huyện, Thành phố
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ví dụ: Quận 1, TP.HCM"
                  value={customAddress.city}
                  onChange={(e) =>
                    onChangeCustomAddress({ ...customAddress, city: e.target.value })
                  }
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Chi tiết phụ (Tầng, phòng, số căn hộ)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Căn hộ A12-04, bấm chuông cửa"
              value={customAddress.additionalInfo}
              onChange={(e) =>
                onChangeCustomAddress({ ...customAddress, additionalInfo: e.target.value })
              }
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
