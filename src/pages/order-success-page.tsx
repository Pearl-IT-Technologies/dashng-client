import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";

const OrderSuccessPage = () => {
  const [location, setLocation] = useLocation();
  
  // Get order ID from URL if available
  const params = new URLSearchParams(location.split("?")[1]);
  const orderId = params.get("orderId");

  // Redirect to home if accessed directly without order context
  useEffect(() => {
    if (!location.includes("?orderId=")) {
      setLocation("/");
    }
  }, [location, setLocation]);

  return (
    <>
      <Helmet>
        <title>Order Confirmed</title>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow py-12">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-3xl font-serif font-medium mb-4">
                Thank You For Your Order!
              </h1>
              
              <p className="text-gray-600 mb-8">
                Your order has been placed successfully. We've sent you an email with all the details.
                {orderId && <span> Your order reference is: <span className="font-semibold">#{orderId}</span></span>}
              </p>
              
              <div className="bg-white shadow-md rounded-lg p-8 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <Package className="h-6 w-6 text-[#D4AF37] mr-2" />
                  <h2 className="text-lg font-medium">What's Next?</h2>
                </div>
                
                <div className="space-y-4 text-left mb-6">
                  <div className="flex">
                    <div className="bg-[#D4AF37] text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                      <span className="text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Order Processing</h3>
                      <p className="text-sm text-gray-600">
                        Our team is now processing your order. You'll receive an email once it's ready to ship.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-[#D4AF37] text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                      <span className="text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Shipping</h3>
                      <p className="text-sm text-gray-600">
                        Once your order ships, we'll send you a tracking number so you can follow your package.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-[#D4AF37] text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                      <span className="text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Delivery</h3>
                      <p className="text-sm text-gray-600">
                        Your items will be delivered to your shipping address. Estimated delivery time: 2-5 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button asChild variant="outline">
                  <Link href="/order-tracking" className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Track Your Order
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                
                <Button asChild className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white">
                  <Link href="/products" className="flex items-center">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default OrderSuccessPage;