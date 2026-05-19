import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'SET_ITEMS'; items: CartItem[] }
  | { type: 'ADD_ITEM'; product: Product; size: string; color: string }
  | { type: 'REMOVE_ITEM'; productId: string; size: string; color: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; size: string; color: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART'; open?: boolean };

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'eclection_cart';

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems: CartItem[];
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.items };
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id && i.size === action.size && i.color === action.color
      );
      if (existing) {
        newItems = state.items.map((i) =>
          i.product.id === action.product.id && i.size === action.size && i.color === action.color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...state.items, { product: action.product, quantity: 1, size: action.size, color: action.color }];
      }
      saveCart(newItems);
      return { ...state, items: newItems };
    }
    case 'REMOVE_ITEM': {
      newItems = state.items.filter(
        (i) => !(i.product.id === action.productId && i.size === action.size && i.color === action.color)
      );
      saveCart(newItems);
      return { ...state, items: newItems };
    }
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        newItems = state.items.filter(
          (i) => !(i.product.id === action.productId && i.size === action.size && i.color === action.color)
        );
      } else {
        newItems = state.items.map((i) =>
          i.product.id === action.productId && i.size === action.size && i.color === action.color
            ? { ...i, quantity: action.quantity }
            : i
        );
      }
      saveCart(newItems);
      return { ...state, items: newItems };
    }
    case 'CLEAR_CART':
      saveCart([]);
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: action.open !== undefined ? action.open : !state.isOpen };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    dispatch({ type: 'SET_ITEMS', items: loadCart() });
  }, []);

  const addItem = (product: Product, size: string, color: string) =>
    dispatch({ type: 'ADD_ITEM', product, size, color });
  const removeItem = (productId: string, size: string, color: string) =>
    dispatch({ type: 'REMOVE_ITEM', productId, size, color });
  const updateQuantity = (productId: string, size: string, color: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', productId, size, color, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const toggleCart = (open?: boolean) => dispatch({ type: 'TOGGLE_CART', open });

  const total = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, isOpen: state.isOpen, addItem, removeItem, updateQuantity, clearCart, toggleCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
