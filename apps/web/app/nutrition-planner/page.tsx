'use client'

import { useState, useEffect } from 'react'
import {
  HealthProfileForm,
  BiomarkerResult,
  DailyMealPlan,
  MealSlot
} from './types'
import { nutritionEngine } from './nutritionEngine'
import HealthProfileWizard from './components/HealthProfileWizard'
import BiomarkersDashboard from './components/BiomarkersDashboard'
import DailyMealPlanView from './components/DailyMealPlanView'
import FamilyMealPlannerView from './components/FamilyMealPlannerView'
import { menuService } from '../lib/services'
import { MenuItem } from '../lib/services/types'
import { useAuth } from '../context/AuthContext'
import api from '../lib/services/apiClient'
import { User, Users } from 'lucide-react'

const defaultProfile: HealthProfileForm = {
  age: 28,
  gender: 'female',
  heightCm: 162,
  weightKg: 54,
  activityLevel: 'MODERATELY_ACTIVE',
  primaryGoal: 'fat_loss',
  medicalConditions: [],
  dietaryRestrictions: [],
  mealsPerDay: 4,
  dailyWaterLitres: 2,
}

const fallbackMenuItems: MenuItem[] = [
  {
    _id: 'np-item-1',
    name: 'Cơm Tấm Sườn Chay Sốt Nấm Đông Cô',
    category: 'Món Chính',
    price: 65000,
    calories: 480,
    protein: 18.5,
    carbs: 62.0,
    fat: 9.2,
    image: '/images/hero-art.jpg',
    tags: ['Giàu Đạm', 'Không Ngũ Vị Tân'],
    allergens: [],
    dietaryRestrictions: ['vegan'],
    isPopular: true,
  },
  {
    _id: 'np-item-2',
    name: 'Salad Quinoa Bơ Sáp & Hạt Sen Huế',
    category: 'Salad',
    price: 75000,
    calories: 340,
    protein: 14.2,
    carbs: 45.0,
    fat: 11.5,
    image: '/images/hero-art.jpg',
    tags: ['Low-Calo', 'Giàu Chất Xơ'],
    allergens: [],
    dietaryRestrictions: ['vegan', 'gluten-free'],
    isPopular: true,
  },
  {
    _id: 'np-item-3',
    name: 'Đậu Hũ Non Áp Chảo Sốt Hạt Dẻ Cười',
    category: 'Món Chính',
    price: 68000,
    calories: 420,
    protein: 19.8,
    carbs: 38.0,
    fat: 12.0,
    image: '/images/hero-art.jpg',
    tags: ['Protein Cao', 'Keto Thân Thiện'],
    allergens: [],
    dietaryRestrictions: ['vegan'],
    isPopular: true,
  },
  {
    _id: 'np-item-4',
    name: 'Canh Rong Biển Đậu Hũ & Hạt Sen',
    category: 'Canh Dưỡng Sinh',
    price: 45000,
    calories: 180,
    protein: 8.5,
    carbs: 22.0,
    fat: 3.5,
    image: '/images/hero-art.jpg',
    tags: ['Thanh Nhiệt', 'Dưỡng Sinh'],
    allergens: [],
    dietaryRestrictions: ['vegan'],
    isPopular: false,
  }
]

