import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/schema";

const BrandsPage = () => {
  const [location, navigate] = useLocation();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Extract brand types and brands from URL parameter if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const brandParam = urlParams.get('brand');
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
  }, [location]);

  // Fetch all products to extract unique brands and brand types
  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    }
  });
  const products = data.data ?? [];

  // Group products by brand and brand type
  const brandGroups = products?.reduce((acc, product) => {
    // Skip products without brand info
    if (!product.brand) return acc;

    // Create brand if it doesn't exist
    if (!acc[product.brand]) {
      acc[product.brand] = {
        brandTypes: {},
        count: 0
      };
    }

    // Increment brand count
    acc[product.brand].count++;

    // Handle brand types
    if (product.brandType && product.brandType !== product.brand) {
      if (!acc[product.brand].brandTypes[product.brandType]) {
        acc[product.brand].brandTypes[product.brandType] = 0;
      }
      acc[product.brand].brandTypes[product.brandType]++;
    }

    return acc;
  }, {} as Record<string, { brandTypes: Record<string, number>, count: number }>);

  // Sort brands by count (most products first)
  const sortedBrands = brandGroups ? 
    Object.entries(brandGroups)
      .sort((a, b) => b[1].count - a[1].count) 
    : [];

  return (
    <>
      <Helmet>
        <title>Our Brands | DASH</title>
        <meta name="description" content="Explore our curated collection of luxury brands at DASH. Find the perfect designer pieces from world-renowned fashion houses." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-12">
          <Container>
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Our Brands</h1>
              <p className="text-gray-600 max-w-3xl">
                Discover our curated selection of premium brands, each offering unique styles and exceptional craftsmanship that define luxury fashion.
              </p>
            </div>
            
            {isLoading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading brands...</p>
              </div>
            ) : sortedBrands.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedBrands.map(([brand, data]) => (
                  <div key={brand} className={`p-6 rounded-lg border ${selectedBrand === brand ? 'border-[#D4AF37] bg-[#FAF7ED]' : 'border-gray-200 hover:border-[#D4AF37]'} transition-all`}>
                    <h2 className="text-xl font-medium mb-2">
                      <Link href={`/products?brand=${encodeURIComponent(brand)}`} className="hover:text-[#D4AF37] transition-colors">
                        {brand}
                      </Link>
                      <span className="text-sm font-normal text-gray-500 ml-2">({data.count} products)</span>
                    </h2>
                    
                    {Object.keys(data.brandTypes).length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">Brand Collections:</h3>
                        <ul className="space-y-1">
                          {Object.entries(data.brandTypes).map(([type, count]) => (
                            <li key={type}>
                              <Link 
                                href={`/products?brandType=${encodeURIComponent(type)}`}
                                className="text-gray-700 hover:text-[#D4AF37] transition-colors text-sm"
                              >
                                {type} <span className="text-gray-400">({count})</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-sm"
                        onClick={() => navigate(`/products?brand=${encodeURIComponent(brand)}`)}
                      >
                        View All {brand} Products
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-500">No brands found.</p>
              </div>
            )}
          </Container>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default BrandsPage;