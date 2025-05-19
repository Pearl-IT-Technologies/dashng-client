// @ts-nocheck

import { useEffect } from "react";
import {  Link } from "wouter";
import { useAuth} from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import {loginSchema, registerSchema } from "../types/auth"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import { useGuestCart } from "@/hooks/use-guest-cart";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWelcomeAnimation } from "@/hooks/use-welcome-animation";
import dashLogo from "@/assets/dash-logo-new.png";
import { useNavigation } from "react-day-picker";
const storeImage = "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3";
const adminPortalImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8";

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const navigate = useNavigation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { cartItems: guestCartItems, clearCart: clearGuestCart } = useGuestCart();
  const { toast } = useToast();
  const { setShowWelcomeAnimation } = useWelcomeAnimation();
  
  // Check if this is an admin login request
  const isAdminLogin = new URLSearchParams(window.location.search).get('admin') === 'true';

  // Transfer guest cart items to user cart
  const transferGuestCartToUserCart = async () => {
    if (guestCartItems.length === 0) return;
    
    try {
      // Add each guest cart item to user cart
      for (const item of guestCartItems) {
        await apiRequest("POST", "/api/cart", { 
          productId: item.product.id, 
          quantity: item.quantity,
          // Pass optional properties if your API supports them
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize
        });
      }
      
      // Clear guest cart after transfer
      clearGuestCart();
      
      toast({
        title: "Cart items transferred",
        description: "Your guest cart items have been added to your account",
      });
    } catch (error) {
      toast({
        title: "Error transferring cart",
        description: "Some items could not be transferred to your account",
        variant: "destructive",
      });
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // If user just logged in and there are guest cart items, transfer them
      if (guestCartItems.length > 0 && !user.isAdmin) {
        transferGuestCartToUserCart();
      }
      
      // Determine where to navigate after login
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
      
      // If user is an admin, send to admin dashboard
      if (user.isAdmin) {
        navigate(returnUrl || "/admin/dashboard");
      } else {
        // Regular users go to checkout or home
        navigate(returnUrl || "/");
      }
    }
  }, [user, navigate, guestCartItems]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const handleLogin = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        // Show the welcome animation upon successful login
        setShowWelcomeAnimation(true);
      }
    });
  };

  const handleRegister = (data: RegisterFormValues) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        // Show welcome animation upon successful registration
        setShowWelcomeAnimation(true);
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>{isAdminLogin ? 'Admin Sign In | DASH' : 'Sign In or Register | DASH'}</title>
        <meta name="description" content={isAdminLogin 
          ? "Sign in to your DASH admin account to manage products, orders, and settings." 
          : "Sign in to your DASH account or create a new one to enjoy exclusive offers and track your orders."} 
        />
      </Helmet>

      <div className="min-h-screen grid md:grid-cols-2">
        {/* Auth Forms */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-2">
                <img 
                  src={dashLogo} 
                  alt="DASH Logo" 
                  className="h-24 w-auto" 
                />
              </div>
              {isAdminLogin ? (
                <p className="text-gray-600">Administrator Access</p>
              ) : (
                <p className="text-gray-600">Your luxury fashion destination</p>
              )}
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className={`grid ${isAdminLogin ? 'grid-cols-1' : 'grid-cols-2'} mb-8`}>
                <TabsTrigger value="login">{isAdminLogin ? 'Admin Sign In' : 'Sign In'}</TabsTrigger>
                {!isAdminLogin && <TabsTrigger value="register">Register</TabsTrigger>}
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(handleLogin)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className={`w-full ${isAdminLogin ? 'bg-[#D4AF37] hover:bg-[#D4AF37]/90' : 'bg-black hover:bg-[#D4AF37]'} text-white`}
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isAdminLogin ? 'Sign In as Administrator' : 'Sign In'}
                    </Button>
                    
                    {isAdminLogin && (
                      <div className="mt-4 text-sm text-gray-500 text-center">
                        <p className="mb-2">Administrator access is restricted to authorized personnel only.</p>
                        <a 
                          href="/auth" 
                          className="text-[#D4AF37] hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = "/auth";
                          }}
                        >
                          Return to customer login
                        </a>
                      </div>
                    )}
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(handleRegister)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="First name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Last name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Choose a username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Your email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Your phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Create a password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-black hover:bg-[#D4AF37] text-white"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create Account
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hidden md:block bg-black relative overflow-hidden">
          {isAdminLogin ? (
            <>
              <img
                src={adminPortalImage}
                alt="DASH Admin Portal"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 text-center">
                  DASH Admin Portal
                </h2>
                <p className="text-center max-w-md mb-6">
                  Access the administrative dashboard to manage products, track orders,
                  and oversee all aspects of the DASH e-commerce platform.
                </p>
                <div className="space-y-4 text-center">
                  <p className="font-medium">Administration capabilities:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-center">
                      <span className="bg-[#D4AF37] rounded-full w-2 h-2 mr-2"></span>
                      Inventory and product management
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="bg-[#D4AF37] rounded-full w-2 h-2 mr-2"></span>
                      Order processing and fulfillment
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="bg-[#D4AF37] rounded-full w-2 h-2 mr-2"></span>
                      Customer account management
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="bg-[#D4AF37] rounded-full w-2 h-2 mr-2"></span>
                      Real-time business analytics
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Store image with 100% size */}
              <img
                src={storeImage}
                alt="DASH Store Interior"
                className="w-full h-full object-cover"
              />
              {/* Semi-transparent overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 text-center">
                  DASH Fashion Store
                </h2>
                <p className="text-center max-w-md mb-6">
                  Join DASH to discover exclusive luxury fashion, track your orders,
                  and enjoy personalized shopping experiences.
                </p>
                <div className="space-y-4 text-center">
                  <p className="font-medium">DASH membership benefits:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-center">
                      <span className="bg-[#D4AF37] rounded-full w-2 h-2 mr-2"></span>
                      Early access to new collections
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="bg-[#D4AF37] rounded-full w-2 h-2 mr-2"></span>
                      Exclusive member-only offers
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="bg-[#D4AF37] rounded-full w-2 h-2 mr-2"></span>
                      Free shipping on your first order
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="bg-[#D4AF37] rounded-full w-2 h-2 mr-2"></span>
                      Personalized style recommendations
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthPage;
