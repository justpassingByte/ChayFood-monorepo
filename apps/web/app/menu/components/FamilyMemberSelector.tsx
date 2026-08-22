"use client"

import React, { useState, useEffect } from "react"
import { Users, Check, Sparkles, AlertCircle } from "lucide-react"

export interface FamilyMemberOption {
  id: string
  name: string
  relation: string
  healthGoal?: string
  dietaryNote?: string
}

interface FamilyMemberSelectorProps {
  selectedMemberId: string
  onSelectMember: (member: FamilyMemberOption) => void
  dishName: string
  dishCategory?: string
  isSpicy?: boolean
}

const defaultFamilyMembers: FamilyMemberOption[] = [
  { id: "self", name: "Bản thân", relation: "Tôi", healthGoal: "Cân đối năng lượng", dietaryNote: "Khẩu vị tiêu chuẩn" },
  { id: "mom", name: "Mẹ Lan", relation: "Mẹ", healthGoal: "Giảm đường & muối", dietaryNote: "Ưu tiên món thanh đạm, ít dầu" },
  { id: "dad", name: "Bố Hùng", relation: "Bố", healthGoal: "Tốt cho tim mạch", dietaryNote: "Hạn chế đồ cay nóng" },
  { id: "kid", name: "Bé An", relation: "Con gái", healthGoal: "Tăng cường đạm thực vật", dietaryNote: "Không hành cay, sốt ngọt dịu" },
]

export function FamilyMemberSelector({
  selectedMemberId,
  onSelectMember,
  dishName,
  isSpicy,
}: FamilyMemberSelectorProps) {
  const [members, setMembers] = useState<FamilyMemberOption[]>(defaultFamilyMembers)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("chayfood_family_group")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.members && Array.isArray(parsed.members) && parsed.members.length > 0) {
          const mapped: FamilyMemberOption[] = parsed.members.map((m: { id?: string; name: string; relation: string; activityLevel?: string; dietaryRestrictions?: string[] }) => ({
            id: m.id || m.name,
            name: m.name,
            relation: m.relation,
            healthGoal: m.activityLevel || "Dinh dưỡng cân bằng",
            dietaryNote: m.dietaryRestrictions?.join(", ") || "Khẩu vị chuẩn",
          }))
          setMembers([
            { id: "self", name: "Bản thân", relation: "Tôi", healthGoal: "Cân đối năng lượng", dietaryNote: "Khẩu vị tiêu chuẩn" },
            ...mapped,
          ])
        }
      }
    } catch {
      // Fallback
    }
  }, [])

  const currentMember = members.find((m) => m.id === selectedMemberId) || members[0]

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 mb-6">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Đặt khẩu phần này cho ai
            </h4>
            <p className="text-[11px] text-slate-500">
              Gán cho thành viên gia đình đã liên kết
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          Cá nhân hóa
        </span>
      </div>

      {/* Member Chips Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        {members.map((member) => {
          const isSelected = member.id === selectedMemberId
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onSelectMember(member)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-emerald-900 border-emerald-800 text-white shadow-sm ring-2 ring-emerald-500/30"
                  : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
            >
              <div className="truncate">
                <div className="text-xs font-bold truncate leading-tight">
                  {member.name}
                </div>
                <div
                  className={`text-[10px] truncate ${
                    isSelected ? "text-emerald-200" : "text-slate-400"
                  }`}
                >
                  {member.relation}
                </div>
              </div>
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 ml-1.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Smart Compatibility Insight */}
      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 text-xs">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-semibold text-slate-800">
            Khẩu phần của {currentMember.name}:
          </span>{" "}
          <span className="text-slate-600">
            {currentMember.dietaryNote ? `${currentMember.dietaryNote}. ` : ""}
            {dishName} giàu chất xơ tự nhiên, nhẹ bụng và dễ tiêu hóa
          </span>
          {isSpicy && currentMember.relation === "Con gái" && (
            <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-700 font-medium">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              Gợi ý: Món có chút vị cay nhẹ, bếp sẽ giảm ớt theo ghi chú của bé
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
