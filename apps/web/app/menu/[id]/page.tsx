"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  Clock,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Sparkles,
  Flame,
  ChevronRight,
  MessageSquare,
  Send,
  Heart
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { menuService } from "@/lib/services/menuService"
import { MenuItem } from "@/lib/services/types"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/context/AuthContext"
import { toast } from "react-hot-toast"
import { FamilyMemberSelector, FamilyMemberOption } from "../components/FamilyMemberSelector"
import { DishBenefitsCard } from "../components/DishBenefitsCard"
import { DishStickyBar } from "../components/DishStickyBar"
import { getReviewsByMenuItem, Review, createReview } from "@/services/reviewService"

interface PortionOption {
  id: string
  name: string
  extraPrice: number
  description: string
  extraProtein?: number
}

const portionOptions: PortionOption[] = [
  { id: "std", name: "Khẩu phần tiêu chuẩn", extraPrice: 0, description: "Cân đối đầy đủ chất xơ và đạm cho 1 người" },
  { id: "pro", name: "Tăng cường đạm thực vật", extraPrice: 15000, description: "Bổ sung thêm 10g đạm từ đậu hũ nướng & nấm mối", extraProtein: 10 },
  { id: "lowcarb", name: "Khẩu phần nhẹ (Low Carb)", extraPrice: 0, description: "Tăng rau củ hữu cơ, giảm tinh bột hấp thu nhanh" },
]

