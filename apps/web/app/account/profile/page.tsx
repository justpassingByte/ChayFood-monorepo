'use client';

import React, { useEffect, useState, FormEvent, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  User as UserIcon,
  MapPin,
  Heart,
  Plus,
  Save,
  Loader2,
  Sparkles,
  Flame,
  Dumbbell,
  Activity,
  Check,
  ArrowRight,
  Stethoscope,
  Info,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userService } from '../../lib/services/userService';
import { nutritionEngine } from '../../nutrition-planner/nutritionEngine';
import { HealthProfileForm, BiomarkerResult, ActivityLevel } from '../../nutrition-planner/types';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role?: string;
  picture?: string | null;
  preference?: {
    maxCalories?: number | null;
    minProtein?: number | null;
    dislikedIngredients?: string[];
    favoriteCategories?: string[];
    dietaryRestrictions?: string[];
  } | null;
}

interface Address {
  _id?: string;
  id?: string;
  name: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  phone: string;
  additionalInfo?: string;
  isDefault?: boolean;
}

const COMMON_ALLERGENS = [
  'Hành tỏi (Ngũ vị tân)',
  'Đậu phộng (Lạc)',
  'Đậu nành',
  'Gluten / Bột mì',
  'Ớt cay',
  'Nấm hương',
  'Hạt điều',
];

