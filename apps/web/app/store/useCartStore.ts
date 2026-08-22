import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MenuItem } from '../lib/services/types';

export interface CartLineItem {
  id: string; // Unique cart line identifier
  menuItem: MenuItem;
  quantity: number;
  portionId?: string;
  portionName?: string;
  extraPrice?: number;
  assignedMemberId?: string;
  assignedMemberName?: string;
  specialInstructions?: string;
}

export interface CartVoucher {
  code: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue?: number;
  freeShipping?: boolean;
}

export const AVAILABLE_VOUCHERS: CartVoucher[] = [
  {
    code: 'CHAYFOOD10',
    description: 'Giảm 10% tổng đơn hàng từ 150.000 đ',
    discountPercent: 10,
    minOrderValue: 150000,
  },
  {
    code: 'THUANCHAY20',
    description: 'Giảm 20.000 đ cho đơn hàng từ 120.000 đ',
    discountAmount: 20000,
    minOrderValue: 120000,
  },
  {
    code: 'FREESHIP',
    description: 'Miễn phí giao hàng toàn thành phố cho đơn từ 100.000 đ',
    freeShipping: true,
    minOrderValue: 100000,
  },
];

export const FREE_SHIPPING_THRESHOLD = 200000;
export const STANDARD_DELIVERY_FEE = 25000;

interface CartStoreState {
  items: CartLineItem[];
  appliedVoucher: CartVoucher | null;
  deliveryNotes: string;
  isCartDrawerOpen: boolean;

  // Actions
  addItem: (
    item: MenuItem,
    quantity?: number,
    options?: {
      portionId?: string;
      portionName?: string;
      extraPrice?: number;
      assignedMemberId?: string;
      assignedMemberName?: string;
      specialInstructions?: string;
    }
  ) => void;
  updateQuantity: (id: string, quantity: number) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyVoucher: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;
  setDeliveryNotes: (notes: string) => void;
  setCartDrawerOpen: (isOpen: boolean) => void;

  // Computations
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getDiscountAmount: () => number;
  getTotalAmount: () => number;
  getFreeShippingRemaining: () => number;
  getMacros: () => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedVoucher: null,
      deliveryNotes: '',
      isCartDrawerOpen: false,

      addItem: (item, quantity = 1, options = {}) => {
        const dishId = item._id || item.id || 'dish';
        const portionId = options.portionId || 'std';
        const memberId = options.assignedMemberId || 'self';
        const lineId = `${dishId}-${portionId}-${memberId}`;
        const unitPrice = (item.price || 0) + (options.extraPrice || 0);

        set((state) => {
          const existingIdx = state.items.findIndex((it) => it.id === lineId);
          if (existingIdx > -1) {
            const updated = [...state.items];
            const curr = updated[existingIdx];
            updated[existingIdx] = {
              ...curr,
              quantity: curr.quantity + quantity,
              specialInstructions: options.specialInstructions || curr.specialInstructions,
            };
            return { items: updated };
          }

          const newLineItem: CartLineItem = {
            id: lineId,
            menuItem: {
              ...item,
              price: unitPrice,
            },
            quantity,
            portionId: options.portionId,
            portionName: options.portionName,
            extraPrice: options.extraPrice,
            assignedMemberId: options.assignedMemberId,
            assignedMemberName: options.assignedMemberName,
            specialInstructions: options.specialInstructions,
          };

          return { items: [newLineItem, ...state.items] };
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((it) => (it.id === id ? { ...it, quantity } : it)),
        }));
      },

      increaseQuantity: (id) => {
        set((state) => ({
          items: state.items.map((it) => (it.id === id ? { ...it, quantity: it.quantity + 1 } : it)),
        }));
      },

      decreaseQuantity: (id) => {
        const item = get().items.find((it) => it.id === id);
        if (!item) return;
        if (item.quantity <= 1) {
          get().removeItem(id);
        } else {
          set((state) => ({
            items: state.items.map((it) => (it.id === id ? { ...it, quantity: it.quantity - 1 } : it)),
          }));
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((it) => it.id !== id),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedVoucher: null, deliveryNotes: '' });
      },

      applyVoucher: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const found = AVAILABLE_VOUCHERS.find((v) => v.code === cleanCode);
        if (!found) {
          return { success: false, message: 'Mã ưu đãi không hợp lệ' };
        }

        const subtotal = get().getSubtotal();
        if (found.minOrderValue && subtotal < found.minOrderValue) {
          return {
            success: false,
            message: `Mã ${cleanCode} áp dụng cho đơn hàng từ ${found.minOrderValue.toLocaleString('vi-VN')} đ`,
          };
        }

        set({ appliedVoucher: found });
        return { success: true, message: `Áp dụng thành công mã ${cleanCode}` };
      },

      removeVoucher: () => {
        set({ appliedVoucher: null });
      },

      setDeliveryNotes: (notes) => {
        set({ deliveryNotes: notes });
      },

      setCartDrawerOpen: (isOpen) => {
        set({ isCartDrawerOpen: isOpen });
      },

      getTotalItems: () => {
        return get().items.reduce((total, it) => total + (it.quantity || 0), 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, it) => {
          const price = it.menuItem?.price || 0;
          return total + price * (it.quantity || 0);
        }, 0);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        if (get().appliedVoucher?.freeShipping) return 0;
        if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
        return STANDARD_DELIVERY_FEE;
      },

      getDiscountAmount: () => {
        const voucher = get().appliedVoucher;
        if (!voucher) return 0;
        const subtotal = get().getSubtotal();

        if (voucher.discountPercent) {
          return Math.round((subtotal * voucher.discountPercent) / 100);
        }
        if (voucher.discountAmount) {
          return Math.min(voucher.discountAmount, subtotal);
        }
        return 0;
      },

      getTotalAmount: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const fee = get().getDeliveryFee();
        const discount = get().getDiscountAmount();
        return Math.max(0, subtotal + fee - discount);
      },

      getFreeShippingRemaining: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
      },

      getMacros: () => {
        return get().items.reduce(
          (acc, it) => {
            const qty = it.quantity || 0;
            const cal = Number(it.menuItem.calories ?? it.menuItem.nutritionInfo?.calories ?? 400);
            const pro = Number(it.menuItem.protein ?? it.menuItem.nutritionInfo?.protein ?? 15);
            const carb = Number(it.menuItem.carbs ?? it.menuItem.nutritionInfo?.carbs ?? 55);
            const fat = Number(it.menuItem.fat ?? it.menuItem.nutritionInfo?.fat ?? 10);

            return {
              calories: acc.calories + cal * qty,
              protein: acc.protein + pro * qty,
              carbs: acc.carbs + carb * qty,
              fat: acc.fat + fat * qty,
            };
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
      },
    }),
    {
      name: 'chayfood_zustand_cart_v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
