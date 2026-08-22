'use client';

import { useState } from 'react';
import { Cog8ToothIcon, TruckIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'ChayFood Culinary Enterprise',
    storeEmail: 'contact@chayfood.vn',
    phoneNumber: '(+84) 932 788 120',
    address: '33 Đường 14, KDC Bình Hưng, TP. Hồ Chí Minh',
    currency: 'VND',
    language: 'vi',
  });

  const [deliverySettings, setDeliverySettings] = useState({
    minimumOrder: 100000,
    deliveryFee: 15000,
    freeDeliveryThreshold: 300000,
    maxDeliveryDistance: 10,
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã lưu cài đặt thông tin thương hiệu');
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã cập nhật chính sách giao hàng');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200/80">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
          <Cog8ToothIcon className="w-6 h-6 text-emerald-600" />
          <span>Cài Đặt Hệ Thống & Tham Số Vận Hành</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Quản lý thông tin thương hiệu, chính sách giao vận và cấu hình thanh toán
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <BuildingStorefrontIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Thông Tin Thương Hiệu</h2>
          </div>

          <form onSubmit={handleGeneralSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Tên thương hiệu</label>
              <input
                type="text"
                value={generalSettings.storeName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, storeName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email liên hệ</label>
                <input
                  type="email"
                  value={generalSettings.storeEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, storeEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Số hotline hỗ trợ</label>
                <input
                  type="tel"
                  value={generalSettings.phoneNumber}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Địa chỉ bếp trung tâm</label>
              <textarea
                value={generalSettings.address}
                onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Đơn vị tiền tệ</label>
                <select
                  value={generalSettings.currency}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                >
                  <option value="VND">VND (₫)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Ngôn ngữ mặc định</label>
                <select
                  value={generalSettings.language}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                >
                  <option value="vi">Tiếng Việt (Mặc định)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-xs"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </div>

        {/* Delivery Settings Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <TruckIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Chính Sách Vận Chuyển</h2>
          </div>

          <form onSubmit={handleDeliverySubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Giá trị đơn tối thiểu (₫)
              </label>
              <input
                type="number"
                value={deliverySettings.minimumOrder}
                onChange={(e) =>
                  setDeliverySettings({ ...deliverySettings, minimumOrder: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Phí giao hàng tiêu chuẩn (₫)</label>
              <input
                type="number"
                value={deliverySettings.deliveryFee}
                onChange={(e) =>
                  setDeliverySettings({ ...deliverySettings, deliveryFee: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Miễn phí giao hàng cho đơn từ (₫)
              </label>
              <input
                type="number"
                value={deliverySettings.freeDeliveryThreshold}
                onChange={(e) =>
                  setDeliverySettings({
                    ...deliverySettings,
                    freeDeliveryThreshold: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Bán kính phục vụ tối đa (km)
              </label>
              <input
                type="number"
                value={deliverySettings.maxDeliveryDistance}
                onChange={(e) =>
                  setDeliverySettings({
                    ...deliverySettings,
                    maxDeliveryDistance: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-xs"
              >
                Cập Nhật Chính Sách Giao Hàng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}