const DEFAULT_HEALTH_FORM: HealthProfileForm = {
  age: 28,
  gender: 'female',
  heightCm: 162,
  weightKg: 54,
  activityLevel: 'MODERATELY_ACTIVE',
  primaryGoal: 'fat_loss',
  medicalConditions: [],
  dietaryRestrictions: [],
  mealsPerDay: 3,
  dailyWaterLitres: 2,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [savingHealth, setSavingHealth] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressStr, setAddressStr] = useState('');

  // Personalization / Health Survey states
  const [healthForm, setHealthForm] = useState<HealthProfileForm>(DEFAULT_HEALTH_FORM);
  const [disliked, setDisliked] = useState<string[]>([]);

  // Address Modal states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [modalForm, setModalForm] = useState({
    name: 'Nhà riêng',
    street: '',
    city: 'TP. Hồ Chí Minh',
    phone: '',
    additionalInfo: '',
  });

  // Calculate real-time biomarkers
  const biomarkers: BiomarkerResult = useMemo(() => {
    return nutritionEngine.calculateBiomarkers(healthForm);
  }, [healthForm]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getProfile();
      const userData = res.data || res;
      setProfile(userData);
      setName(userData.name || '');
      setPhone(userData.phone || '');
      setAddressStr(userData.address || '');

      // Load saved health survey from localStorage if available
      const savedHealth = localStorage.getItem('chayfood_health_profile');
      if (savedHealth) {
        try {
          const parsed = JSON.parse(savedHealth) as HealthProfileForm;
          setHealthForm(parsed);
          if (parsed.dietaryRestrictions) {
            setDisliked(parsed.dietaryRestrictions);
          }
        } catch {
          // ignore
        }
      } else if (userData.preference) {
        if (userData.preference.dislikedIngredients) {
          setDisliked(userData.preference.dislikedIngredients);
        }
      }

      const addrRes = await userService.getAddresses();
      setAddresses(addrRes.data || addrRes || []);
    } catch {
      toast.error('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Lưu thông tin cá nhân cơ bản
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await userService.updateProfile({
        name,
        phone,
        address: addressStr,
      });
      toast.success('Cập nhật thông tin thành công');
      await fetchData();
    } catch {
      toast.error('Cập nhật thông tin thất bại');
    } finally {
      setSavingProfile(false);
    }
  };

  // Lưu phác đồ cá nhân hóa dinh dưỡng
  const handleSaveHealthProfile = async () => {
    try {
      setSavingHealth(true);
      const payloadForm: HealthProfileForm = {
        ...healthForm,
        dietaryRestrictions: disliked,
      };

      // 1. Lưu vào localStorage để đồng bộ với /nutrition-planner
      localStorage.setItem('chayfood_health_profile', JSON.stringify(payloadForm));

      // 2. Đồng bộ các chỉ số Macro đã tính toán vào Database Backend
      await userService.updatePreference({
        maxCalories: biomarkers.targetCalories,
        minProtein: biomarkers.targetProteinGrams,
        dislikedIngredients: disliked,
        dietaryRestrictions: [healthForm.primaryGoal, healthForm.gender, String(healthForm.activityLevel)],
      });

      toast.success('Đã lưu phác đồ cá nhân hóa dinh dưỡng');
    } catch {
      toast.error('Lưu phác đồ dinh dưỡng thất bại');
    } finally {
      setSavingHealth(false);
    }
  };

  const toggleAllergen = (item: string) => {
    setDisliked((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  // Thêm địa chỉ mới
  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    if (!modalForm.street.trim()) {
      toast.error('Vui lòng nhập địa chỉ cụ thể');
      return;
    }

    try {
      await userService.addAddress({
        name: modalForm.name,
        street: modalForm.street,
        city: modalForm.city,
        phone: modalForm.phone || phone,
        additionalInfo: modalForm.additionalInfo,
      });
      toast.success('Đã lưu địa chỉ giao hàng');
      setShowAddressModal(false);
      await fetchData();
    } catch {
      toast.error('Không thể lưu địa chỉ');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        <span className="text-xs text-slate-500 font-medium">Đang tải hồ sơ của bạn...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Personal Information Form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-950 tracking-tight">
                Thông Tin Cá Nhân
              </h2>
              <p className="text-[11px] text-slate-500">
                Thông tin dùng để liên hệ và xuất hóa đơn giao nhận
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Họ và tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-emerald-600"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0901234567"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Địa chỉ Email</label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-3.5 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
            >
              {savingProfile ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Lưu Thông Tin Cá Nhân</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Personalized Health & Clinical Nutrition Profile (CÁ NHÂN HÓA DINH DƯỠNG) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-950 tracking-tight">
                  Cá Nhân Hóa Thể Trạng & Dinh Dưỡng
                </h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Chuẩn WHO Châu Á
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Thuật toán lâm sàng tự động tính toán chỉ số BMI, TDEE và đề xuất khẩu phần dinh dưỡng tương thích
              </p>
            </div>
          </div>

          <Link
            href="/nutrition-planner"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tạo Thực Đơn Chi Tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Physical Survey Form */}
        <div className="space-y-4">
          {/* Gender */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">Giới tính sinh học</label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => setHealthForm({ ...healthForm, gender: 'female' })}
                className={`py-2 px-4 rounded-xl border text-center text-xs font-bold transition-all ${
                  healthForm.gender === 'female'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Nữ giới
              </button>
              <button
                type="button"
                onClick={() => setHealthForm({ ...healthForm, gender: 'male' })}
                className={`py-2 px-4 rounded-xl border text-center text-xs font-bold transition-all ${
                  healthForm.gender === 'male'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Nam giới
              </button>
            </div>
          </div>

          {/* Age, Height, Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tuổi</label>
              <input
                type="number"
                value={healthForm.age}
                onChange={(e) => setHealthForm({ ...healthForm, age: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                min={10}
                max={100}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Chiều cao (cm)</label>
              <input
                type="number"
                value={healthForm.heightCm}
                onChange={(e) => setHealthForm({ ...healthForm, heightCm: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                min={100}
                max={220}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Cân nặng (kg)</label>
              <input
                type="number"
                value={healthForm.weightKg}
                onChange={(e) => setHealthForm({ ...healthForm, weightKg: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                min={30}
                max={200}
              />
            </div>
          </div>

          {/* Activity Level & Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Mức độ vận động</label>
              <select
                value={healthForm.activityLevel}
                onChange={(e) => setHealthForm({ ...healthForm, activityLevel: e.target.value as ActivityLevel })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
              >
                <option value="SEDENTARY">Ít vận động (Ngồi văn phòng nhiều)</option>
                <option value="LIGHTLY_ACTIVE">Vận động nhẹ (Tập 1 - 3 ngày/tuần)</option>
                <option value="MODERATELY_ACTIVE">Vận động vừa (Tập 3 - 5 ngày/tuần)</option>
                <option value="VERY_ACTIVE">Vận động nặng (Tập 6 - 7 ngày/tuần)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Mục tiêu thể trạng</label>
              <select
                value={healthForm.primaryGoal}
                onChange={(e) => setHealthForm({ ...healthForm, primaryGoal: e.target.value as HealthProfileForm['primaryGoal'] })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
              >
                <option value="fat_loss">Thanh lọc giảm mỡ (Thâm hụt calo lành mạnh)</option>
                <option value="muscle_gain">Tăng cơ thể thao (Tăng cường đạm thực vật)</option>
                <option value="maintenance">Duy trì vóc dáng & Cân bằng chuyển hóa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Real-time Biomarker Summary Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Kết Quả Tính Toán Tự Động
              </span>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300">
              BMI: {biomarkers.bmi} ({biomarkers.bmiCategory})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Chuyển hóa cơ bản (BMR)</div>
              <div className="text-base font-black text-white mt-0.5">{biomarkers.bmr} <span className="text-[10px] font-normal text-slate-400">kcal</span></div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Tổng tiêu hao (TDEE)</div>
              <div className="text-base font-black text-white mt-0.5">{biomarkers.tdee} <span className="text-[10px] font-normal text-slate-400">kcal</span></div>
            </div>

            <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-700">
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Calo Mục Tiêu / Ngày</div>
              <div className="text-base font-black text-emerald-400 mt-0.5">{biomarkers.targetCalories} <span className="text-[10px] font-normal text-emerald-300">kcal</span></div>
            </div>

            <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-700">
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Đạm Thực Vật / Ngày</div>
              <div className="text-base font-black text-emerald-400 mt-0.5">{biomarkers.targetProteinGrams} <span className="text-[10px] font-normal text-emerald-300">g</span></div>
            </div>
          </div>

          {/* Macro breakdown */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1 border-t border-slate-800">
            <span>Tỉ lệ dưỡng chất:</span>
            <span className="text-slate-200 font-bold">
              Đạm (Protein): {biomarkers.targetProteinGrams}g | Tinh bột (Carbs): {biomarkers.targetCarbsGrams}g | Chất béo tốt (Fat): {biomarkers.targetFatGrams}g
            </span>
          </div>
        </div>

        {/* Allergens / Disliked ingredients */}
        <div className="space-y-2.5 pt-2">
          <label className="text-xs font-bold text-slate-900 block">
            Nguyên liệu kiêng / Dị ứng (Hệ thống tự động lọc món ăn và cảnh báo)
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_ALLERGENS.map((item) => {
              const isChecked = disliked.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAllergen(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    isChecked
                      ? 'bg-red-50 text-red-800 border-red-200 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-red-600" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chỉ số được đồng bộ xuyên suốt toàn bộ ứng dụng ChayFood</span>
          </div>

          <button
            type="button"
            onClick={handleSaveHealthProfile}
            disabled={savingHealth}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
          >
            {savingHealth ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Lưu Phác Đồ Cá Nhân Hóa</span>
          </button>
        </div>
      </div>

      {/* 3. Address Book */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-950 tracking-tight">
                Sổ Địa Chỉ Giao Hàng
              </h2>
              <p className="text-[11px] text-slate-500">
                Lưu sẵn các địa chỉ nhà riêng hoặc văn phòng để đặt món nhanh chóng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddressModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm địa chỉ</span>
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs space-y-1 font-medium">
            <p>Chưa có địa chỉ nào được lưu</p>
            <p className="text-[11px]">Bấm &quot;Thêm địa chỉ&quot; để thiết lập địa chỉ nhận hàng</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {addr.name || 'Địa chỉ'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Mặc định
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{addr.street}</p>
                {addr.phone && <p className="text-[11px] text-slate-400">SĐT: {addr.phone}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border shadow-lg space-y-4">
            <h3 className="text-base font-black text-slate-950">Thêm Địa Chỉ Giao Hàng</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tên gợi nhớ</label>
                <input
                  type="text"
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  placeholder="Ví dụ: Nhà riêng, Công ty"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Địa chỉ cụ thể</label>
                <input
                  type="text"
                  value={modalForm.street}
                  onChange={(e) => setModalForm({ ...modalForm, street: e.target.value })}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Ghi chú giao hàng</label>
                <input
                  type="text"
                  value={modalForm.additionalInfo}
                  onChange={(e) => setModalForm({ ...modalForm, additionalInfo: e.target.value })}
                  placeholder="Ví dụ: Giao cổng sau, gọi trước khi đến"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs"
                >
                  Lưu Địa Chỉ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}