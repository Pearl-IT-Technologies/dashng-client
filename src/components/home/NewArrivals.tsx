import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { Product } from "@/lib/schema";
// Use a URL path that works with Vite
const summerCollectionImage = "/assets/summer-collection.png";

const NewArrivals = () => {
  const { data: newArrivals } = useQuery<Product[]>({
    queryKey: ["/api/products", { isNewArrival: true }],
    queryFn: async () => {
      const res = await fetch("/api/products?isNewArrival=true");
      if (!res.ok) throw new Error("Failed to fetch new arrivals");
      return res.json();
    }
  });

  return (
    <section className="py-16">
      <Container>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-center mb-4">New Arrivals</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">The latest additions to our exclusive collection</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group h-96 overflow-hidden col-span-1 md:col-span-2">
            <img 
              src={summerCollectionImage} 
              alt="New collection - Summer" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center">
                <span className="inline-block text-xs text-white uppercase tracking-widest mb-2">Just Landed</span>
                <h3 className="text-white text-xl md:text-2xl font-semibold mb-4 font-serif">The Summer Collection</h3>
                <Link href="/new-arrivals">
                  <Button className="bg-white text-black hover:bg-[#D4AF37] hover:text-white transition-colors">
                    Discover Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="relative group h-96 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1516649075-7219009508ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
              alt="Accessories collection" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center">
                <span className="inline-block text-xs text-white uppercase tracking-widest mb-2">Limited Edition</span>
                <h3 className="text-white text-xl md:text-2xl font-semibold mb-4 font-serif">Statement Accessories</h3>
                <Link href="/accessories">
                  <Button className="bg-white text-black hover:bg-[#D4AF37] hover:text-white transition-colors">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default NewArrivals;
