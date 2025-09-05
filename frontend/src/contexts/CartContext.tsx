import React, { createContext, useContext, useReducer, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  category: string;
  location: string;
  seller: string;
  delivery: string;
  inStock: boolean;
  image?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.product.id === action.product.id
      );
      let newItems: CartItem[];

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { product: action.product, quantity: 1 }];
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.product.discountPrice * item.quantity,
        0
      );
      return { items: newItems, total };
    }
    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.product.id !== action.productId
      );
      const total = newItems.reduce(
        (sum, item) => sum + item.product.discountPrice * item.quantity,
        0
      );
      return { items: newItems, total };
    }
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          productId: action.productId,
        });
      }
      const newItems = state.items.map((item) =>
        item.product.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );
      const total = newItems.reduce(
        (sum, item) => sum + item.product.discountPrice * item.quantity,
        0
      );
      return { items: newItems, total };
    }
    case "CLEAR_CART":
      return { items: [], total: 0 };
    case "LOAD_CART": {
      const total = action.items.reduce(
        (sum, item) => sum + item.product.discountPrice * item.quantity,
        0
      );
      return { items: action.items, total };
    }
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const items: CartItem[] = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", items });
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
