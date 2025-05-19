import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
const streetStyleImage = "https://images.unsplash.com/photo-1483985988355-763728e1935b";
const summerCollectionImage = "https://images.unsplash.com/photo-1469334031218-e382a71b716b";
const luxuryAccessoriesImage = "https://images.unsplash.com/photo-1604176424472-00dea60aeb2c";

interface SlideImage {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
}

// Feature slider images
const slides: SlideImage[] = [
  {
    id: 1,
    imageUrl: summerCollectionImage,
    title: "Summer Collection",
    subtitle: "Discover our latest arrivals",
    link: "/products?category=summer",
  },
  {
    id: 2,
    imageUrl: luxuryAccessoriesImage,
    title: "Luxury Accessories",
    subtitle: "Elevate your style",
    link: "/products?category=accessories",
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    title: "Formal Wear",
    subtitle: "Stand out at any event",
    link: "/products?category=formal",
  },
  {
    id: 4,
    imageUrl: streetStyleImage,
    title: "Street Style",
    subtitle: "Urban fashion at its best",
    link: "/products?category=streetwear",
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    title: "Designer Shoes",
    subtitle: "Walk in confidence",
    link: "/products?category=shoes",
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    title: "Premium Jewelry",
    subtitle: "Timeless elegance",
    link: "/products?category=jewelry",
  },
];

const FeaturedSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  // Slide transition effect
  useEffect(() => {
    if (isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 700); // Match this with CSS transition time

      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
  };

  const goToNextSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      goToNextSlide();
    } else if (touchStart - touchEnd < -75) {
      // Swipe right
      goToPrevSlide();
    }
  };

  return (
    <section className="relative h-[600px] overflow-hidden">
      <div
        className="h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out 
            ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <div className="absolute inset-0">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <Container className="relative h-full">
              <div className="absolute bottom-1/4 max-w-2xl text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 text-white/90">{slide.subtitle}</p>
                <Link href={slide.link}>
                  <Button className="bg-[#D4AF37] hover:bg-black text-black hover:text-white border border-[#D4AF37] transition-colors">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </Container>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-4 z-20 transform -translate-y-1/2">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full h-10 w-10 border-white/20 text-white"
          onClick={goToPrevSlide}
          disabled={isTransitioning}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-4 z-20 transform -translate-y-1/2">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full h-10 w-10 border-white/20 text-white"
          onClick={goToNextSlide}
          disabled={isTransitioning}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-[#D4AF37] w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedSlider;