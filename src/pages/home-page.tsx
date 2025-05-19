import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import TrendingProducts from "@/components/home/TrendingProducts";
import SeasonalCollection from "@/components/home/SeasonalCollection";
import FeaturedSlider from "@/components/home/FeaturedSlider";
import Newsletter from "@/components/home/Newsletter";
import Instagram from "@/components/home/Instagram";
import ProductRecommendationCarousel from "@/components/products/ProductRecommendationCarousel";
import { useAuth } from "@/hooks/use-auth";

const HomePage = () => {
  const { user } = useAuth();
  const [viewedProducts, setViewedProducts] = useState<number[]>([]);
  
  // Get viewed products from localStorage
  useEffect(() => {
    try {
      const storedViewedProducts = localStorage.getItem("viewedProducts");
      if (storedViewedProducts) {
        setViewedProducts(JSON.parse(storedViewedProducts));
      }
    } catch (error) {
      console.error("Error loading viewed products:", error);
    }
  }, []);
  
  return (
    <>
      <Helmet>
        <title>DASH | Luxury Fashion</title>
        <meta name="description" content="DASH is a luxury fashion destination offering the finest curated selection of men's and women's clothing, accessories, and jewelry from world-renowned designers." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <FeaturedSlider />
          <Categories />
          <FeaturedProducts />
          <SeasonalCollection />
          <NewArrivals />
          
          {/* Personalized Recommendations Section */}
          <div className="container mx-auto px-4 py-8">
            {user ? (
              // For authenticated users, show personalized recommendations based on history
              <ProductRecommendationCarousel 
                title="Personalized For You"
                description="Products curated based on your browsing and purchase history"
                type="user-history"
                limit={8}
                autoscroll={true}
                autoscrollInterval={6000}
              />
            ) : viewedProducts.length > 0 ? (
              // For guest users who have viewed products
              <ProductRecommendationCarousel 
                title="Recommended For You"
                description="Based on products you've viewed"
                viewedProducts={viewedProducts}
                type="mixed"
                limit={8}
              />
            ) : (
              // For new users with no history
              <ProductRecommendationCarousel 
                title="You Might Like"
                description="Popular products our customers love"
                type="popular"
                limit={8}
                autoscroll={true}
              />
            )}
          </div>
          
          <TrendingProducts />
          <Newsletter />
          <Instagram />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
