import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ProductCard from "@/components/products/ProductCard";
import Container from "@/components/ui/Container";
import { Loader2 } from "lucide-react";
import { Product } from "@/lib/schema";

const FeaturedProducts = () => {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { featured: true }],
    queryFn: async () => {
      const res = await fetch("/api/products?featured=true");
      if (!res.ok) throw new Error("Failed to fetch featured products");
      return res.json();
    }
  });

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-center mb-4">Featured Products</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Curated selection of our most sought-after luxury pieces
        </p>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">No featured products available at the moment.</p>
        )}
        
        <div className="text-center mt-12">
          <Link href="/products">
            <Button variant="outline" className="border-black hover:bg-black hover:text-white transition-colors">
              View All Products
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedProducts;
