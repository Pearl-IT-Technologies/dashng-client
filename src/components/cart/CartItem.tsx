import { useState } from "react";
import { Link } from "wouter";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";

interface CartItemProps {
  id: number | string; // Can be number for authenticated user cart or string for guest cart
  product: {
    id: number;
    name: string;
    brand: string;
    price: number;
    discountPrice?: number;
    images: string[];
  };
  quantity: number;
}

const CartItem = ({ id, product, quantity }: CartItemProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { updateCartItem, removeFromCart, isGuest } = useCart();
  const queryClient = useQueryClient();
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // For authenticated users, we'll still use the mutations to the API
  const updateCartMutation = useMutation({
    mutationFn: async (newQuantity: number) => {
      const res = await apiRequest("PATCH", `/api/cart/${id}`, { quantity: newQuantity });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update cart",
        description: error.message,
        variant: "destructive",
      });
      // Reset to previous quantity
      setItemQuantity(quantity);
    }
  });
  
  const removeCartItemMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove item",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      setItemQuantity(newQuantity);
      
      // Use the appropriate update function based on whether the user is authenticated
      if (!isGuest) {
        setIsUpdating(true);
        // For authenticated users, we use the API mutation
        updateCartMutation.mutate(newQuantity);
        setIsUpdating(false);
      } else {
        setIsUpdating(true);
        // For guest users, we use the local cart context
        updateCartItem(id as any, newQuantity);
        setIsUpdating(false);
      }
    }
  };
  
  const handleRemoveItem = () => {
    setIsRemoving(true);
    
    // Use the appropriate remove function based on whether the user is authenticated
    if (!isGuest) {
      // For authenticated users, we use the API mutation
      removeCartItemMutation.mutate();
    } else {
      // For guest users, we use the local cart context
      removeFromCart(id as any);
    }
    
    setIsRemoving(false);
  };
  
  const actualPrice = product.discountPrice || product.price;
  const totalPrice = actualPrice * itemQuantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b">
      <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 sm:mr-6">
        <Link href={`/products/${product.id}`}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
      
      <div className="flex-1">
        <h3 className="text-sm text-gray-600 mb-1">{product.brand}</h3>
        <Link href={`/products/${product.id}`}>
          <h4 className="font-medium mb-1 hover:text-[#D4AF37] transition-colors">
            {product.name}
          </h4>
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center">
            <div className="w-20 mr-2">
              <Input
                type="number"
                min="1"
                value={itemQuantity}
                onChange={handleQuantityChange}
                className="h-9"
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRemoveItem}
              disabled={isRemoving || removeCartItemMutation.isPending}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-right">
            {product.discountPrice ? (
              <div className="flex flex-col items-end">
                <span className="line-through text-gray-500 text-sm">
                  ₦{product.price.toLocaleString()}
                </span>
                <span className="font-semibold">
                  ₦{product.discountPrice.toLocaleString()} × {itemQuantity} = ₦{totalPrice.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="font-semibold">
                ₦{product.price.toLocaleString()} × {itemQuantity} = ₦{totalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
