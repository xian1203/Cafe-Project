import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import axios from "../lib/axios";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  loading: boolean;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  // Load cart from backend when user logs in
  useEffect(() => {
    if (user && token) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [user, token]);

  const loadCart = async () => {
    if (!user || !token) return;
    
    try {
      setLoading(true);
      const response = await axios.get('/cart');
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    if (!user || !token) {
      toast.error('Please log in to add items to cart');
      return;
    }

    try {
      const response = await axios.post('/cart/add', {
        productId: product._id,
        quantity: 1
      });
      setItems(response.data.items);
      toast.success("Added to cart!");
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user || !token) return;

    try {
      const response = await axios.delete(`/cart/remove/${productId}`);
      setItems(response.data.items);
    toast.success("Removed from cart!");
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user || !token) return;

    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }
    
    try {
      const response = await axios.put('/cart/update', {
        productId,
        quantity
      });
      setItems(response.data.items);
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const clearCart = async () => {
    if (!user || !token) return;

    try {
      const response = await axios.delete('/cart/clear');
      setItems(response.data.items);
    toast.success("Cart cleared!");
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const total = items.reduce((sum, item) => {
    const itemPrice = Number(item.price);
    const itemQuantity = Number(item.quantity);
    const itemTotal = itemPrice * itemQuantity;
    return sum + itemTotal;
  }, 0);

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        total, 
        loading,
        loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};