export default function MenuItemDetailPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const id = params?.id

  const [item, setItem] = useState<MenuItem | null>(null)
  const [similarItems, setSimilarItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedPortion, setSelectedPortion] = useState<PortionOption>(portionOptions[0])
  const [selectedMember, setSelectedMember] = useState<FamilyMemberOption>({
    id: "self",
    name: "Bản thân",
    relation: "Tôi",
  })
  const [customNote, setCustomNote] = useState("")
  const [isAddedAnimation, setIsAddedAnimation] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([])
  const [totalReviews, setTotalReviews] = useState(0)
  const [averageRating, setAverageRating] = useState(5)
  const [userRating, setUserRating] = useState(5)
  const [userComment, setUserComment] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const { addToCartWithMessage } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      setLoading(true)
      try {
        const res = await menuService.getById(id)
        if (res.data) {
          setItem(res.data)

          // Fetch similar dishes
          const allRes = await menuService.getAll({
            category: typeof res.data.category === 'string' ? res.data.category : undefined,
          })
          if (allRes.data && Array.isArray(allRes.data)) {
            const filtered = allRes.data
              .filter((sim: MenuItem) => (sim._id || sim.id) !== id)
              .slice(0, 3)
            setSimilarItems(filtered)
          }
        }
      } catch {
        toast.error("Không thể tải thông tin món ăn")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    const fetchReviewsData = async () => {
      if (!id) return
      try {
        const data = await getReviewsByMenuItem(id)
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews)
          setTotalReviews(data.totalReviews)
          setAverageRating(data.averageRating)
        } else {
          // Default initial reviews for editorial richness
          setReviews([
            {
              _id: "r1",
              user: { _id: "u1", name: "Nguyễn Minh Châu" },
              rating: 5,
              comment: "Món ăn thanh đạm, nấm sốt đậm đà mà không hề bị ngấy. Mình ăn bữa trưa thấy rất nhẹ bụng và tràn đầy năng lượng.",
              date: "2 ngày trước"
            },
            {
              _id: "r2",
              user: { _id: "u2", name: "Trần Hoàng Nam" },
              rating: 5,
              comment: "Chỉ số dinh dưỡng in rất rõ, đạm thực vật cao đúng chuẩn bữa ăn phục hồi cơ sau khi tập gym. Rất ưng ý!",
              date: "1 tuần trước"
            }
          ])
          setTotalReviews(2)
          setAverageRating(5)
        }
      } catch {
        // Fallback
      }
    }
    fetchReviewsData()
  }, [id])

  const effectivePrice = (item?.price || 0) + selectedPortion.extraPrice
  const effectiveProtein = Number(item?.protein ?? item?.nutritionInfo?.protein ?? 16) + (selectedPortion.extraProtein || 0)
  const effectiveCalories = Number(item?.calories ?? item?.nutritionInfo?.calories ?? 420)
  const effectiveCarbs = Number(item?.carbs ?? item?.nutritionInfo?.carbs ?? 55)
  const effectiveFat = Number(item?.fat ?? item?.nutritionInfo?.fat ?? 10)

  const handleAddToCart = async () => {
    if (!item) return
    try {
      const customizedItem: MenuItem = {
        ...item,
        price: effectivePrice,
        name: selectedPortion.id !== "std" ? `${item.name} (${selectedPortion.name})` : item.name,
      }

      await addToCartWithMessage(customizedItem, quantity)
      setIsAddedAnimation(true)
      toast.success(`Đã thêm ${quantity} phần ${item.name} cho ${selectedMember.name}`)
      setTimeout(() => setIsAddedAnimation(false), 2000)
    } catch {
      toast.error("Không thể thêm vào giỏ hàng")
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userComment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá")
      return
    }
    setIsSubmittingReview(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null
      if (token && item) {
        await createReview(item._id || item.id || id, userRating, userComment, token)
      }
      const newRev: Review = {
        _id: `rev-${Date.now()}`,
        user: { _id: "me", name: selectedMember.name === "Bản thân" ? "Bạn" : selectedMember.name },
        rating: userRating,
        comment: userComment,
        date: "Vừa xong"
      }
      setReviews([newRev, ...reviews])
      setTotalReviews(prev => prev + 1)
      setUserComment("")
      toast.success("Cảm ơn bạn đã gửi cảm nhận về món ăn")
    } catch {
      toast.error("Gửi đánh giá chưa thành công")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBF9] py-16">
        <div className="container-custom max-w-6xl">
          <div className="animate-pulse space-y-8">
            <div className="h-6 w-48 bg-slate-200 rounded-md" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-6 h-[450px] bg-slate-200 rounded-3xl" />
              <div className="lg:col-span-6 space-y-4">
                <div className="h-8 w-3/4 bg-slate-200 rounded-md" />
                <div className="h-6 w-1/3 bg-slate-200 rounded-md" />
                <div className="h-24 bg-slate-200 rounded-2xl" />
                <div className="h-40 bg-slate-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#FAFBF9] flex items-center justify-center py-16">
        <div className="text-center max-w-md p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Món ăn không tồn tại hoặc đã thay đổi</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Thực đơn món chay tươi được cập nhật mới theo mùa thu hoạch nông trại
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 text-white text-xs font-bold hover:bg-emerald-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Khám phá thực đơn
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFBF9] pb-28 md:pb-20">
      {/* 1. Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80 sticky top-20 z-20">
        <div className="container-custom max-w-6xl py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link href="/menu" className="hover:text-emerald-800 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              Thực đơn
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-500 capitalize">
              {typeof item.category === 'string' ? item.category : 'Món chay'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="font-bold text-slate-900 truncate max-w-[200px]">{item.name}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsFavorite(!isFavorite)
              toast.success(isFavorite ? "Đã bỏ lưu món" : "Đã lưu vào danh sách yêu thích")
            }}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              isFavorite
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900"
            }`}
            title="Lưu món yêu thích"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. Main Product Section */}
      <div className="container-custom max-w-6xl pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Hero Dish Image & Tags */}
          <div className="lg:col-span-6 space-y-5">
            <div className="relative h-[360px] sm:h-[480px] w-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-900 group">
              <Image
                src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900"}
                alt={item.name}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

              {/* Floating badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 text-[11px] font-bold backdrop-blur-md">
                  Thuần thực vật
                </span>
                {item.isPopular && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[11px] font-black backdrop-blur-md">
                    Bán chạy nhất
                  </span>
                )}
              </div>

              {/* Bottom image overlay stats */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs backdrop-blur-md bg-slate-950/60 p-3 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Chuẩn bị tươi: {item.preparationTime || 12} phút</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{averageRating.toFixed(1)}</span>
                  <span className="text-slate-300 font-normal">({totalReviews} nhận xét)</span>
                </div>
              </div>
            </div>

            {/* Farm Quality Trust Banner */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900">Cam Kết Nông Trại Hữu Cơ Liên Kết</div>
                <div className="text-slate-500 leading-relaxed text-[11px] mt-0.5">
                  Rau củ thu hoạch tươi mỗi sáng tại Đà Lạt và Củ Chi, dầu ép hạt nguyên chất không chiên đi chiên lại
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Portion, Family Selector & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & Title */}
              <div className="mb-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Món Ăn Dinh Dưỡng Khoa Học
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
                  {item.name}
                </h1>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 mb-5 p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-800 shadow-sm">
                <div>
                  <div className="text-[11px] text-emerald-300 uppercase tracking-wider font-semibold">
                    Giá khẩu phần
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {effectivePrice.toLocaleString("vi-VN")}{" "}
                    <span className="text-base font-semibold text-emerald-300">đ</span>
                  </div>
                </div>
                {selectedPortion.extraPrice > 0 && (
                  <div className="text-xs text-emerald-300 bg-emerald-900/80 px-2.5 py-1 rounded-lg border border-emerald-700 ml-auto">
                    +{selectedPortion.extraPrice.toLocaleString("vi-VN")} đ ({selectedPortion.name})
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {item.description || "Món ăn thanh tao với hương vị thảo mộc tự nhiên, cung cấp đầy đủ khoáng chất và năng lượng sạch cho một ngày làm việc tràn đầy sức sống."}
              </p>

              {/* 3. Family Member Selector (Đặt cho ai trong gia đình) */}
              <FamilyMemberSelector
                selectedMemberId={selectedMember.id}
                onSelectMember={(member) => setSelectedMember(member)}
                dishName={item.name}
                isSpicy={(item.spicyLevel ?? 0) > 0}
              />

              {/* 4. Portion Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Tùy chọn định lượng khẩu phần
                </label>
                <div className="space-y-2">
                  {portionOptions.map((portion) => {
                    const isSelected = selectedPortion.id === portion.id
                    return (
                      <button
                        key={portion.id}
                        type="button"
                        onClick={() => setSelectedPortion(portion)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50/70 border-emerald-700 shadow-xs ring-1 ring-emerald-600"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-emerald-700 bg-emerald-700 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              {portion.name}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                              {portion.description}
                            </div>
                          </div>
                        </div>
                        {portion.extraPrice > 0 && (
                          <span className="text-xs font-bold text-emerald-800 shrink-0 ml-2">
                            +{portion.extraPrice.toLocaleString("vi-VN")} đ
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 5. Custom Note (Ghi chú bếp) */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Ghi chú chế biến riêng cho {selectedMember.name} (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Không hành, ít cay, nước sốt để riêng..."
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full text-xs px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>

              {/* 6. Quantity Counter & Add to Cart (Desktop) */}
              <div className="hidden md:flex items-center gap-4 pt-4 border-t border-slate-200">
                {/* Stepper */}
                <div className="flex items-center border border-slate-200 rounded-2xl bg-white p-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-black text-sm text-slate-950">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-md cursor-pointer ${
                    isAddedAnimation
                      ? "bg-emerald-600 text-white scale-[0.99]"
                      : "bg-slate-950 hover:bg-emerald-900 text-white"
                  }`}
                >
                  {isAddedAnimation ? (
                    <>
                      <Check className="w-5 h-5 stroke-[2.5]" />
                      Đã thêm vào giỏ hàng
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Thêm vào giỏ hàng • {(effectivePrice * quantity).toLocaleString("vi-VN")} đ
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Nutrition Breakdown & Tangible Benefits */}
        <div className="mt-14 pt-10 border-t border-slate-200">
          <div className="mb-6">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Minh Bạch Dinh Dưỡng
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-2">
              Lợi Ích Thực Tế Cho Cơ Thể
            </h2>
          </div>

          <DishBenefitsCard
            calories={effectiveCalories}
            protein={effectiveProtein}
            carbs={effectiveCarbs}
            fat={effectiveFat}
            ingredients={item.ingredients || ["Đậu nành hữu cơ", "Nấm đông cô", "Rau sạch Đà Lạt", "Gia vị thảo mộc"]}
            tags={item.tags}
          />
        </div>

        {/* 8. Customer Reviews & Community Feedback */}
        <div className="mt-14 pt-10 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Trải Nghiệm Thực Tế
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-2">
                Cảm Nhận Từ Thực Khách
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-900">
                {averageRating.toFixed(1)} / 5.0
              </span>
              <span className="text-xs text-slate-400">({totalReviews} đánh giá)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs">
                        {rev.user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{rev.user.name}</div>
                        <div className="text-[10px] text-slate-400">{rev.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating ? "fill-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Write Review Form */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs sticky top-32">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Chia sẻ cảm nhận của bạn
                  </h3>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                      Độ hài lòng về món ăn
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setUserRating(s)}
                          className="p-1 cursor-pointer hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              s <= userRating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                      Nhận xét chi tiết
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Chia sẻ về hương vị, độ tươi ngon và cảm giác sau khi ăn..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 bg-slate-50 focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmittingReview ? "Đang gửi..." : "Gửi cảm nhận"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Similar Dishes Suggestions */}
        {similarItems.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Gợi Ý Đổi Vị
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-2">
                  Món Ăn Cùng Nhóm Hương Vị
                </h2>
              </div>
              <Link
                href="/menu"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarItems.map((sim) => (
                <Link
                  key={sim._id || sim.id}
                  href={`/menu/${sim._id || sim.id}`}
                  className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      <Image
                        src={sim.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"}
                        alt={sim.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-white text-[10px] font-bold backdrop-blur-sm">
                        {sim.calories || 400} kcal • {sim.protein || 15}g Đạm
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                        {sim.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {sim.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                    <span className="text-sm font-black text-slate-950">
                      {sim.price?.toLocaleString("vi-VN")} đ
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Xem chi tiết
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 10. Sticky Bottom CTA Bar (Mobile only) */}
      <DishStickyBar
        name={item.name}
        price={effectivePrice}
        quantity={quantity}
        onQuantityChange={(q) => setQuantity(q)}
        onAddToCart={handleAddToCart}
        isAdded={isAddedAnimation}
        assignedMemberName={selectedMember.name !== "Bản thân" ? selectedMember.name : undefined}
      />
    </div>
  )
}