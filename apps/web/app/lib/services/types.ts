export interface MenuItem {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  category: 'main' | 'side' | 'dessert' | 'beverage' | string;
  image: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  isAvailable?: boolean;
  preparationTime?: number;
  ingredients?: string[];
  allergens?: string[];
  tags?: string[];
  isPopular?: boolean;
  isSignature?: boolean;
  dietaryRestrictions?: string[];
  isVegetarian?: boolean;
  spicyLevel?: number;
}

export interface OrderItem {
  item?: string | MenuItem;
  menuItem?: string | MenuItem;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Order {
  _id: string;
  id?: string;
  user: string | User;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED' | string;
  deliveryAddress: {
    street: string;
    ward?: string;
    district?: string;
    city: string;
    state?: string;
    postalCode?: string;
    additionalInfo?: string;
    phone?: string;
  };
  paymentMethod: 'CASH' | 'CARD' | 'MOMO' | 'ZALOPAY' | string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | string;
  deliveryTime?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  items: Array<{
    item?: string;
    menuItem?: string;
    quantity: number;
    price?: number;
    specialInstructions?: string;
  }>;
  totalAmount?: number;
  deliveryAddress: {
    street: string;
    ward?: string;
    district?: string;
    city: string;
    state?: string;
    postalCode?: string;
    additionalInfo?: string;
    phone?: string;
  };
  paymentMethod: string;
  specialInstructions?: string;
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN' | 'CHEF' | 'DELIVERY' | 'user' | 'admin' | string;
  address?: {
    street: string;
    ward?: string;
    district?: string;
    city: string;
    state?: string;
    postalCode?: string;
    phone?: string;
  };
  preferences?: {
    dietaryRestrictions: string[];
    favoriteCategories: string[];
    spicyPreference: number;
    allergens: string[];
  };
  healthProfile?: {
    dailyCalorieTarget?: number;
    proteinTarget?: number;
    carbTarget?: number;
    fatTarget?: number;
    primaryGoal?: string;
  };
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  joinDate?: string;
  address?: {
    street: string;
    ward?: string;
    district?: string;
    city: string;
    state?: string;
    postalCode?: string;
    phone?: string;
  };
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Promotion {
  _id: string;
  id?: string;
  code: string;
  name?: string;
  title?: string;
  description: string;
  type?: 'percentage' | 'fixed' | string;
  value?: number;
  discountType?: 'PERCENTAGE' | 'FIXED' | 'percentage' | 'fixed' | string;
  discountValue?: number;
  promotionType?: string;
  isFlashSale?: boolean;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount?: number;
  usedCodes?: number;
  totalCodes?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscription {
  _id: string;
  id?: string;
  user: string | User;
  planName: string;
  planType: 'WEEKLY' | 'MONTHLY' | 'weekly' | 'monthly' | string;
  price: number;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED' | string;
  startDate: string;
  endDate: string;
  deliveryTimeSlot?: string;
  deliveryDays?: string[];
  selectedMenuItems?: string[];
  deliveryAddress?: {
    street: string;
    ward?: string;
    district?: string;
    city: string;
    state?: string;
    postalCode?: string;
    phone?: string;
  };
  specialInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubscriptionDto {
  planName: string;
  planType: string;
  price: number;
  startDate: string;
  endDate: string;
  deliveryTimeSlot?: string;
  deliveryDays?: string[];
  selectedMenuItems?: string[];
  deliveryAddress: {
    street: string;
    ward?: string;
    district?: string;
    city: string;
    state?: string;
    postalCode?: string;
    phone?: string;
  };
  specialInstructions?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}