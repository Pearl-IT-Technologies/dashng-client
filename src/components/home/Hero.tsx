import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80" 
          alt="Fashion model in luxury clothing" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="text-center text-white max-w-xl">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">Luxury Redefined</h2>
          <p className="text-sm md:text-base mb-8 max-w-lg mx-auto">
            Discover the new collection of curated pieces from the world's most exclusive designers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/women">
              <Button className="bg-white text-black hover:bg-[#D4AF37] hover:text-white transition-colors border-none w-full sm:w-auto">
                Shop Women
              </Button>
            </Link>
            <Link href="/men">
              <Button variant="outline" className="bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors w-full sm:w-auto">
                Shop Men
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
