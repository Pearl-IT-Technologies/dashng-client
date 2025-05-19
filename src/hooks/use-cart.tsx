import { useAuth } from "@/hooks/use-auth";
import { useGuestCart } from "@/hooks/use-guest-cart";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useCart() {
  const { user } = useAuth();
  const guestCart = useGuestCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // For authenticated users, fetch cart from API
  const { 
    data: userCartItems = [], 
    isLoading: isUserCartLoading,
    refetch: refetchUserCart
  } = useQuery({
    queryKey: ["/api/products/cart"],
    queryFn: async () => {
      if (!user) return [];
      const res = await fetch("/api/products/cart", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
    enabled: !!user,
  });

  // Add to cart mutation for authenticated users
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      if (!user) return null;
      const res = await apiRequest("POST", "/api/products/cart", { productId, quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add item to cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update cart item mutation for authenticated users
  const updateCartItemMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      if (!user) return null;
      const res = await apiRequest("PATCH", `/api/products/cart/${itemId}`, { quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update cart item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove from cart mutation for authenticated users
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: number) => {
      if (!user) return null;
      await apiRequest("DELETE", `/api/products/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove item from cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Clear cart mutation for authenticated users
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) return null;
      await apiRequest("DELETE", "/api/products/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to clear cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // If the user is authenticated, use the server API
  // Otherwise, use the guest cart from localStorage
  if (user) {
    return {
      cartItems: userCartItems,
      isLoading: isUserCartLoading,
      addToCart: (product: any, quantity: number) => 
        addToCartMutation.mutate({ productId: product.id, quantity }),
      updateCartItem: (id: number, quantity: number) => 
        updateCartItemMutation.mutate({ itemId: id, quantity }),
      removeFromCart: (id: number) => removeFromCartMutation.mutate(id),
      clearCart: () => clearCartMutation.mutate(),
      itemCount: userCartItems.reduce((total: number, item: any) => total + item.quantity, 0),
      total: userCartItems.reduce(
        (total: number, item: any) => 
          total + (item.product.discountPrice || item.product.price) * item.quantity, 
        0
      ),
      isPending: 
        addToCartMutation.isPending || 
        updateCartItemMutation.isPending || 
        removeFromCartMutation.isPending ||
        clearCartMutation.isPending,
      refetch: refetchUserCart,
      isGuest: false
    };
  } else {
    // For guest users, use the guest cart hook
    return {
      ...guestCart,
      isLoading: false, 
      isPending: false,
      refetch: () => {}, // No-op for guest cart
      isGuest: true
    };
  }
}