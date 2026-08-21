'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Trash2, Edit3, ShieldCheck, ArrowRight, UserPlus, Heart } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Member {
  id: string
  name: string
  relation: string
  age: number
  gender: 'male' | 'female'
  targetCalories: number
  allergies: string[]
  healthConditions: string[]
  notes: string
}

const initialMembers: Member[] = [
  {
    id: 'fam-1',
    name: 'Nguyễn Văn Hùng',
    relation: 'Bố (Chủ hộ)',
    age: 42,
    gender: 'male',
    targetCalories: 2150,
    allergies: [],
    healthConditions: ['Mỡ máu nhẹ'],
    notes: 'Tập gym 3 buổi/tuần, cần tăng đạm thực vật',
  },
  {
    id: 'fam-2',
    name: 'Trần Thị Mai',
    relation: 'Mẹ',
    age: 39,
    gender: 'female',
    targetCalories: 1650,
    allergies: ['Đậu phộng'],
    healthConditions: [],
    notes: 'Ăn thanh đạm, kiểm soát tinh bột',
  },
  {
    id: 'fam-3',
    name: 'Nguyễn Minh Khang',
    relation: 'Con trai',
    age: 10,
    gender: 'male',
    targetCalories: 1500,
    allergies: ['Nấm mỡ'],
    healthConditions: [],
    notes: 'Bổ sung Canxi, thích món giòn béo bùi',
  },
]

export default function FamilyAccountPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    relation: 'Ông/Bà',
    age: 65,
    gender: 'female' as 'male' | 'female',
    targetCalories: 1550,
    allergies: '',
    healthConditions: '',
    notes: ''
  })

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMember.name) {
      toast.error('Vui lòng nhập tên thành viên')
      return
    }

    const member: Member = {
      id: `fam-${Date.now()}`,
      name: newMember.name,
      relation: newMember.relation,
      age: newMember.age,
      gender: newMember.gender,
      targetCalories: newMember.targetCalories,
      allergies: newMember.allergies ? newMember.allergies.split(',').map(s => s.trim()) : [],
      healthConditions: newMember.healthConditions ? newMember.healthConditions.split(',').map(s => s.trim()) : [],
      notes: newMember.notes,
    }

    setMembers([...members, member])
    setShowAddModal(false)
    setNewMember({
      name: '',
      relation: 'Ông/Bà',
      age: 65,
      gender: 'female',
      targetCalories: 1550,
      allergies: '',
      healthConditions: '',
      notes: ''
    })
    toast.success(`Đã thêm ${member.name} vào hồ sơ gia đình`)
  }

  const handleRemove = (id: string, name: string) => {
    setMembers(members.filter(m => m.id !== id))
    toast.success(`Đã xóa ${name}`)
  }

  const totalFamilyCalories = members.reduce((sum, m) => sum + m.targetCalories, 0)

  return (
    <div className="min-h-screen bg-[#FAFBF9] pb-24">
      {/* Top Banner - Compact & Standardized */}
      <section className="bg-slate-950 text-white py-4 sm:py-5 border-b border-slate-800">
        <div className="container-custom max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold uppercase mb-1.5">
              <Users className="w-3 h-3" />
              Tài Khoản Gia Đình Đa Thế Hệ
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Quản Lý Hồ Sơ Dinh Dưỡng Gia Đình
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 text-white shadow-md cursor-pointer self-start md:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Thêm Thành Viên</span>
          </button>
        </div>
      </section>

      <div className="container-custom max-w-4xl pt-5 space-y-6">
        {/* Family Summary Overview */}
        <div className="food-card p-6 bg-white border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <span className="text-xs font-bold text-emerald-800 block">Số Lượng Thành Viên</span>
            <div className="text-2xl font-extrabold text-emerald-950 font-mono mt-1">{members.length} người</div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80">
            <span className="text-xs font-bold text-blue-800 block">Tổng Nhu Cầu Năng Lượng</span>
            <div className="text-2xl font-extrabold text-blue-950 font-mono mt-1">{totalFamilyCalories} kcal / ngày</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-800 block">Thực Đơn Đa Thế Hệ</span>
              <span className="text-xs text-amber-900 mt-1 block">Tối ưu mâm cơm chung</span>
            </div>
            <Link
              href="/nutrition-planner"
              className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1 mt-2"
            >
              <span>Xem mâm cơm gợi ý</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Member List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Danh Sách Thành Viên ({members.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="food-card p-5 bg-white border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      {member.relation}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(member.id, member.name)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Xóa thành viên"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {member.age} tuổi • {member.gender === 'male' ? 'Nam' : 'Nữ'}
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{member.notes}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {member.allergies.map((all, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Dị ứng: {all}
                      </span>
                    ))}
                    {member.healthConditions.map((cond, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Thể trạng: {cond}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Mục tiêu:</span>
                  <span className="font-extrabold text-emerald-800 font-mono">{member.targetCalories} kcal</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Thêm Thành Viên Vào Gia Đình</h3>
              </div>

              <form onSubmit={handleAddMember} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={newMember.name}
                    onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Nguyễn Thị Lan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-900 block mb-1">Quan hệ gia đình</label>
                    <input
                      type="text"
                      value={newMember.relation}
                      onChange={e => setNewMember({ ...newMember, relation: e.target.value })}
                      placeholder="Bà ngoại, Bác..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-900 block mb-1">Tuổi</label>
                    <input
                      type="number"
                      value={newMember.age}
                      onChange={e => setNewMember({ ...newMember, age: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-900 block mb-1">Giới tính</label>
                    <select
                      value={newMember.gender}
                      onChange={e => setNewMember({ ...newMember, gender: e.target.value === 'male' ? 'male' : 'female' })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="female">Nữ</option>
                      <option value="male">Nam</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-900 block mb-1">Nhu cầu Calo dự kiến</label>
                    <input
                      type="number"
                      value={newMember.targetCalories}
                      onChange={e => setNewMember({ ...newMember, targetCalories: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Dị ứng (cách nhau bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={newMember.allergies}
                    onChange={e => setNewMember({ ...newMember, allergies: e.target.value })}
                    placeholder="Đậu phộng, Mè, Nấm..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Ghi chú khẩu vị & Bệnh lý</label>
                  <input
                    type="text"
                    value={newMember.notes}
                    onChange={e => setNewMember({ ...newMember, notes: e.target.value })}
                    placeholder="Ăn dưỡng sinh, giảm muối..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-gradient px-5 py-2 rounded-xl text-white font-bold shadow-sm cursor-pointer"
                  >
                    Lưu Thành Viên
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
