import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "../schema";

interface RecommendationsCarouselProps {
  productId?: number;  // Current product ID (for "similar products" recommendations)
  category?: string;   // Current category (for category-based recommendations)
  brand?: string;      // Current brand (for brand-based recommendations)
  limit?: number;      // Max number of recommendations to show
  title?: string;      // Custom title for the carousel
}

const RecommendationsCarousel: React.FC<RecommendationsCarouselProps> = ({
  productId,
  category,
  brand,
  limit = 6,
  title = "Recommended For You"
}) => {
  const { user } = useAuth();
  const [visibleProducts, setVisibleProducts] = useState(4); // Default visible products on desktop
  const [startIndex, setStartIndex] = useState(0);
  
  // Track viewed products in localStorage
  useEffect(() => {
    if (productId) {
      const viewedProducts = JSON.parse(localStorage.getItem("viewedProducts") || "[]");
      
      // Add current product to the front if it's not already the first one
      if (viewedProducts[0] !== productId) {
        // Remove product if it exists elsewhere in the array
        const filteredProducts = viewedProducts.filter((id: number) => id !== productId);
        
        // Add to front and limit array length
        const updatedProducts = [productId, ...filteredProducts].slice(0, 20);
        localStorage.setItem("viewedProducts", JSON.stringify(updatedProducts));
      }
    }
  }, [productId]);
  
  // Adjust visible products based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleProducts(1);
      } else if (window.innerWidth < 768) {
        setVisibleProducts(2);
      } else if (window.innerWidth < 1024) {
        setVisibleProducts(3);
      } else {
        setVisibleProducts(4);
      }
    };
    
    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  // Get recommendations based on viewed products, user history, category, or brand
  const { data: recommendations, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/recommendations", { productId, category, brand, userId: user?.id }],
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams();
      if (productId) params.append("productId", productId.toString());
      if (category) params.append("category", category);
      if (brand) params.append("brand", brand);
      if (limit) params.append("limit", limit.toString());
      
      // Get viewed products from localStorage
      const viewedProducts = JSON.parse(localStorage.getItem("viewedProducts") || "[]");
      if (viewedProducts.length > 0) {
        params.append("viewedProducts", JSON.stringify(viewedProducts));
      }
      
      const res = await fetch(`/api/recommendations?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // If there are no recommendations, don't render the component
  if (!isLoading && (!recommendations || recommendations.length === 0)) {
    return null;
  }
  
  // Navigation functions
  const nextSlide = () => {
    if (recommendations && startIndex + visibleProducts < recommendations.length) {
      setStartIndex(startIndex + 1);
    }
  };
  
  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };
  
  // Determine if navigation buttons should be disabled
  const canGoNext = recommendations && startIndex + visibleProducts < recommendations.length;
  const canGoPrev = startIndex > 0;
  
  // Calculate visible products
  const visibleRecommendations = recommendations?.slice(startIndex, startIndex + visibleProducts);
  
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-medium">{title}</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevSlide}
            disabled={!canGoPrev}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextSlide}
            disabled={!canGoNext}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleRecommendations?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsCarousel;