"use client"

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, User, MessageCircle, X, Sparkles, Flame, ShieldAlert, Heart, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useCart } from '../../hooks/useCart'
import Link from 'next/link'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
})

interface Message {
  role: 'user' | 'assistant'
  content: string
  recommendation?: {
    name: string
    calories: number
    protein: number
    price: number
  }
}

interface ChatState {
  messages: Message[]
  chatId?: string
}

const quickChips = [
  { label: '🏋️ Giàu Đạm (Gym & Fit)', prompt: 'Gợi ý cho tôi các món chay giàu đạm (Protein ≥ 18g) cho người tập luyện' },
  { label: '🥗 Dưới 400 Kcal (Giảm mỡ)', prompt: 'Thực đơn chay dưới 400 kcal phù hợp mục tiêu giảm mỡ' },
  { label: '🩺 Kiểm Soát Đường Huyết', prompt: 'Món chay nào có chỉ số GI thấp cho người cần kiểm soát đường huyết?' },
  { label: '👨‍👩‍👧 Mâm Cơm Gia Đình', prompt: 'Tư vấn mâm cơm 4 món đủ đạm cho cả gia đình' },
]

export function ChatAgent() {
  const { addItem } = useCart()
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        role: 'assistant',
        content: 'Xin chào! Tôi là Chuyên Viên Dinh Dưỡng AI của ChayFood. Tôi có thể tư vấn khẩu phần Calo, Protein thực vật hoặc gợi ý mâm cơm theo thể trạng cho bạn.',
      }
    ]
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatState.messages, isLoading])

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: queryText }
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }))
    setInput('')
    setIsLoading(true)

    try {
      const { data } = await api.post('/chat', {
        message: queryText,
        chatId: chatState.chatId
      })

      setChatState(prev => ({
        chatId: data.chatId,
        messages: [...prev.messages, { role: 'assistant', content: data.message }]
      }))
    } catch {
      let fallbackText = 'ChayFood có hơn 45+ món thuần thực vật được định lượng dinh dưỡng chuẩn khoa học. Bạn có thể xem thực đơn chi tiết tại mục Thực đơn & Macro.'
      let recItem: Message['recommendation'] = undefined

      const lower = queryText.toLowerCase()
      if (lower.includes('đạm') || lower.includes('protein') || lower.includes('gym')) {
        fallbackText = 'Dành cho mục tiêu tăng cơ và thể thao, bạn nên chọn các món có lượng đạm cao trên 18g/khẩu phần từ các loại đậu hữu cơ và nấm.'
        recItem = {
          name: 'Cơm Tấm Sườn Chay Sốt Nấm Đông Cô',
          calories: 480,
          protein: 18.5,
          price: 65000,
        }
      } else if (lower.includes('giảm mỡ') || lower.includes('calo') || lower.includes('low-cal')) {
        fallbackText = 'Để giảm mỡ lành mạnh, bạn nên ưu tiên các món nhiều chất xơ hòa tan kết hợp hạt diêm mạch (Quinoa) hấp thu chậm.'
        recItem = {
          name: 'Salad Quinoa Bơ Sáp & Hạt Sen Huế',
          calories: 340,
          protein: 14.2,
          price: 75000,
        }
      } else if (lower.includes('tiểu đường') || lower.includes('đường') || lower.includes('gi')) {
        fallbackText = 'Đối với người cần kiểm soát đường huyết, ChayFood ưu tiên Gạo lứt huyết rồng, Đậu hũ non áp chảo và rau xanh hấp giữ nguyên vi chất.'
        recItem = {
          name: 'Đậu Hũ Non Áp Chảo Sốt Hạt Dẻ Cười',
          calories: 420,
          protein: 19.8,
          price: 68000,
        }
      } else if (lower.includes('gia đình') || lower.includes('mâm cơm')) {
        fallbackText = 'Mâm cơm gia đình cân bằng gồm 1 món kho đậm vị, 1 món xào tươi giòn, 1 canh dưỡng sinh thanh nhiệt và cơm gạo lứt mầm.'
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, { role: 'assistant', content: fallbackText, recommendation: recItem }]
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetChat = () => {
    setChatState({
      messages: [
        {
          role: 'assistant',
          content: 'Xin chào! Tôi là Chuyên Viên Dinh Dưỡng AI của ChayFood. Bạn đang tìm kiếm thực đơn theo mục tiêu nào?',
        }
      ]
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendQuery(input)
  }

  return (
    <>
      {/* Luxury Floating Chat Trigger Widget */}
      <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-2.5">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-emerald-300 text-xs font-bold text-slate-800 shadow-xl cursor-pointer hover:border-emerald-600 hover:shadow-2xl transition-all"
            onClick={() => setIsOpen(true)}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
            </span>
            <span>Tư Vấn Dinh Dưỡng AI</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-extrabold">2.0</span>
          </motion.div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-tr from-[#1B4332] via-[#2D6A4F] to-[#059669] text-white cursor-pointer flex items-center justify-center transition-all hover:scale-105 active:scale-95 ring-4 ring-emerald-600/20"
          aria-label="Mở Trợ lý Dinh Dưỡng AI"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <div className="relative">
              <Bot className="h-7 w-7 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-900" />
            </div>
          )}
        </button>
      </div>

      {/* Modern AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] h-[540px] rounded-3xl bg-white shadow-2xl border border-slate-200/90 z-[95] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] px-4 py-3.5 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-xs border border-white/20">
                  <Bot className="h-5 w-5 text-emerald-200" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-extrabold tracking-tight text-white leading-tight">
                      Bác Sĩ Dinh Dưỡng AI
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-800" />
                  </div>
                  <p className="text-[10px] text-emerald-200 font-medium">
                    Tư vấn Macro & Thực đơn thực vật chuẩn y khoa
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Làm mới đoạn hội thoại"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Đóng cửa sổ"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendQuery(chip.prompt)}
                  className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-700 hover:border-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 whitespace-nowrap transition-all shadow-2xs cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAFBF9]">
              {chatState.messages.map((message, index) => {
                const isAssistant = message.role === 'assistant'
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex items-start gap-2 text-xs",
                      isAssistant ? "flex-row" : "flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold",
                        isAssistant
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-[#1B4332] text-white"
                      )}
                    >
                      {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>

                    <div className="space-y-2 max-w-[82%]">
                      <div
                        className={cn(
                          "rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-2xs",
                          isAssistant
                            ? "bg-white text-slate-800 border border-slate-200/90"
                            : "bg-[#1B4332] text-white font-medium"
                        )}
                      >
                        {message.content}
                      </div>

                      {/* Embedded Dish Card if recommended */}
                      {message.recommendation && (
                        <div className="p-3 rounded-2xl bg-white border border-emerald-300 shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Món Ăn Khuyên Dùng
                            </span>
                            <span className="text-xs font-extrabold text-emerald-800 font-mono">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(message.recommendation.price)}
                            </span>
                          </div>

                          <h5 className="font-bold text-slate-900 text-xs">{message.recommendation.name}</h5>

                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                              🔥 {message.recommendation.calories} kcal
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                              💪 {message.recommendation.protein}g Đạm
                            </span>
                          </div>

                          <Link
                            href="/menu"
                            className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors block text-center"
                          >
                            <span>Xem Trong Thực Đơn</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi về Calo, Protein thực vật, dị ứng..."
                disabled={isLoading}
                className="flex-1 rounded-2xl border-slate-200 bg-slate-50 text-xs focus:bg-white focus-visible:ring-emerald-600"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-2xl btn-primary-gradient text-white disabled:opacity-50 transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}