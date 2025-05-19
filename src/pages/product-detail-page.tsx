// @ts-nocheck

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Heart, Share2, ShoppingBag, Loader2, ArrowLeft, AlertCircle, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useInventory } from "@/hooks/use-inventory";
import { useGuestCart } from "@/hooks/use-guest-cart";
import { useWishlist } from "@/hooks/use-wishlist";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/products/ProductCard";
import RecommendationsCarousel from "@/components/recommendations/RecommendationsCarousel";
import ProductRecommendationCarousel from "@/components/products/ProductRecommendationCarousel";
import ColorCustomizationPreview from "@/components/products/ColorCustomizationPreview";
import ReturnPolicy from "@/components/ReturnPolicy";
import { Product } from "@/lib/schema";

// Define interfaces for product specification structure
interface ProductSpecifications {
  [key: string]: string;
}

// Component to handle rendering specifications with proper typing
const SpecificationsSection: React.FC<{ specifications: any }> = ({ specifications }) => {
  const parsedSpecs = typeof specifications === 'string' 
    ? JSON.parse(specifications) as ProductSpecifications
    : specifications as ProductSpecifications;
    
  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
      <ul className="space-y-2 text-gray-700">
        {Object.entries(parsedSpecs).map(([key, value]) => (
          <li key={key}>
            <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>{" "}
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Common clothing sizes
const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

// Common shoe sizes (EU)
const SHOE_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

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

const ProductDetailPage = () => {
  const [, navigate] = useLocation();
  const [_, params] = useRoute<{ id: string }>("/products/:id");
  const productId = parseInt(params?.id || "0");
  const { toast } = useToast();
  const { user } = useAuth();
  const { getStockLevel, updateStockLevel, stockStatus } = useInventory();
  const { addToCart: addToGuestCart } = useGuestCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [currentStock, setCurrentStock] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    queryFn: async () => {
      if (!productId) throw new Error("Invalid product ID");
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
  });

  // Effect to sync product stock with inventory context
  useEffect(() => {
    if (product && product.id) {
      // Check if we have the stock level in context
      const stockFromContext = getStockLevel(product.id);
      if (stockFromContext > 0) {
        // Use stock from context if available
        setCurrentStock(stockFromContext);
      } else if (product.quantity > 0) {
        // Initialize from product data if not in context
        updateStockLevel(product.id, product.quantity);
        setCurrentStock(product.quantity);
      }
      
      // Initialize color and size with first available option if present
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product, getStockLevel, updateStockLevel]);

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: product?.category }],
    queryFn: async () => {
      if (!product) return [];
      const res = await fetch(`/api/products?category=${product.category}`);
      if (!res.ok) throw new Error("Failed to fetch related products");
      const data = await res.json();
      // Filter out the current product and limit to 4 products
      return data
        .filter((p: Product) => p.id !== productId)
        .slice(0, 4);
    },
    enabled: !!product,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      // User authentication check is now handled in handleAddToCart
      // so we don't need to check it here again
      if (currentStock < quantity) {
        throw new Error(`Only ${currentStock} items available`);
      }
      const res = await apiRequest("POST", "/api/cart", {
        productId,
        quantity,
        selectedColor,
        selectedSize,
      });
      return await res.json();
    },
    onSuccess: () => {
      // Update inventory after successful cart addition
      const newStock = currentStock - quantity;
      updateStockLevel(productId, newStock);
      setCurrentStock(newStock);
      
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${product?.name} has been added to your cart.${newStock <= 5 ? ` Only ${newStock} remaining!` : ''}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add to cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Wishlist functionality is now handled by the useWishlist hook

  const handleAddToCart = () => {
    // Check if color selection is required but not selected
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        description: "You need to select a color before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    // Check if size selection is required but not selected
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    // Check if product is in stock
    if (currentStock < quantity) {
      toast({
        title: "Not enough stock",
        description: `Only ${currentStock} items available`,
        variant: "destructive",
      });
      return;
    }
    
    // If user is logged in, use authenticated cart
    if (user) {
      addToCartMutation.mutate();
    } 
    // Otherwise use guest cart
    else {
      if (!product) return;
      
      // Add to guest cart
      addToGuestCart(product, quantity, selectedColor, selectedSize);
      
      // Update inventory to reflect cart addition
      const newStock = currentStock - quantity;
      updateStockLevel(productId, newStock);
      setCurrentStock(newStock);
      
      // Show success toast
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.${newStock <= 5 ? ` Only ${newStock} remaining!` : ''}`,
      });
    }
  };

  // Check if product is in wishlist
  const inWishlist = product ? isInWishlist(product.id) : false;
  
  // Handle wishlist operations using the useWishlist hook
  const handleAddToWishlist = async () => {
    if (!product) return;
    
    setWishlistLoading(true);
    try {
      await toggleWishlistItem(product.id, product.name);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `DASH - ${product?.name}`,
          text: `Check out ${product?.name} on DASH`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      toast({
        title: "Sharing not supported",
        description: "Web Share API is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  const increaseQuantity = () => {
    if (quantity < currentStock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= currentStock) {
      setQuantity(value);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-medium mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => {
            navigate("/products");
            window.scrollTo(0, 0);
          }}>
            Browse All Products
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | DASH</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow py-8">
          <Container>
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => {
                window.history.back();
                // Ensure scroll to top even on back navigation
                window.scrollTo(0, 0);
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* Product Images with Color Customization */}
              <div>
                {/* Use our new Color Customization Preview component */}
                <ColorCustomizationPreview
                  productName={product.name}
                  images={product.images}
                  colors={product.colors || []}
                  colorHexMap={COLOR_HEX_MAP}
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                  currentStock={currentStock}
                />
              </div>

              {/* Product Info */}
              <div>
                <h3 className="text-sm text-gray-600 mb-1">
                  <span 
                    className="cursor-pointer hover:text-[#D4AF37] transition-colors"
                    onClick={() => {
                      navigate(`/products?brand=${encodeURIComponent(product.brand)}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {product.brand}
                  </span>
                  {product.brandType && product.brandType !== product.brand && (
                    <span 
                      className="ml-2 cursor-pointer hover:text-[#D4AF37] transition-colors"
                      onClick={() => {
                        navigate(`/products?brandType=${encodeURIComponent(product.brandType || '')}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      ({product.brandType})
                    </span>
                  )}
                </h3>
                <h1 className="text-2xl font-medium mb-2">{product.name}</h1>
                
                {/* Customer Ratings */}
                {product.rating !== null && product.rating > 0 && (
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`w-4 h-4 ${
                            star <= Math.floor(product.rating || 0) 
                              ? "text-yellow-400" 
                              : star <= (product.rating || 0)
                                ? "text-yellow-400" 
                                : "text-gray-300"
                          }`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  {product.discountPrice ? (
                    <div>
                      <div className="flex items-center">
                        <span className="text-gray-600 text-lg line-through mr-3">
                          ₦{product.price.toLocaleString()}
                        </span>
                        <span className="text-red-600 text-2xl font-semibold">
                          ₦{product.discountPrice.toLocaleString()}
                        </span>
                        {product.discountPercentage && (
                          <span className="ml-3 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {product.discountPercentage}% OFF
                          </span>
                        )}
                        <span className={`ml-3 px-3 py-1.5 rounded-full text-sm font-medium
                          ${currentStock > 10 
                            ? "bg-green-100 text-green-800 border border-green-200" 
                            : currentStock > 0 
                              ? "bg-orange-100 text-orange-800 border border-orange-200" 
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          <span className={`inline-block w-2 h-2 rounded-full mr-1.5
                            ${currentStock > 10 
                              ? "bg-green-600" 
                              : currentStock > 0 
                                ? "bg-orange-600" 
                                : "bg-red-600"
                            }`}
                          ></span>
                          {currentStock > 10 
                            ? `${currentStock} in stock` 
                            : currentStock > 0 
                              ? `Only ${currentStock} left` 
                              : "Out of Stock"
                          }
                        </span>
                      </div>
                      {product.discountEndDate && (
                        <div className="mt-2 text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
                          <span className="font-medium">Limited Time Offer:</span> Discount valid until {new Date(product.discountEndDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-gray-800 text-2xl font-semibold">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <span className={`ml-3 px-3 py-1.5 rounded-full text-sm font-medium
                        ${currentStock > 10 
                          ? "bg-green-100 text-green-800 border border-green-200" 
                          : currentStock > 0 
                            ? "bg-orange-100 text-orange-800 border border-orange-200" 
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        <span className={`inline-block w-2 h-2 rounded-full mr-1.5
                          ${currentStock > 10 
                            ? "bg-green-600" 
                            : currentStock > 0 
                              ? "bg-orange-600" 
                              : "bg-red-600"
                          }`}
                        ></span>
                        {currentStock > 10 
                          ? `${currentStock} in stock` 
                          : currentStock > 0 
                            ? `Only ${currentStock} left` 
                            : "Out of Stock"
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Availability indicator removed to avoid duplication */}

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <div
                          key={color}
                          className={`flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer transition-all ${
                            selectedColor === color 
                              ? "border-2 border-[#D4AF37] bg-[#F8F4E3]" 
                              : "border border-gray-300 hover:border-[#D4AF37]"
                          }`}
                          onClick={() => setSelectedColor(color)}
                        >
                          <span 
                            className="inline-block w-3 h-3 rounded-full mr-1" 
                            style={{ backgroundColor: COLOR_HEX_MAP[color] || color }}
                          />
                          {color}
                          {selectedColor === color && (
                            <Check className="h-3 w-3 ml-1 text-[#D4AF37]" />
                          )}
                        </div>
                      ))}
                    </div>
                    {product.colors.length > 0 && !selectedColor && (
                      <p className="text-red-500 text-xs mt-1">Please select a color</p>
                    )}
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <div
                          key={size}
                          className={`flex items-center justify-center px-3 py-2 min-w-10 rounded-md cursor-pointer transition-all ${
                            selectedSize === size 
                              ? "border-2 border-[#D4AF37] bg-[#F8F4E3] font-medium" 
                              : "border border-gray-300 hover:border-[#D4AF37]"
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                          {selectedSize === size && (
                            <Check className="h-3 w-3 ml-1 text-[#D4AF37]" />
                          )}
                        </div>
                      ))}
                    </div>
                    {product.sizes.length > 0 && !selectedSize && (
                      <p className="text-red-500 text-xs mt-1">Please select a size</p>
                    )}
                    <div className="mt-2">
                      <Button variant="link" className="text-xs p-0 h-auto" onClick={() => window.open('#', '_blank')}>
                        Size Guide
                      </Button>
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                {currentStock > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Quantity</h3>
                    <div className="flex items-center">
                      <button
                        className="w-10 h-10 border border-gray-300 flex items-center justify-center"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={currentStock}
                        className="w-16 h-10 text-center mx-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        className="w-10 h-10 border border-gray-300 flex items-center justify-center"
                        onClick={increaseQuantity}
                        disabled={quantity >= currentStock}
                      >
                        +
                      </button>
                    </div>
                    {currentStock <= 5 && (
                      <p className="text-xs text-red-600 mt-2 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Limited stock available
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 mb-8">
                  {currentStock > 0 ? (
                    <Button
                      className="w-full bg-black hover:bg-[#D4AF37] text-white"
                      onClick={handleAddToCart}
                      disabled={addToCartMutation.isPending || currentStock === 0}
                    >
                      {addToCartMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ShoppingBag className="mr-2 h-4 w-4" />
                      )}
                      {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                    </Button>
                  ) : (
                    <Button className="w-full bg-gray-300 text-gray-600" disabled>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Out of Stock
                    </Button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={inWishlist ? "default" : "outline"}
                      className={`w-full ${inWishlist ? 'bg-[#D4AF37] hover:bg-[#C09A27] text-white' : ''}`}
                      onClick={handleAddToWishlist}
                      disabled={wishlistLoading}
                    >
                      {wishlistLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="mr-2 h-4 w-4" fill={inWishlist ? "currentColor" : "none"} />
                      )}
                      {user 
                        ? (inWishlist ? "Remove from Wishlist" : "Add to Wishlist") 
                        : "Wishlist (Login Required)"
                      }
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleShare}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Product Details Tabs */}
                <Tabs defaultValue="description">
                  <TabsList className="w-full">
                    <TabsTrigger value="description" className="flex-1">
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="details" className="flex-1">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="shipping" className="flex-1">
                      Shipping
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </TabsContent>

                  <TabsContent value="details" className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Basic Information</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li>
                            <span className="font-medium">Brand:</span>{" "}
                            {product.brand}
                          </li>
                          {product.brandType && product.brandType !== product.brand && (
                            <li>
                              <span className="font-medium">Brand Type:</span>{" "}
                              {product.brandType}
                            </li>
                          )}
                          <li>
                            <span className="font-medium">Category:</span>{" "}
                            {product.category}
                          </li>
                          {product.subcategory && (
                            <li>
                              <span className="font-medium">Subcategory:</span>{" "}
                              {product.subcategory}
                            </li>
                          )}
                          <li>
                            <span className="font-medium">SKU:</span> P{product.id}
                          </li>
                        </ul>
                      </div>
                      
                      {product.material && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Material</h3>
                          <p className="text-gray-700">{product.material}</p>
                        </div>
                      )}
                      
                      {/* Specifications Section - Temporarily disabled due to type issues */}
                      
                      {product.careInstructions && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Care Instructions</h3>
                          <p className="text-gray-700">{product.careInstructions}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="shipping" className="pt-4">
                    <div className="text-gray-700 space-y-4">
                      <p>
                        <span className="font-medium">Delivery:</span> 3-5
                        business days
                      </p>
                      
                      <div className="border-t border-b border-gray-100 py-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Returns:</span>
                          <ReturnPolicy productName={product.name} />
                        </div>
                        <div className="mt-2">
                          <ReturnPolicy simplified productName={product.name} />
                        </div>
                      </div>
                      
                      <p>
                        <span className="font-medium">Shipping:</span> Free
                        shipping on orders over ₦50,000
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Personalized Recommendations */}
            <RecommendationsCarousel 
              productId={productId} 
              category={product?.category}
              brand={product?.brand}
              title="Recommended For You" 
            />

            {/* Enhanced Personalized Recommendations */}
            <div className="mt-12">
              <ProductRecommendationCarousel
                title="You May Also Like"
                description="Products similar to what you're viewing"
                productId={product.id}
                category={product.category}
                brand={product.brand}
                type="similar"
                limit={8}
              />
              
              <ProductRecommendationCarousel
                title="Popular in This Category"
                description="Top-rated products our customers love"
                category={product.category}
                type="popular"
                limit={8}
              />
            </div>
          </Container>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;
