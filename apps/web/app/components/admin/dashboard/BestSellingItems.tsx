'use client';

interface BestSellerDish {
  id: string;
  name: string;
  category: string;
  salesCount: number;
  revenue: number;
  percentage: number;
  imageUrl: string;
}

const mockBestSellers: BestSellerDish[] = [
  {
    id: '1',
    name: 'Cơm Gạo Lứt Chả Nấm Đậu Hũ',
    category: 'Gói Chuẩn Macro',
    salesCount: 342,
    revenue: 29070000,
    percentage: 28,
    imageUrl: '🍚',
  },
  {
    id: '2',
    name: 'Bún Riêu Thuần Chay Dưỡng Sinh',
    category: 'Món Nước Thanh Nhiệt',
    salesCount: 286,
    revenue: 21450000,
    percentage: 22,
    imageUrl: '🍜',
  },
  {
    id: '3',
    name: 'Salad Quinoa Bơ Sáp Hạt Điều',
    category: 'Eat Clean Ít Calo',
    salesCount: 215,
    revenue: 19350000,
    percentage: 18,
    imageUrl: '🥗',
  },
  {
    id: '4',
    name: 'Phở Nấm Hương Đậu Hũ Non',
    category: 'Món Nước Thanh Nhiệt',
    salesCount: 178,
    revenue: 14240000,
    percentage: 14,
    imageUrl: '🍲',
  },
  {
    id: '5',
    name: 'Cà Rốt & Bí Đỏ Hầm Nấm Đông Cô',
    category: 'Gói Chăm Sóc Gia Đình',
    salesCount: 134,
    revenue: 12060000,
    percentage: 10,
    imageUrl: '🥘',
  },
];

export default function BestSellingItems() {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 flex flex-col h-full hover:border-slate-700/80 transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-white tracking-wide">
            Top Món Chay Bán Chạy Nhất
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Xếp hạng theo số lượng phần ăn đã phục vụ
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          5 Món dẫn đầu
        </span>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {mockBestSellers.map((dish, index) => (
          <div
            key={dish.id}
            className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/70 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3 min-w-0">
                {/* Ranking Badge */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                    index === 0
                      ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20'
                      : index === 1
                      ? 'bg-slate-300 text-slate-900'
                      : index === 2
                      ? 'bg-amber-700 text-amber-100'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{index + 1}
                </div>

                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">
                  {dish.imageUrl}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                    {dish.name}
                  </p>
                  <span className="text-[11px] text-slate-400">{dish.category}</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0 pl-2">
                <span className="text-xs font-bold font-mono text-slate-200">
                  {dish.salesCount}{' '}
                  <span className="text-[10px] font-normal text-slate-400">phần</span>
                </span>
                <p className="text-[11px] font-mono text-emerald-400 font-semibold">
                  {formatCurrency(dish.revenue)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${dish.percentage * 3.2}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}