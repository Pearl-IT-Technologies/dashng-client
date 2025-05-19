import { useState, useEffect, useRef } from "react";
import { useGuestCart } from "@/hooks/use-guest-cart";
import { useAuth } from "@/hooks/use-auth";
import { useInventory } from "@/hooks/use-inventory";
import { useWishlist } from "@/hooks/use-wishlist";
import { Link } from "wouter";
import { X, Heart, ChevronLeft, ChevronRight, Minus, Plus, RotateCw, RefreshCw } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Product } from "@/lib/schema";

// Common colors with their hex values
const COLOR_HEX_MAP: Record<string, string> = {
  "Black": "#000000",
  "White": "#FFFFFF",
  "Red": "#FF0000",
  "Green": "#008000",
  "Blue": "#0000FF",
  "Yellow": "#FFFF00",
  "Purple": "#800080",
  "Pink": "#FFC0CB",
  "Orange": "#FFA500",
  "Brown": "#A52A2A",
  "Grey": "#808080",
  "Navy": "#000080",
  "Beige": "#F5F5DC",
  "Teal": "#008080",
  "Charcoal": "#36454F",
  "Burgundy": "#800020",
  "Gold": "#FFD700",
  "Silver": "#C0C0C0",
  "Olive": "#808000",
  "Cream": "#FFFDD0",
};

