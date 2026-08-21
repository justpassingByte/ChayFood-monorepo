'use client';

import { SparklesIcon, ChatBubbleLeftRightIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface ReviewItem {
  id: string;
  customerName: string;
  dishName: string;
  rating: number;
  comment: string;
  aiTag: string;
  sentiment: 'positive' | 'neutral' | 'suggestion';
  time: string;
}

const mockRecentReviews: ReviewItem[] = [
  {
    id: '1',
    customerName: 'Hoàng Minh Tuấn',
    dishName: 'Cơm Gạo Lứt Chả Nấm',
    rating: 5,
    comment: 'Chả nấm thơm bùi, vị đậm đà vừa vặn không bị dầu mỡ. Ăn xong nhẹ bụng rất thích.',
    aiTag: 'Khen vị đậm đà & Thanh đạm',
    sentiment: 'positive',
    time: '15 phút trước',
  },
  {
    id: '2',
    customerName: 'Nguyễn Thị Bích',
    dishName: 'Bún Riêu Thuần Chay',
    rating: 4,
    comment: 'Nước dùng chua thanh rất ngon, nếu quán giảm bớt ớt một chút cho các bé dễ ăn hơn thì tuyệt vời.',
    aiTag: 'Đề xuất gia giảm vị cay',
    sentiment: 'suggestion',
    time: '42 phút trước',
  },
  {
    id: '3',
    customerName: 'Trần Văn Nam',
    dishName: 'Gói Dinh Dưỡng Tuần',
    rating: 5,
    comment: 'Giao đúng 11h30 trưa mỗi ngày. Hộp giấy bã mía sạch sẽ, đồ ăn còn nóng hổi.',
    aiTag: 'Khen giao vận & Đóng gói xanh',
    sentiment: 'positive',
    time: '2 giờ trước',
  },
];

export default function AiReviewSentimentAnalytics() {
  return (
    <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 flex flex-col h-full hover:border-slate-700/80 transition-all duration-200">
      {/* Title with AI Sparkle badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
            <SparklesIcon className="w-4 h-4 text-emerald-100" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-wide">
              AI Phân Tích Cảm Xúc & Đánh Giá Khách Hàng
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hệ thống tự động phân loại cảm nhận thực khách và gợi ý tối ưu thực đơn
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          NLP Live Feed
        </span>
      </div>

      {/* AI Sentiment Distribution Bar */}
      <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 mb-5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-medium text-slate-300">Chỉ số Cảm xúc Thực khách</span>
          <span className="font-mono text-emerald-400 font-bold">88% Tích cực</span>
        </div>

        {/* Multi-segmented Sentiment Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-800 flex overflow-hidden">
          <div className="bg-emerald-500 h-full" style={{ width: '88%' }} title="Hài lòng (88%)" />
          <div className="bg-amber-400 h-full" style={{ width: '9%' }} title="Góp ý (9%)" />
          <div className="bg-rose-500 h-full" style={{ width: '3%' }} title="Cần cải thiện (3%)" />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Hài lòng (88%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Góp ý khẩu vị (9%)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Cần tối ưu (3%)</span>
          </div>
        </div>
      </div>

      {/* Real-time Customer Reviews Feed */}
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {mockRecentReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/70 hover:border-slate-700 transition-all text-xs"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-200">{rev.customerName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 font-medium">{rev.dishName}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{rev.time}</span>
            </div>

            <p className="text-slate-300 leading-relaxed mb-2.5 text-[11px]">
              &ldquo;{rev.comment}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              <span
                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                  rev.sentiment === 'positive'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                <ChatBubbleLeftRightIcon className="w-3 h-3" />
                <span>{rev.aiTag}</span>
              </span>

              <div className="flex text-amber-400 text-xs">
                {'★'.repeat(rev.rating)}
                {'☆'.repeat(5 - rev.rating)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Recipe Optimization Insights Box */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 flex items-start space-x-2.5">
        <LightBulbIcon className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <span className="font-semibold text-emerald-300">Gợi ý từ AI Đầu Bếp: </span>
          <span className="text-slate-300">
            Nên bổ sung tùy chọn <em>&ldquo;Không cay cho trẻ em&rdquo;</em> đối với món Bún Riêu
            Chay để tăng 15% tỷ lệ đặt lại từ nhóm khách hàng gia đình.
          </span>
        </div>
      </div>
    </div>
  );
}
