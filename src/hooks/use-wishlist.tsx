import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product?: {
    id: number;
    name: string;
    price: number;
    description: string;
    images: string[];
    brand: string;
    category: string;
  };
}

export function useWishlist() {
  const { toast } = useToast();
  const [localWishlistItems, setLocalWishlistItems] = useState<WishlistItem[]>([]);

  // Query to fetch wishlist items
  const {
    data: wishlistItems,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/wishlist"],
    queryFn: async () => {
      const res = await fetch("/api/wishlist", { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch wishlist items");
      }
      const data = await res.json();
      setLocalWishlistItems(data);
      return data;
    },
  });

  // Add item to wishlist mutation
  const addWishlistItemMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("POST", "/api/wishlist", { productId });
      if (!res.ok) {
        throw new Error("Failed to add item to wishlist");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove item from wishlist mutation
  const removeWishlistItemMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("DELETE", `/api/wishlist/${productId}`);
      if (!res.ok) {
        throw new Error("Failed to remove item from wishlist");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check if an item is in the wishlist
  const isInWishlist = (productId: number) => {
    return (wishlistItems ?? localWishlistItems).some(
      (item) => item.productId === productId
    );
  };

  // Toggle wishlist item - add if not in wishlist, remove if in wishlist
  const toggleWishlistItem = (productId: number, productName?: string) => {
    if (isInWishlist(productId)) {
      removeWishlistItemMutation.mutate(productId);
      toast({
        title: "Removed from wishlist",
        description: productName ? `${productName} removed from your wishlist` : "Item removed from your wishlist",
      });
    } else {
      addWishlistItemMutation.mutate(productId);
      toast({
        title: "Added to wishlist",
        description: productName ? `${productName} added to your wishlist` : "Item added to your wishlist",
      });
    }
  };

  return {
    wishlistItems: wishlistItems ?? localWishlistItems,
    isLoading,
    error,
    addWishlistItemMutation,
    removeWishlistItemMutation,
    isInWishlist,
    toggleWishlistItem,
    refetch,
  };
}