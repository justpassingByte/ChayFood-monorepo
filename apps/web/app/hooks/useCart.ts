'use client';

import { useRouter } from 'next/navigation';
import { useCartStore, CartLineItem } from '../store/useCartStore';
import { MenuItem } from '../lib/services/types';
import { toast } from 'react-hot-toast';

export function useCart() {
  const router = useRouter();
  const store = useCartStore();

  const totalItems = store.getTotalItems();
  const totalAmount = store.getTotalAmount();
  const subtotal = store.getSubtotal();
  const deliveryFee = store.getDeliveryFee();
  const discountAmount = store.getDiscountAmount();
  const freeShippingRemaining = store.getFreeShippingRemaining();
  const macros = store.getMacros();
  const isCartEmpty = store.items.length === 0;

  const isItemInCart = (itemId: string): boolean => {
    return store.items.some(
      (it) => it.menuItem?._id === itemId || it.menuItem?.id === itemId || it.id === itemId
    );
  };

  const getItemQuantity = (itemId: string): number => {
    const it = store.items.find(
      (item) => item.menuItem?._id === itemId || item.menuItem?.id === itemId || item.id === itemId
    );
    return it ? it.quantity : 0;
  };

  const addToCartWithMessage = (
    item: MenuItem,
    quantity = 1,
    options?: {
      portionId?: string;
      portionName?: string;
      extraPrice?: number;
      assignedMemberId?: string;
      assignedMemberName?: string;
      specialInstructions?: string;
    } | string
  ) => {
    if (typeof options === 'string') {
      store.addItem(item, quantity, { specialInstructions: options });
    } else {
      store.addItem(item, quantity, options);
    }
  };

  const proceedToCheckout = () => {
    if (isCartEmpty) {
      toast.error('Giỏ hàng của bạn đang trống');
      return;
    }
    router.push('/checkout');
  };

  // Convert to legacy CartItem format for any components expecting it
  const legacyItems = store.items.map((it: CartLineItem) => ({
    _id: it.id,
    menuItem: it.menuItem,
    quantity: it.quantity,
    specialInstructions: it.specialInstructions,
    notes: it.specialInstructions,
    portionName: it.portionName,
    assignedMemberName: it.assignedMemberName,
  }));

  return {
    items: legacyItems,
    rawItems: store.items,
    totalItems,
    totalAmount,
    subtotal,
    deliveryFee,
    discountAmount,
    freeShippingRemaining,
    macros,
    appliedVoucher: store.appliedVoucher,
    deliveryNotes: store.deliveryNotes,
    isCartEmpty,
    isLoading: false,
    error: null,
    message: null as string | null,
    hasMessage: false,
    dismissMessage: () => {},

    // Helpers
    isItemInCart,
    getItemQuantity,

    // Actions
    addItem: store.addItem,
    updateItem: (id: string, quantity: number, specialInstructions?: string) => {
      store.updateQuantity(id, quantity);
      if (specialInstructions !== undefined) {
        // update special instructions if needed
      }
    },
    increaseQuantity: store.increaseQuantity,
    decreaseQuantity: store.decreaseQuantity,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
    applyVoucher: store.applyVoucher,
    removeVoucher: store.removeVoucher,
    setDeliveryNotes: store.setDeliveryNotes,
    addToCartWithMessage,
    proceedToCheckout,
    refresh: () => {},
  };
}

export default useCart;