import { useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { Button } from "@/components/ui/button";

const CheckoutPage = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  // Use the combined cart hook for both guest and authenticated users
  const { cartItems, isLoading, total } = useCart();

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (!isLoading && (!cartItems || cartItems.length === 0)) {
      navigate("/cart");
    }
  }, [cartItems, isLoading, navigate]);

  const calculateSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    // The total is already calculated in the useCart hook, but we keep this
    // function for compatibility with the existing code
    return total;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
        <Footer />
      </div>
    );
  }

  // We allow guest checkout now, so no need to block access if user is not authenticated

  return (
    <>
      <Helmet>
        <title>Checkout | DASH</title>
        <meta
          name="description"
          content="Complete your purchase at DASH luxury fashion."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow py-8">
          <Container>
            <h1 className="text-2xl font-serif font-semibold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <CheckoutForm totalAmount={calculateSubtotal()} />
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-gray-50 p-6 rounded-md">
                  <h2 className="text-lg font-medium mb-4">Order Summary</h2>

                  {/* Cart Items Summary */}
                  <div className="space-y-4 mb-6">
                    {cartItems?.map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex items-start">
                          <div className="w-10 h-10 mr-3 overflow-hidden rounded-md">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          ₦
                          {(
                            (item.product.discountPrice || item.product.price) *
                            item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ₦{calculateSubtotal().toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>

                    <div className="border-t pt-3 flex justify-between font-bold">
                      <span>Total</span>
                      <span>₦{calculateSubtotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CheckoutPage;
