import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/lib/schema";

const TrendingProducts = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState(0);
  const [maxPosition, setMaxPosition] = useState(0);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { limit: 8 }],
    queryFn: async () => {
      const res = await fetch("/api/products?limit=8");
      if (!res.ok) throw new Error("Failed to fetch trending products");
      const data = await res.json();
      // Filter to show a mix of products (could be filtered by a trend parameter in the future)
      return data.slice(0, 8);
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (sliderRef.current && products?.length) {
      const containerWidth = sliderRef.current.clientWidth;
      // Each product card + gap (use the same values as in the grid styles)
      const itemWidth = containerWidth / 2; // Two items visible on mobile
      const totalWidth = products.length * itemWidth;
      setMaxPosition(Math.max(0, totalWidth - containerWidth));
    }
  }, [products, isMounted]);

  const handleNext = () => {
    if (sliderRef.current) {
      const containerWidth = sliderRef.current.clientWidth;
      const newPosition = Math.min(position + containerWidth / 2, maxPosition);
      setPosition(newPosition);
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      const containerWidth = sliderRef.current.clientWidth;
      const newPosition = Math.max(0, position - containerWidth / 2);
      setPosition(newPosition);
    }
  };

  if (isLoading || !products) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-serif mb-2">Trending Now</h2>
            <p className="text-gray-600">Discover the most sought-after styles of the season</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handlePrev}
              disabled={position === 0}
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full w-10 h-10",
                position === 0 ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleNext}
              disabled={position >= maxPosition}
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full w-10 h-10",
                position >= maxPosition ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden" ref={sliderRef}>
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${position}px)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-2"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TrendingProducts;