export default function NutritionPlannerPage() {
  const { isAuthenticated } = useAuth()
  const [plannerMode, setPlannerMode] = useState<'individual' | 'family'>('individual')
  const [profile, setProfile] = useState<HealthProfileForm>(defaultProfile)
  const [biomarkers, setBiomarkers] = useState<BiomarkerResult | null>(null)
  const [mealPlan, setMealPlan] = useState<DailyMealPlan | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(fallbackMenuItems)
  const [isEditing, setIsEditing] = useState(true)
  const [loading, setLoading] = useState(false)

  // Load menu items & saved profile
  useEffect(() => {
    const initData = async () => {
      try {
        const timeoutPromise = new Promise<{ data?: MenuItem[] }>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 1500)
        )
        const res = await Promise.race([menuService.getAll(), timeoutPromise])
        const items = (Array.isArray(res?.data) ? res.data : fallbackMenuItems) || fallbackMenuItems
        if (items.length > 0) {
          setMenuItems(items)
        }

        // Check local storage for saved profile
        const saved = localStorage.getItem('chayfood_health_profile')
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as HealthProfileForm
            setProfile(parsed)
            const bio = nutritionEngine.calculateBiomarkers(parsed)
            setBiomarkers(bio)
            const plan = nutritionEngine.generateDailyMealPlan(parsed, bio, items.length > 0 ? items : fallbackMenuItems)
            setMealPlan(plan)
            setIsEditing(false)
          } catch {}
        }
      } catch {
        setMenuItems(fallbackMenuItems)
      } finally {
        setLoading(false)
      }
    }

    initData()
  }, [])

  const handleProfileComplete = async (completedData: HealthProfileForm) => {
    setProfile(completedData)
    localStorage.setItem('chayfood_health_profile', JSON.stringify(completedData))

    const bio = nutritionEngine.calculateBiomarkers(completedData)
    setBiomarkers(bio)

    const activeItems = menuItems.length > 0 ? menuItems : fallbackMenuItems
    const plan = nutritionEngine.generateDailyMealPlan(completedData, bio, activeItems)
    setMealPlan(plan)
    setIsEditing(false)

    // If authenticated, sync with backend preferences API
    if (isAuthenticated) {
      try {
        await api.put('/recommendations/preferences', {
          minProtein: bio.targetProteinGrams,
          maxCalories: bio.targetCalories,
          dietaryRestrictions: completedData.dietaryRestrictions,
          medicalConditions: completedData.medicalConditions,
        })
      } catch {}
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUpdateSlot = (slotId: MealSlot['slotId'], newItem: MenuItem) => {
    if (!mealPlan || !biomarkers) return
    const updatedSlots = mealPlan.slots.map(s => s.slotId === slotId ? { ...s, item: newItem } : s)
    const totalCalories = updatedSlots.reduce((sum, s) => sum + (s.item.calories || 350), 0)
    const totalProtein = updatedSlots.reduce((sum, s) => sum + Number(s.item.protein || 14), 0)
    const totalCarbs = updatedSlots.reduce((sum, s) => sum + Number(s.item.carbs || 50), 0)
    const totalFat = updatedSlots.reduce((sum, s) => sum + Number(s.item.fat || 10), 0)
    const calDiff = Math.abs(totalCalories - biomarkers.targetCalories)
    const matchScorePercentage = Math.max(75, Math.min(100, Math.round(100 - (calDiff / biomarkers.targetCalories) * 40)))

    setMealPlan({
      slots: updatedSlots,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      matchScorePercentage,
    })
  }

  const handleShuffleAll = () => {
    if (!biomarkers) return
    const activeItems = menuItems.length > 0 ? menuItems : fallbackMenuItems
    const plan = nutritionEngine.generateDailyMealPlan(profile, biomarkers, activeItems)
    setMealPlan(plan)
  }

  return (
    <div className="min-h-screen bg-[#FAFBF9] pb-24">
      {/* Top Banner - Compact & Standardized */}
      <section className="bg-slate-950 text-white py-4 sm:py-5 border-b border-slate-800">
        <div className="container-custom max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold uppercase mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Phòng Khám Dinh Dưỡng Thực Vật 2.0
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Kế Hoạch Dinh Dưỡng Cá Nhân Hóa
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-md md:text-right leading-relaxed">
            Phân tích thể trạng, bệnh lý nền và thiết kế thực đơn chuẩn xác từng gram Đạm và Calo
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container-custom max-w-4xl pt-6 space-y-6">
        {/* Mode Switcher Pills: Individual vs Family */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setPlannerMode('individual')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                plannerMode === 'individual'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Cá Nhân (1 Người)</span>
            </button>

            <button
              type="button"
              onClick={() => setPlannerMode('family')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                plannerMode === 'family'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Mâm Cơm Gia Đình (2 - 6 Người)</span>
            </button>
          </div>
        </div>

        {plannerMode === 'family' ? (
          <FamilyMealPlannerView />
        ) : loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Đang tải dữ liệu dinh dưỡng...</p>
          </div>
        ) : isEditing || !biomarkers || !mealPlan ? (
          <HealthProfileWizard
            initialData={profile}
            onComplete={handleProfileComplete}
          />
        ) : (
          <div className="space-y-10">
            <BiomarkersDashboard
              biomarkers={biomarkers}
              profile={profile}
              onReset={() => setIsEditing(true)}
            />

            <DailyMealPlanView
              plan={mealPlan}
              biomarkers={biomarkers}
              availableItems={menuItems}
              onUpdateSlot={handleUpdateSlot}
              onShuffleAll={handleShuffleAll}
            />
          </div>
        )}
      </div>
    </div>
  )
}
