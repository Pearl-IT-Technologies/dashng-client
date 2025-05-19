import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
// Use URL paths that work with Vite
const summerCollectionImage = "/assets/summer-collection.png";
const autumnCollectionImage = "/assets/autumn-collection.png";
const winterCollectionImage = "/assets/winter-collection.png";
const formalCollectionImage = "/assets/formal-collection.jpg";

interface Collection {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

const collections: Collection[] = [
  {
    id: 1,
    title: "Summer Collection",
    description: "Effortless style for the warmer days",
    image: summerCollectionImage,
    link: "/products?category=summer",
  },
  {
    id: 2,
    title: "Autumn Elegance",
    description: "Sophisticated pieces for the changing season",
    image: autumnCollectionImage,
    link: "/products?category=autumn",
  },
  {
    id: 3,
    title: "Winter Essentials",
    description: "Luxurious layers to stay warm and stylish",
    image: winterCollectionImage,
    link: "/products?category=winter",
  },
  {
    id: 4,
    title: "Formal Wear",
    description: "Elegant attire for special occasions and professional settings",
    image: formalCollectionImage,
    link: "/products?category=formal",
  },
];

const SeasonalCollection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % collections.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + collections.length) % collections.length);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-16">
      <Container>
        <h2 className="text-3xl font-serif mb-10 text-center">Our Collections</h2>
        
        <div className="relative overflow-hidden h-[500px] rounded-xl">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className={`absolute inset-0 transition-opacity duration-1000 
                ${index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            >
              <div className="relative h-full w-full">
                <div className="absolute inset-0">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                </div>
                
                <div className="absolute inset-0 flex items-center">
                  <div className="text-white p-8 md:p-16 max-w-md">
                    <h3 className="text-3xl md:text-4xl font-serif mb-4">{collection.title}</h3>
                    <p className="text-lg md:text-xl opacity-90 mb-8">
                      {collection.description}
                    </p>
                    <Link href={collection.link}>
                      <Button className="bg-[#D4AF37] hover:bg-[#C09C2C] text-black">
                        Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Slider Navigation */}
          <div className="absolute bottom-8 right-8 z-20 flex space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 border-white/40"
              onClick={prevSlide}
            >
              <ArrowRight className="h-5 w-5 text-white rotate-180" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 border-white/40"
              onClick={nextSlide}
            >
              <ArrowRight className="h-5 w-5 text-white" />
            </Button>
          </div>
          
          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-8 z-20 flex space-x-2">
            {collections.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? "bg-[#D4AF37]" : "bg-white/50"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SeasonalCollection;