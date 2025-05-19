import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Loader2, ShoppingBagIcon, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useCart } from "@/hooks/use-cart";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import CartItem from "@/components/cart/CartItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CartPage = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  
  // Use the combined cart hook that works for both guest and authenticated users
  const { 
    cartItems, 
    isLoading, 
    clearCart,
    isPending
  } = useCart();

  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/coupons/validate", { code });
      return await res.json();
    },
    onSuccess: (data) => {
      setAppliedCoupon(data);
      toast({
        title: "Coupon applied",
        description: `Coupon ${data.code} has been applied to your order.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Invalid coupon",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleClearCart = () => {
    clearCart();
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }
    applyCouponMutation.mutate(couponCode);
  };

  const calculateSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce(
      (total: number, item: any) =>
        total +
        (item.product.discountPrice || item.product.price) * item.quantity,
      0
    );
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    const subtotal = calculateSubtotal();
    if (appliedCoupon.isPercentage) {
      return (subtotal * appliedCoupon.discount) / 100;
    } else {
      return appliedCoupon.discount;
    }
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return subtotal - discount;
  };

  const handleCheckout = () => {
    // For authenticated users, go directly to checkout
    // For guest users, redirect to auth page
    if (user) {
      navigate("/checkout");
    } else {
      // Add a message for guest users
      toast({
        title: "Login required",
        description: "Please login or create an account to complete your purchase",
        variant: "default",
      });
      navigate("/auth?returnUrl=/checkout");
    }
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

  // We don't need this check anymore since we're using the combined cart hook
  // which handles both authenticated and guest users

  return (
    <>
      <Helmet>
        <title>Shopping Bag | DASH</title>
        <meta
          name="description"
          content="View and manage items in your shopping bag at DASH luxury fashion."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow py-8">
          <Container>
            <h1 className="text-2xl font-serif font-semibold mb-8">
              Your Shopping Bag
            </h1>

            {!cartItems || cartItems.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-md">
                <ShoppingBagIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-medium mb-2">
                  Your shopping bag is empty
                </h2>
                <p className="text-gray-600 mb-6">
                  Looks like you haven't added any items to your bag yet
                </p>
                <Link href="/products">
                  <Button className="bg-black hover:bg-[#D4AF37] text-white">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="border-b border-t">
                    {cartItems.map((item: any) => (
                      <CartItem
                        key={item.id}
                        id={item.id}
                        product={item.product}
                        quantity={item.quantity}
                      />
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={handleClearCart}
                      disabled={isPending}
                      className="text-sm"
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Clear Cart"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <div className="bg-gray-50 p-6 rounded-md">
                    <h2 className="text-lg font-medium mb-4">Order Summary</h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          ₦{calculateSubtotal().toLocaleString()}
                        </span>
                      </div>

                      {appliedCoupon && (
                        <div className="flex justify-between text-green-600">
                          <span>
                            Discount{" "}
                            {appliedCoupon.isPercentage
                              ? `(${appliedCoupon.discount}%)`
                              : ""}
                          </span>
                          <span>-₦{calculateDiscount().toLocaleString()}</span>
                        </div>
                      )}

                      <div className="border-t pt-3 flex justify-between font-medium">
                        <span>Total</span>
                        <span>₦{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Coupon Code */}
                    <div className="mb-6">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          disabled={applyCouponMutation.isPending || !!appliedCoupon}
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyCoupon}
                          disabled={
                            applyCouponMutation.isPending || !!appliedCoupon
                          }
                        >
                          {applyCouponMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </div>
                      {appliedCoupon && (
                        <p className="text-green-600 text-sm mt-2">
                          Coupon "{appliedCoupon.code}" applied
                        </p>
                      )}
                    </div>

                    <Button
                      className="w-full bg-black hover:bg-[#D4AF37] text-white"
                      onClick={handleCheckout}
                    >
                      {user ? "Proceed to Checkout" : "Login to Checkout"}
                    </Button>

                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Secure Checkout</AlertTitle>
                      <AlertDescription>
                        All transactions are secure and encrypted
                      </AlertDescription>
                    </Alert>
                    
                    {!user && (
                      <Alert className="mt-4 bg-gray-100">
                        <AlertTitle>Guest Shopper?</AlertTitle>
                        <AlertDescription className="text-sm">
                          Create an account during checkout to track your orders, save your shipping information, and enjoy member benefits.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Container>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CartPage;
