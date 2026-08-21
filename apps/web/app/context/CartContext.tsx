'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem } from '../lib/services/types';
import { CartItem } from '../lib/actions/cartActions';

const CART_STORAGE_KEY = 'chayfood_cart_v2';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  addItem: (
    item: MenuItem,
    quantity: number,
    specialInstructions?: string,
    portionName?: string,
    assignedMemberName?: string
  ) => Promise<void>;
  updateItem: (itemId: string, quantity: number, specialInstructions?: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // 1. Khôi phục giỏ hàng từ LocalStorage khi khởi động
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      }
    } catch {
      // Bỏ qua lỗi parse
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Lưu giỏ hàng vào LocalStorage khi có thay đổi
  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      }
    } catch {
      // Bỏ qua lỗi quota
    }
  }, [items, isHydrated]);

  // 3. Hàm refresh giỏ hàng
  const refresh = useCallback(async () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setItems(parsed);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // 4. Thêm món vào giỏ hàng
  const addItem = async (
    menuItem: MenuItem,
    quantity: number,
    specialInstructions?: string,
    portionName?: string,
    assignedMemberName?: string
  ) => {
    setError(null);
    setIsLoading(true);
    try {
      const dishId = menuItem._id || menuItem.id || 'dish';
      const lineKey = `${dishId}-${portionName || 'std'}-${assignedMemberName || 'self'}`;

      setItems((prevItems) => {
        const existingIdx = prevItems.findIndex(
          (it) => it._id === lineKey || (it.menuItem && (it.menuItem._id === dishId || it.menuItem.id === dishId) && it.specialInstructions === specialInstructions)
        );

        if (existingIdx > -1) {
          const updated = [...prevItems];
          const current = updated[existingIdx];
          updated[existingIdx] = {
            ...current,
            quantity: current.quantity + quantity,
            specialInstructions: specialInstructions || current.specialInstructions,
          };
          return updated;
        }

        const newItem: CartItem = {
          _id: lineKey,
          menuItem,
          quantity,
          specialInstructions: specialInstructions || '',
          notes: specialInstructions || '',
        };

        return [newItem, ...prevItems];
      });
    } catch {
      setError('Không thể thêm món vào giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Cập nhật số lượng món
  const updateItem = async (itemId: string, quantity: number, specialInstructions?: string) => {
    setError(null);
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((it) => {
        const itId = it._id || it.menuItem?._id || it.menuItem?.id;
        if (itId === itemId || it._id === itemId) {
          return {
            ...it,
            quantity,
            specialInstructions: specialInstructions !== undefined ? specialInstructions : it.specialInstructions,
          };
        }
        return it;
      })
    );
  };

  // 6. Xóa món khỏi giỏ hàng
  const removeItem = async (itemId: string) => {
    setError(null);
    setItems((prevItems) =>
      prevItems.filter((it) => {
        const itId = it._id || it.menuItem?._id || it.menuItem?.id;
        return itId !== itemId && it._id !== itemId;
      })
    );
  };

  // 7. Xóa sạch giỏ hàng
  const clearCart = async () => {
    setError(null);
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  // 8. Tính toán các chỉ số tổng hợp
  const totalItems = items.reduce((total, item) => total + (item.quantity || 0), 0);

  const totalAmount = items.reduce((total, item) => {
    const price = item.menuItem && typeof item.menuItem.price === 'number' ? item.menuItem.price : 0;
    const qty = typeof item.quantity === 'number' ? item.quantity : 0;
    return total + price * qty;
  }, 0);

  const totalCalories = items.reduce((sum, item) => {
    const cal = Number(item.menuItem?.calories ?? item.menuItem?.nutritionInfo?.calories ?? 400);
    return sum + cal * (item.quantity || 0);
  }, 0);

  const totalProtein = items.reduce((sum, item) => {
    const pro = Number(item.menuItem?.protein ?? item.menuItem?.nutritionInfo?.protein ?? 15);
    return sum + pro * (item.quantity || 0);
  }, 0);

  const totalCarbs = items.reduce((sum, item) => {
    const carb = Number(item.menuItem?.carbs ?? item.menuItem?.nutritionInfo?.carbs ?? 55);
    return sum + carb * (item.quantity || 0);
  }, 0);

  const totalFat = items.reduce((sum, item) => {
    const fat = Number(item.menuItem?.fat ?? item.menuItem?.nutritionInfo?.fat ?? 10);
    return sum + fat * (item.quantity || 0);
  }, 0);

  const value = {
    items,
    totalItems,
    totalAmount,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    isLoading,
    error,
    refresh,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;