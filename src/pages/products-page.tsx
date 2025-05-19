// @ts-nocheck

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Loader2, Filter, ChevronDown, ChevronUp } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import RecommendationsCarousel from "@/components/recommendations/RecommendationsCarousel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Product } from "@/lib/schema";

interface FilterOptions {
  category?: string;
  subcategory?: string;
  brand?: string;
  brandType?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isNewArrival?: boolean;
  search?: string;
}

const ProductsPage = () => {
  const [location] = useLocation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    inStock: true,
  });
  const [priceRange, setPriceRange] = useState([0, 500000]);
  
  // Extract category from URL path if present
  useEffect(() => {
    // Extract query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const brandParam = urlParams.get('brand');
    const searchParam = urlParams.get('search');
    
    // Set initial filters
    const initialFilters: FilterOptions = { inStock: true };
    
    // Apply brand filter from URL parameter if present
    if (brandParam) {
      initialFilters.brand = brandParam;
    }
    
    // Apply search filter from URL parameter if present
    if (searchParam) {
      initialFilters.search = searchParam;
    }
    
    // Apply filters based on URL path
    if (location.includes('/women') || location.includes('/men')) {
      const gender = location.includes('/women') ? 'women' : 'men';
      
      if (location.includes('/clothing')) {
        initialFilters.category = 'clothing';
        initialFilters.subcategory = gender;
      } else if (location.includes('/bags')) {
        initialFilters.category = 'bags';
        initialFilters.subcategory = gender;
      } else if (location.includes('/jewelry')) {
        initialFilters.category = 'jewelry';
        initialFilters.subcategory = gender;
      } else if (location.includes('/accessories')) {
        initialFilters.category = 'accessories';
        initialFilters.subcategory = gender;
      } else {
        initialFilters.subcategory = gender;
      }
    } else if (location.includes('/new-arrivals')) {
      initialFilters.isNewArrival = true;
    } else if (location.includes('/sale')) {
      // We can't directly filter by discount, so we'll handle this in UI
    }
    
    setFilters(initialFilters);
  }, [location]);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.subcategory) queryParams.append('subcategory', filters.subcategory);
      if (filters.brand) queryParams.append('brand', filters.brand);
      if (filters.brandType) queryParams.append('brandType', filters.brandType);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.inStock !== undefined) queryParams.append('inStock', filters.inStock.toString());
      if (filters.isNewArrival) queryParams.append('isNewArrival', filters.isNewArrival.toString());
      if (filters.search) queryParams.append('search', filters.search);
      
      const res = await fetch(`/api/products?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      let data = await res.json();
      
      // If we're on the sale page, filter products with discountPrice
      if (location.includes('/sale')) {
        data = data.filter((product: Product) => product.discountPrice !== null && product.discountPrice !== undefined);
      }
      
      // If we have a search parameter, filter results on the client side as well
      if (filters.search && data.length > 0) {
        const searchTerm = filters.search.toLowerCase();
        data = data.filter((product: Product) => {
          return (
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm))
          );
        });
      }
      
      return data;
    }
  });

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1]
    }));
  };

  const handleBrandFilter = (brand: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      brand: checked ? brand : undefined,
      brandType: checked ? brand : undefined
    }));
  };

  const handleInStockFilter = (checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      inStock: checked
    }));
  };

  const getPageTitle = () => {
    // If we have a search filter, show it in the title
    if (filters.search) {
      return `Search Results for "${filters.search}"`;
    }
    
    // If we have a brand filter, show it in the title
    if (filters.brand) {
      return `${filters.brand} Collection`;
    }
    
    // Otherwise use URL path to determine title
    if (location.includes('/women/clothing')) return "Women's Clothing";
    if (location.includes('/men/clothing')) return "Men's Clothing";
    if (location.includes('/women/bags')) return "Women's Bags";
    if (location.includes('/men/bags')) return "Men's Bags";
    if (location.includes('/women/jewelry')) return "Women's Jewelry";
    if (location.includes('/men/jewelry')) return "Men's Jewelry";
    if (location.includes('/women/accessories')) return "Women's Accessories";
    if (location.includes('/men/accessories')) return "Men's Accessories";
    if (location.includes('/women')) return "Women's Collection";
    if (location.includes('/men')) return "Men's Collection";
    if (location.includes('/new-arrivals')) return "New Arrivals";
    if (location.includes('/sale')) return "Sale Items";
    return "All Products";
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()} | DASH</title>
        <meta name="description" content={`Shop ${getPageTitle().toLowerCase()} from DASH's exclusive luxury collection.`} />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8">
          <Container>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-serif font-semibold mb-2">{getPageTitle()}</h1>
              <p className="text-gray-600">
                Discover our curated selection of luxury {getPageTitle().toLowerCase()}
              </p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-6">
              <Button 
                variant="outline" 
                onClick={toggleFilters}
                className="w-full flex items-center justify-between"
              >
                <span className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </span>
                {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters - Desktop always visible, Mobile conditionally visible */}
              <div className={`${filtersOpen ? 'block' : 'hidden'} md:block w-full md:w-64 space-y-6`}>
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 500000]}
                      max={500000}
                      step={5000}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      className="mb-4"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span>₦{priceRange[0].toLocaleString()}</span>
                      <span>₦{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Brands</h3>
                  <div className="space-y-2">
                    {['Luxury Brand', 'Designer Collection', 'Premium Menswear', 'Fine Jewelry', 'Haute Couture', 'Modern Luxury'].map((brand) => (
                      <div key={brand} className="flex items-center">
                        <Checkbox 
                          id={brand}
                          checked={filters.brand === brand}
                          onCheckedChange={(checked) => handleBrandFilter(brand, checked as boolean)}
                        />
                        <Label htmlFor={brand} className="ml-2 text-sm font-normal">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Availability</h3>
                  <div className="flex items-center">
                    <Checkbox 
                      id="inStock"
                      checked={filters.inStock}
                      onCheckedChange={(checked) => handleInStockFilter(checked as boolean)}
                    />
                    <Label htmlFor="inStock" className="ml-2 text-sm font-normal">
                      In Stock
                    </Label>
                  </div>
                </div>
              </div>
              
              {/* Products */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : products && products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                    
                    {/* Personalized recommendations after browsed products */}
                    <div className="mt-16">
                      <RecommendationsCarousel 
                        category={filters.category} 
                        brand={filters.brand}
                        title="Recommended For You" 
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No products found matching your criteria.</p>
                    <Button 
                      variant="link" 
                      onClick={() => setFilters({ inStock: true })}
                      className="mt-2"
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ProductsPage;
