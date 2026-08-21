export interface SeedPlanData {
  name: string;
  code: string;
  price: number;
  duration: number;
  description: string;
  mealsPerDay: number;
  snacksPerDay: number;
  features: string[];
  isRecommended: boolean;
  isPremiumMenu?: boolean;
  hasDietitianSupport?: boolean;
  hasCustomization?: boolean;
  hasPriorityDelivery?: boolean;
  has24HrSupport?: boolean;
  isFamilyPlan?: boolean;
  targetMembersCount?: number;
}

export const seedPlans: SeedPlanData[] = [
  {
    name: 'Gói Chay Thanh Tịnh Tuần',
    code: 'WEEKLY_CLEANSE',
    price: 350000,
    duration: 7,
    description: 'Gói 7 ngày thanh lọc cơ thể với các món chay thanh đạm, giàu chất xơ và vitamin khoáng chất tự nhiên.',
    mealsPerDay: 1,
    snacksPerDay: 1,
    features: ['1 Bữa chính/ngày', '1 Nước thảo mộc/ngày', 'Thực đơn đổi món mỗi ngày', 'Miễn phí giao hàng'],
    isRecommended: true,
    hasDietitianSupport: true,
  },
  {
    name: 'Gói Chay Năng Lượng Gym & Fit',
    code: 'HIGH_PROTEIN_FIT',
    price: 550000,
    duration: 7,
    description: 'Gói ăn chay giàu đạm thực vật từ đậu nành hữu cơ, nấm đùi gà, các loại hạt dinh dưỡng cho người năng động.',
    mealsPerDay: 2,
    snacksPerDay: 1,
    features: ['2 Bữa chính giàu đạm (>=25g đạm/bữa)', '1 Sinh tố hạt dinh dưỡng', 'Tư vấn chế độ ăn cùng chuyên gia'],
    isRecommended: false,
    isPremiumMenu: true,
    hasDietitianSupport: true,
    hasCustomization: true,
  },
  {
    name: 'Gói Chay Tháng Trọn Vẹn',
    code: 'MONTHLY_FULL_LIFE',
    price: 1350000,
    duration: 30,
    description: 'Chăm sóc sức khỏe toàn diện trong 30 ngày với đầy đủ các món cơm, lẩu, bún phở chay phong phú.',
    mealsPerDay: 1,
    snacksPerDay: 1,
    features: ['30 Bữa ăn chất lượng cao', 'Ưu tiên giờ giao hàng', 'Tặng kèm 4 set canh dưỡng sinh cuối tuần', 'Hỗ trợ đổi món linh hoạt'],
    isRecommended: false,
    hasPriorityDelivery: true,
    has24HrSupport: true,
  },
  {
    name: 'Gói Đôi An Lành (Gia Đình 2 Người)',
    code: 'PLAN_FAMILY_2',
    price: 1190000,
    duration: 7,
    description: 'Khẩu phần 2 người hoàn hảo cho các cặp đôi hoặc gia đình nhỏ, tiết kiệm 15% so với đặt lẻ.',
    mealsPerDay: 2,
    snacksPerDay: 0,
    isFamilyPlan: true,
    targetMembersCount: 2,
    features: ['2 Khẩu phần chính/ngày', 'Tiết kiệm 15% chi phí', 'Tự động trừ dị ứng chéo', 'Đổi món mỗi ngày'],
    isRecommended: false,
  },
  {
    name: 'Mâm Cơm Tam Đại Đồng Đường (Gia Đình 4 Người)',
    code: 'PLAN_FAMILY_4',
    price: 2290000,
    duration: 7,
    description: 'Mâm cơm 4 người đa thế hệ, tối ưu chỉ số dinh dưỡng cho cả ông bà, bố mẹ và con nhỏ, tiết kiệm 20%.',
    mealsPerDay: 4,
    snacksPerDay: 0,
    isFamilyPlan: true,
    targetMembersCount: 4,
    features: ['4 Khẩu phần chính/ngày', 'Tiết kiệm 20% chi phí', 'Thực đơn hài hòa huyết áp & đường huyết', 'Tư vấn dinh dưỡng định kỳ'],
    isRecommended: true,
    hasDietitianSupport: true,
  },
  {
    name: 'Gói Đại Gia Đình Đầm Ấm (Gia Đình 6 Người)',
    code: 'PLAN_FAMILY_6',
    price: 3290000,
    duration: 7,
    description: 'Mâm cơm đại gia đình 6 người với đầy đủ các món kho, xào, canh, tráng miệng thịnh soạn, tiết kiệm 25%.',
    mealsPerDay: 6,
    snacksPerDay: 0,
    isFamilyPlan: true,
    targetMembersCount: 6,
    features: ['6 Khẩu phần chính/ngày', 'Tiết kiệm 25% chi phí', 'Tùy biến định lượng theo từng thành viên', 'Ưu tiên giờ giao nóng'],
    isRecommended: false,
    hasPriorityDelivery: true,
    hasDietitianSupport: true,
  },
];