interface ProductQuickViewProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductQuickView = ({ product, open, onOpenChange }: ProductQuickViewProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { getStockLevel, updateStockLevel, stockStatus } = useInventory();
  const { addToCart: addToGuestCart } = useGuestCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  const [currentStock, setCurrentStock] = useState(product.quantity);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const imageRef = useRef<HTMLDivElement>(null);
  const rotationIntervalRef = useRef<number | null>(null);
  
  // Initialize state values
  useEffect(() => {
    if (open) {
      // Reset selections when dialog opens
      setSelectedQuantity(1);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : null);
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
      setActiveImageIndex(0);
      setIsRotating(false);
      setRotationDegree(0);
      
      // Get stock from inventory context
      //@ts-ignore
      const stockFromContext = getStockLevel(product.id);
      if (stockFromContext > 0) {
        setCurrentStock(stockFromContext);
      } else if (product.quantity > 0) {
        //@ts-ignore
        updateStockLevel(product.id, product.quantity);
        setCurrentStock(product.quantity);
      }
    }
  }, [open, product, getStockLevel, updateStockLevel]);

  // Clean up rotation interval on unmount
  useEffect(() => {
    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
    };
  }, []);

  // Handle quantity changes
  const increaseQuantity = () => {
    if (selectedQuantity < currentStock) {
      setSelectedQuantity(prev => prev + 1);
    } else {
      toast({
        title: "Maximum quantity reached",
        description: `Only ${currentStock} items in stock.`,
        variant: "destructive",
      });
    }
  };

  const decreaseQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(prev => prev - 1);
    }
  };

  // Image navigation
  const nextImage = () => {
    if (isRotating) return;
    setActiveImageIndex(prevIndex => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (isRotating) return;
    setActiveImageIndex(prevIndex => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  // 360-degree rotation handlers
  const toggleRotation = () => {
    if (isRotating) {
      // Stop rotation
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
        rotationIntervalRef.current = null;
      }
      setIsRotating(false);
    } else {
      // Start rotation
      setIsRotating(true);
      rotationIntervalRef.current = window.setInterval(() => {
        setRotationDegree(prev => (prev + 5) % 360);
      }, 50);
    }
  };

  // Mouse interaction for rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isRotating) return;
    
    // Stop default drag behavior
    e.preventDefault();
    
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isRotating) return;
    
    const deltaX = e.clientX - startX;
    const rotationChange = Math.floor(deltaX / 5);
    
    if (Math.abs(rotationChange) > 0) {
      setRotationDegree(prev => {
        const newDegree = (prev + rotationChange) % 360;
        return newDegree < 0 ? 360 + newDegree : newDegree;
      });
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mutations for cart operations
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Please log in to add items to cart");
      }
      if (currentStock <= 0) {
        throw new Error("This product is out of stock");
      }
      if (selectedQuantity > currentStock) {
        throw new Error(`Only ${currentStock} items available`);
      }
      
      const res = await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: selectedQuantity
      });
      return await res.json();
    },
    onSuccess: () => {
      // Update inventory after successful cart addition
      const newStock = currentStock - selectedQuantity;
      //@ts-ignore
      updateStockLevel(product.id, newStock);
      setCurrentStock(newStock);
      
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
      
      // Close the quick view dialog
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add to cart",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Check if this product is in the wishlist
  //@ts-ignore
  const inWishlist = isInWishlist(product.id);
  
  // Handle wishlist operations using the useWishlist hook
  const handleAddToWishlist = async () => {
    setWishlistLoading(true);
    try {
      //@ts-ignore
      await toggleWishlistItem(product.id, product.name);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Handle cart additions for both authenticated and guest users
  const handleAddToCart = () => {
    if (currentStock <= 0) {
      toast({
        title: "Out of stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedQuantity > currentStock) {
      toast({
        title: "Insufficient stock",
        description: `Only ${currentStock} items available.`,
        variant: "destructive",
      });
      return;
    }
    
    if (user) {
      // Authenticated user - use API
      addToCartMutation.mutate();
    } else {
      // Guest user - use local storage
      addToGuestCart(product, selectedQuantity, selectedColor, selectedSize);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl sm:h-auto max-h-[90vh] overflow-y-auto">
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images / 360-degree Viewer */}
          <div className="space-y-4">
            <div 
              className="relative aspect-square overflow-hidden rounded-lg"
              ref={imageRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                className="w-full h-full"
                style={{
                  transform: `rotate(${rotationDegree}deg)`,
                  transition: isRotating ? 'none' : 'transform 0.2s ease',
                }}
              >
                <img
                  src={product.images[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Rotation controls */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white bg-opacity-70"
                  onClick={toggleRotation}
                >
                  {isRotating ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white bg-opacity-70"
                  onClick={() => setRotationDegree(0)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Image navigation arrows */}
              <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full pointer-events-auto ml-2 bg-white bg-opacity-70"
                  onClick={prevImage}
                  disabled={isRotating}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full pointer-events-auto mr-2 bg-white bg-opacity-70"
                  onClick={nextImage}
                  disabled={isRotating}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Rotation indicator */}
              {isDragging && !isRotating && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                  Drag to rotate • {rotationDegree}°
                </div>
              )}
              
              {/* Stock indicator */}
              <div className={`absolute top-4 left-4 text-white text-xs font-semibold px-2 py-1 z-10
                shadow-md rounded border border-white
                ${currentStock > 10 
                  ? "bg-green-600" 
                  : currentStock > 0 
                    ? "bg-orange-500" 
                    : "bg-red-600"}`}
              >
                {currentStock > 10 
                  ? `In Stock (${currentStock})` 
                  : currentStock > 0 
                    ? `Only ${currentStock} left` 
                    : "Out of Stock"
                }
              </div>
            </div>
            
            {/* Thumbnail images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      activeImageIndex === index
                        ? 'border-[#D4AF37] shadow-md'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setActiveImageIndex(index);
                      if (isRotating) toggleRotation();
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Image count indicator */}
            {product.images.length > 1 && (
              <div className="text-center text-sm text-gray-500">
                Image {activeImageIndex + 1} of {product.images.length}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <Link 
              //@ts-ignore
                href={`/products?brand=${encodeURIComponent(product.brand)}`}
                className="text-sm text-gray-600 hover:text-[#D4AF37]"
              >
                {product.brand}
              </Link>
              <h2 className="text-2xl font-medium">{product.name}</h2>
              
              <div className="mt-2">
                {product.discountPrice ? (
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-500 line-through mr-2">
                      ₦{product.price.toLocaleString()}
                    </span>
                    <span className="text-xl font-semibold text-red-600">
                      ₦{product.discountPrice.toLocaleString()}
                    </span>
                    <Badge className="ml-2 bg-red-600">
                      Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                    </Badge>
                  </div>
                ) : (
                  <span className="text-xl font-semibold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              
              {/* Stock display */}
              <div className="mt-3 flex items-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm
                  ${currentStock > 10 
                    ? "bg-green-100 text-green-800" 
                    : currentStock > 0 
                      ? "bg-orange-100 text-orange-800" 
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full mr-2
                    ${currentStock > 10 
                      ? "bg-green-600" 
                      : currentStock > 0 
                        ? "bg-orange-600" 
                        : "bg-red-600"
                    }`}>
                  </div>
                  {currentStock > 10 
                    ? `In Stock: ${currentStock} units available` 
                    : currentStock > 0 
                      ? `Limited Stock: Only ${currentStock} left` 
                      : "Out of Stock"
                  }
                </div>
              </div>
            </div>
            
            <Separator />
            
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="specifications" className="flex-1">Specifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <div className="text-sm text-gray-700">
                  <p>{product.description}</p>
                  
                  {product.material && (
                    <div className="mt-3">
                      <span className="font-medium">Material:</span> {product.material}
                    </div>
                  )}
                  
                  {product.careInstructions && (
                    <div className="mt-2">
                      <span className="font-medium">Care:</span> {product.careInstructions}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-4">
                {product.specifications ? (
                  <div className="text-sm">
                    {Object.entries(product.specifications as Record<string, string>).map(([key, value], index) => (
                      <div key={index} className="flex py-2 border-b border-gray-200">
                        <span className="font-medium w-1/3">{key}</span>
                        <span className="w-2/3 text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No specifications available.</p>
                )}
              </TabsContent>
            </Tabs>
            
            <Separator />
            
            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className={`border-2 rounded-full overflow-hidden p-0 ${
                        selectedColor === color
                          ? 'ring-2 ring-[#D4AF37] ring-offset-2'
                          : ''
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ 
                          backgroundColor: COLOR_HEX_MAP[color] || color,
                          border: color.toLowerCase() === "white" ? "1px solid #e2e8f0" : "none"
                        }}
                      />
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
                    <Button
                      key={index}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      className={selectedSize === size 
                        ? "bg-black text-white hover:bg-[#D4AF37]" 
                        : "hover:bg-gray-100"
                      }
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity selector */}
            <div>
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={decreaseQuantity}
                  disabled={selectedQuantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="mx-4 text-center w-8">{selectedQuantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={increaseQuantity}
                  disabled={selectedQuantity >= currentStock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {/* Add to cart / wishlist */}
            <div className="flex space-x-3 mt-6">
              <Button
                className="flex-1 bg-black text-white hover:bg-[#D4AF37]"
                onClick={handleAddToCart}
                disabled={currentStock === 0 || addToCartMutation.isPending}
              >
                {addToCartMutation.isPending ? "Adding..." : "Add to Bag"}
              </Button>
              
              <Button
                variant={inWishlist ? "default" : "outline"}
                className={`flex items-center justify-center ${inWishlist ? 'bg-[#D4AF37] hover:bg-[#C09A27] text-white' : ''}`}
                onClick={handleAddToWishlist}
                disabled={wishlistLoading}
              >
                {wishlistLoading ? (
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Heart className="h-4 w-4 mr-2" fill={inWishlist ? "currentColor" : "none"} />
                )}
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
            
            {/* Link to full product page */}
            <div className="text-center">
              <Link 
                href={`/products/${product.id}`}
                className="text-sm text-[#D4AF37] hover:underline"
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;