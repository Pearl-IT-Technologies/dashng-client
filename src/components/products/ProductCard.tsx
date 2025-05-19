import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Heart, ShoppingBag, AlertTriangle, Eye, Check, CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { SuccessAnimation } from "@/components/ui/success-animation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useInventory } from "@/hooks/use-inventory";
import { useWishlist } from "@/hooks/use-wishlist";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ProductQuickView from "./ProductQuickView";
import { motion } from "framer-motion";
import { scaleAnimation, addToCartAnimation } from "@/lib/animation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/schema";



// Component to show inventory status with visual indicators
interface InventoryStatusIndicatorProps {
  productId: number;
  stockLevel: number;
}

const InventoryStatusIndicator = ({ productId, stockLevel }: InventoryStatusIndicatorProps) => {
  const { stockStatus } = useInventory();
  const status = stockStatus(productId);
  
  return (
    <div className="inventory-status flex items-center text-xs">
      {stockLevel <= 0 ? (
        <div className="flex items-center text-red-600">
          <XCircle className="h-3 w-3 mr-1" />
          <span>Out of Stock</span>
        </div>
      ) : stockLevel <= 5 ? (
        <motion.div 
          className="flex items-center text-amber-600"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>Only {stockLevel} left!</span>
        </motion.div>
      ) : stockLevel <= 10 ? (
        <div className="flex items-center text-amber-600">
          <Clock className="h-3 w-3 mr-1" />
          <span>Low Stock: {stockLevel} remaining</span>
        </div>
      ) : (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          <span>In Stock</span>
        </div>
      )}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onAddedToCart?: () => void;
}

const ProductCard = ({ product, onAddedToCart }: ProductCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { getStockLevel, updateStockLevel, stockStatus } = useInventory();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const [currentStock, setCurrentStock] = useState(product.quantity);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  // Check if this product is in the wishlist
  //@ts-ignore
  const inWishlist = isInWishlist(product.id);
  
  useEffect(() => {
    // Initialize stock level from inventory context or product data
    //@ts-ignore
    const stockFromContext = getStockLevel(product.id);
    if (stockFromContext > 0) {
      setCurrentStock(stockFromContext);
    } else if (product.quantity > 0) {
      // If not in context yet, initialize from product data
      //@ts-ignore
      updateStockLevel(product.id, product.quantity);
      setCurrentStock(product.quantity);
    }
  }, [product.id, product.quantity, getStockLevel, updateStockLevel]);
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Please log in to add items to cart");
      }
      if (currentStock <= 0) {
        throw new Error("This product is out of stock");
      }
      const res = await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1
      });
      return await res.json();
    },
    onSuccess: () => {
      // Update inventory after successful cart addition
      
      const newStock = currentStock - 1;
      //@ts-ignore
      updateStockLevel(product.id, newStock);
      setCurrentStock(newStock);
      
      // Call the onAddedToCart callback if provided
      if (onAddedToCart) {
        onAddedToCart();
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.${newStock <= 5 ? ` Only ${newStock} remaining!` : ''}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add to cart",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate();
  };
  
  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistLoading(true);
    try {
      //@ts-ignore
      await toggleWishlistItem(product.id, product.name);
    } finally {
      setWishlistLoading(false);
    }
  };

  const [addedToCart, setAddedToCart] = useState(false);
  
  // Handle add to cart with animation
  const handleAddToCartWithAnimation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate();
    setAddedToCart(true);
    // Reset animation state after animation completes
    setTimeout(() => setAddedToCart(false), 1000);
  };

  return (
    <AnimatedCard 
      className="product-card bg-white group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      hoverEffect={true}
      clickEffect={false}
    >
      {/* Quick View Modal */}
      <ProductQuickView 
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden">
          {product.isNewArrival && (
            <motion.span 
              className="absolute top-3 left-3 bg-[#D4AF37] text-white text-xs px-2 py-1 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              NEW
            </motion.span>
          )}
          {product.discountPrice && (
            <motion.span 
              className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              SALE
            </motion.span>
          )}
          
          {/* Real-time Inventory Status Badge */}
          {currentStock <= 0 ? (
            <motion.div 
              className="absolute top-3 right-16 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                <span>Out of Stock</span>
              </Badge>
            </motion.div>
          ) : currentStock <= 5 ? (
            <motion.div 
              className="absolute top-3 right-16 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -3, 0] }}
              transition={{ duration: 0.3, repeat: 2 }}
            >
              <Badge variant="destructive" className="bg-amber-600 hover:bg-amber-700 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>Only {currentStock} left!</span>
              </Badge>
            </motion.div>
          ) : currentStock <= 10 ? (
            <motion.div 
              className="absolute top-3 right-16 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Low Stock: {currentStock}</span>
              </Badge>
            </motion.div>
          ) : null}
          
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className={cn(
              "w-full h-72 sm:h-80 object-cover",
              currentStock <= 0 && "opacity-70"
            )}
          />
          
          {product.images.length > 1 && (
            <motion.img 
              src={product.images[1]} 
              alt={`${product.name} secondary view`} 
              className="w-full h-72 sm:h-80 object-cover absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
          
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <AnimatedButton 
                size="icon" 
                variant="secondary" 
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                  inWishlist ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-[#D4AF37]'
                }`}
                onClick={handleAddToWishlist}
                disabled={wishlistLoading}
              >
                {wishlistLoading ? (
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Heart className="h-4 w-4" fill={inWishlist ? "#D4AF37" : "none"} />
                )}
              </AnimatedButton>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <AnimatedButton 
                size="icon" 
                variant="secondary" 
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-[#D4AF37] shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickViewOpen(true);
                }}
              >
                <Eye className="h-4 w-4" />
              </AnimatedButton>
            </motion.div>
          </div>
          
          <motion.div 
            className="quick-add absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 20 
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-2">
              <SuccessAnimation trigger={addedToCart} className="relative">
                <AnimatedButton 
                  variant="default" 
                  className="bg-black text-white hover:bg-[#D4AF37] text-sm uppercase tracking-wide"
                  onClick={handleAddToCartWithAnimation}
                  disabled={addToCartMutation.isPending || currentStock <= 0}
                >
                  <motion.div
                    className="flex items-center gap-2"
                    initial="initial"
                    animate={addToCartMutation.isPending ? "animate" : "initial"}
                    variants={addToCartAnimation}
                  >
                    {addToCartMutation.isPending ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-1 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Adding...
                      </span>
                    ) : addedToCart ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </motion.div>
                </AnimatedButton>
              </SuccessAnimation>
              
              <AnimatedButton 
                variant="outline" 
                className="border-black hover:bg-gray-100 text-sm uppercase tracking-wide"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickViewOpen(true);
                }}
              >
                Quick View
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="px-4 py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <motion.h3 
            className="text-sm text-gray-600 mb-1"
            whileHover={{ color: "#D4AF37" }}
          >
            <span 
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                //@ts-ignore
                window.location.href = `/products?brand=${encodeURIComponent(product.brand)}`;
              }}
            >
              {product.brand}
            </span>
          </motion.h3>
          <p className="font-medium mb-2">{product.name}</p>
          {product.discountPrice ? (
            <div>
              <div className="flex items-center">
                <p className="text-gray-800 font-semibold line-through inline-block mr-2">
                  ₦{product.price.toLocaleString()}
                </p>
                <motion.p 
                  className="text-red-600 font-semibold inline-block"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  ₦{product.discountPrice.toLocaleString()}
                </motion.p>
              </div>
              <div className="mt-2">
                {//@ts-ignore
                <InventoryStatusIndicator productId={product.id} stockLevel={currentStock} />
                }
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center">
                <p className="text-gray-800 font-semibold">₦{product.price.toLocaleString()}</p>
              </div>
              <div className="mt-2">
                {//@ts-ignore
                <InventoryStatusIndicator productId={product.id} stockLevel={currentStock} />
          }
              </div>
            </div>
          )}
        </motion.div>
      </Link>
    </AnimatedCard>
  );
};

export default ProductCard;
