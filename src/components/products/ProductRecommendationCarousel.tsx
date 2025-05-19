import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/schema";

interface ProductRecommendationCarouselProps {
  title?: string;
  description?: string;
  productId?: number;
  category?: string;
  brand?: string;
  type?: 'similar' | 'popular' | 'new' | 'user-history' | 'mixed';
  limit?: number;
  autoscroll?: boolean;
  autoscrollInterval?: number; // in milliseconds
  viewedProducts?: number[];
}

const ProductRecommendationCarousel = ({
  title = "Recommended for You",
  description,
  productId,
  category,
  brand,
  type = 'mixed',
  limit = 6,
  autoscroll = false,
  autoscrollInterval = 5000,
  viewedProducts = []
}: ProductRecommendationCarouselProps) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [itemsPerPageState, setItemsPerPageState] = useState(4);
  
  // Track responsive grid changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerPageState(4); // xl
      } else if (window.innerWidth >= 768) {
        setItemsPerPageState(3); // md
      } else {
        setItemsPerPageState(2); // mobile
      }
    };
    
    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const itemsPerPage = itemsPerPageState;

  // Build query parameters for the recommendations API
  const queryParams = new URLSearchParams();
  if (productId) queryParams.append('productId', productId.toString());
  if (category) queryParams.append('category', category);
  if (brand) queryParams.append('brand', brand);
  if (limit) queryParams.append('limit', limit.toString());
  if (type) queryParams.append('type', type);
  if (viewedProducts?.length > 0) queryParams.append('viewedProducts', JSON.stringify(viewedProducts));
  
  // Helper: Track product view in localStorage
  const trackProductView = useCallback((productId: number) => {
    try {
      // Get existing viewed products
      const viewedProductsStr = localStorage.getItem("viewedProducts");
      let viewedProductsList: number[] = viewedProductsStr ? JSON.parse(viewedProductsStr) : [];
      
      // Remove the product if it's already in the list
      viewedProductsList = viewedProductsList.filter(id => id !== productId);
      
      // Add product to the beginning of the list
      viewedProductsList.unshift(productId);
      
      // Limit to 20 most recent products
      if (viewedProductsList.length > 20) {
        viewedProductsList = viewedProductsList.slice(0, 20);
      }
      
      // Save back to localStorage
      localStorage.setItem("viewedProducts", JSON.stringify(viewedProductsList));
    } catch (error) {
      console.error("Error tracking product view:", error);
    }
  }, []);
  
  // Quick view handler
  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
    //@ts-ignore
    trackProductView(product.id); // Track quick view as product view
  }, [trackProductView]);

  // Fetch recommendations
  const { data: recommendations, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/recommendations', productId, category, brand, type, viewedProducts],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const next = useCallback(() => {
    if (!recommendations) return;
    setCurrentIndex(prevIndex => 
      prevIndex + itemsPerPage >= recommendations.length 
        ? 0 
        : prevIndex + itemsPerPage
    );
  }, [recommendations, itemsPerPage]);

  const prev = useCallback(() => {
    if (!recommendations) return;
    setCurrentIndex(prevIndex => 
      prevIndex - itemsPerPage < 0 
        ? Math.max(0, recommendations.length - itemsPerPage) 
        : prevIndex - itemsPerPage
    );
  }, [recommendations, itemsPerPage]);

  // Handle autoscrolling
  useEffect(() => {
    if (!autoscroll || !recommendations || recommendations.length <= itemsPerPage) return;
    
    const intervalId = setInterval(() => {
      next();
    }, autoscrollInterval);
    
    return () => clearInterval(intervalId);
  }, [autoscroll, autoscrollInterval, recommendations, next, itemsPerPage]);

  // Show error toast if recommendations fetch fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading recommendations",
        description: "Failed to load product recommendations.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        {description && <p className="text-gray-600 mb-6">{description}</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full h-64 rounded" />
              <Skeleton className="w-2/3 h-4 rounded" />
              <Skeleton className="w-full h-4 rounded" />
              <Skeleton className="w-1/2 h-4 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null; // Don't render anything if there are no recommendations
  }
  
  // Calculate whether to show navigation controls
  const showControls = recommendations.length > itemsPerPage;

  return (
    <div className="mb-16 relative">
      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView 
          product={quickViewProduct}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      )}
    
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">{title}</h2>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
        
        {showControls && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border border-gray-300 hover:bg-black hover:text-white transition-colors"
              onClick={prev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border border-gray-300 hover:bg-black hover:text-white transition-colors"
              onClick={next}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendations
          .slice(currentIndex, currentIndex + itemsPerPage)
          .map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard 
                product={product} 
                onAddedToCart={() => {
                  // When product is added to cart from recommendation, reset the current index
                  setCurrentIndex(0);
                  // Also track as a viewed product
                  //@ts-ignore
                  trackProductView(product.id);
                }}
              />
              
              {/* Quick view overlay button */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-sm"
                onClick={() => handleQuickView(product)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          ))}
      </div>

      {showControls && (
        <div className="flex justify-center mt-6 space-x-1">
          {Array.from(
            { length: Math.ceil(recommendations.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === Math.floor(currentIndex / itemsPerPage)
                    ? "w-6 bg-black"
                    : "w-2 bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(i * itemsPerPage)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ProductRecommendationCarousel;