import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type CartItem = {
  id: string; // Using string as ID for guest cart (uses product ID + timestamp)
  product: {
    id: number;
    name: string;
    brand: string;
    price: number;
    discountPrice?: number;
    images: string[];
    quantity: number; // Product stock quantity
  };
  quantity: number; // Quantity in cart
  selectedColor?: string | null; // Color selection if applicable
  selectedSize?: string | null; // Size selection if applicable
};

interface GuestCartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity: number, selectedColor?: string | null, selectedSize?: string | null) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

export const GuestCartContext = createContext<GuestCartContextType | null>(null);

const CART_STORAGE_KEY = "dash_guest_cart";

export function GuestCartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: any, quantity: number, selectedColor?: string | null, selectedSize?: string | null) => {
    // Check if product is already in cart with the same options
    const existingItemIndex = cartItems.findIndex(
      (item) => 
        item.product.id === product.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
    );

    // Check stock before adding
    if (product.quantity < quantity) {
      toast({
        title: "Not enough stock",
        description: "Sorry, we don't have enough in stock to add that quantity.",
        variant: "destructive",
      });
      return;
    }

    // Check for required color and size selections
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Color selection required",
        description: "Please select a color for this item.",
        variant: "destructive",
      });
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Size selection required",
        description: "Please select a size for this item.",
        variant: "destructive",
      });
      return;
    }

    if (existingItemIndex !== -1) {
      // Update existing item
      const newCartItems = [...cartItems];
      const newQuantity = newCartItems[existingItemIndex].quantity + quantity;
      
      // Check if new quantity exceeds stock
      if (product.quantity < newQuantity) {
        toast({
          title: "Not enough stock",
          description: "Sorry, we don't have enough in stock to add that quantity.",
          variant: "destructive",
        });
        return;
      }
      
      newCartItems[existingItemIndex] = {
        ...newCartItems[existingItemIndex],
        quantity: newQuantity,
      };
      
      setCartItems(newCartItems);
      
      toast({
        title: "Cart updated",
        description: `${product.name} quantity updated in your cart.`,
      });
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`, // Unique ID for guest cart items
        product,
        quantity,
        selectedColor,
        selectedSize
      };
      
      setCartItems([...cartItems, newItem]);
      
      const detailText = [
        selectedColor ? `Color: ${selectedColor}` : "",
        selectedSize ? `Size: ${selectedSize}` : ""
      ].filter(Boolean).join(", ");
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.${detailText ? ` (${detailText})` : ""}`,
      });
    }
  };

  const updateCartItem = (id: string, quantity: number) => {
    const itemIndex = cartItems.findIndex((item) => item.id === id);
    
    if (itemIndex === -1) return;
    
    // Check if quantity exceeds stock
    if (cartItems[itemIndex].product.quantity < quantity) {
      toast({
        title: "Not enough stock",
        description: "Sorry, we don't have enough in stock for that quantity.",
        variant: "destructive",
      });
      return;
    }
    
    const newCartItems = [...cartItems];
    newCartItems[itemIndex] = {
      ...newCartItems[itemIndex],
      quantity,
    };
    
    setCartItems(newCartItems);
  };

  const removeFromCart = (id: string) => {
    const item = cartItems.find((item) => item.id === id);
    
    if (!item) return;
    
    setCartItems(cartItems.filter((item) => item.id !== id));
    
    toast({
      title: "Removed from cart",
      description: `${item.product.name} has been removed from your cart.`,
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  // Calculate total number of items in cart
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Calculate total price of all items in cart
  const total = cartItems.reduce(
    (acc, item) => 
      acc + 
      (item.product.discountPrice || item.product.price) * item.quantity, 
    0
  );

  return (
    <GuestCartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </GuestCartContext.Provider>
  );
}

export function useGuestCart() {
  const context = useContext(GuestCartContext);
  if (!context) {
    throw new Error("useGuestCart must be used within a GuestCartProvider");
  }
  return context;
}