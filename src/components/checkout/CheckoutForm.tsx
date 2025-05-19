import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useGuestCart } from "@/hooks/use-guest-cart";
import ReturnPolicy from "@/components/ReturnPolicy";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const shippingSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  paymentMethod: z.enum(["paystack", "flutterwave"], {
    required_error: "Please select a payment method",
  }),
  notes: z.string().optional(),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

interface CheckoutFormProps {
  totalAmount: number;
  couponDiscount?: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  totalAmount,
  couponDiscount = 0,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { clearCart: clearGuestCart } = useGuestCart();
  const { cartItems } = useCart();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "1 Brooks Stone Close, GRA, Port Harcourt, Rivers, Nigeria",
      city: user?.city || "Port Harcourt",
      state: user?.state || "Rivers",
      country: user?.country || "Nigeria",
      paymentMethod: "paystack",
      notes: "",
    },
  });

  // Create order for authenticated users
  const createAuthenticatedOrderMutation = useMutation({
    mutationFn: async (data: ShippingFormValues) => {
      // Create formatted shipping address string
      const formattedShippingAddress = `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.phone}, ${data.email}`;
      
      const orderData = {
        userId: user!.id,
        totalAmount: totalAmount - couponDiscount,
        paymentMethod: data.paymentMethod,
        paymentStatus: "paid", // In a real app, this would be determined by the payment gateway
        shippingAddress: formattedShippingAddress, // Send as a string instead of an object
        notes: data.notes,
      };

      console.log("Creating authenticated order with data:", orderData);
      
      try {
        const res = await apiRequest("POST", "/api/orders", orderData);
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Server error response:", errorData);
          throw new Error(errorData.message || "Failed to create order");
        }
        return await res.json();
      } catch (error) {
        console.error("Error creating authenticated order:", error);
        throw error;
      }
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      
      toast({
        title: "Order placed successfully!",
        description: "You will receive an email confirmation shortly.",
      });
      
      // Redirect to order success page with the order ID
      navigate(`/order-success?orderId=${order.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
      setIsPaymentProcessing(false);
    },
  });
  
  // Create order for guest users
  const createGuestOrderMutation = useMutation({
    mutationFn: async (data: ShippingFormValues) => {
      // Create formatted shipping address string (same format as authenticated orders)
      const formattedShippingAddress = `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.phone}, ${data.email}`;
      
      const orderData = {
        // For guest users, we don't have a userId
        // We'll pass the cart items directly with the order
        isGuestOrder: true,
        cartItems: cartItems,
        totalAmount: totalAmount - couponDiscount,
        paymentMethod: data.paymentMethod,
        paymentStatus: "paid", // In a real app, this would be determined by the payment gateway
        shippingAddress: formattedShippingAddress, // Send as a string instead of an object
        // Keep the individual fields for creating the guest user
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        notes: data.notes,
      };

      console.log("Creating guest order with data:", orderData);
      
      try {
        const res = await apiRequest("POST", "/api/guest-orders", orderData);
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Server error response for guest order:", errorData);
          throw new Error(errorData.message || "Failed to create guest order");
        }
        return await res.json();
      } catch (error) {
        console.error("Error creating guest order:", error);
        throw error;
      }
    },
    onSuccess: (order) => {
      // Clear the guest cart
      clearGuestCart();
      
      toast({
        title: "Order placed successfully!",
        description: "You will receive an email confirmation shortly.",
      });
      
      // Redirect to order success page with the order ID
      navigate(`/order-success?orderId=${order.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
      setIsPaymentProcessing(false);
    },
  });

  const onSubmit = async (data: ShippingFormValues) => {
    setIsPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Process the order after payment is successful
      // Use the appropriate mutation based on whether the user is authenticated or not
      if (user) {
        createAuthenticatedOrderMutation.mutate(data);
      } else {
        createGuestOrderMutation.mutate(data);
      }
    }, 2000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Shipping Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+234 123 456 7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="1 Brooks Stone Close, GRA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Port Harcourt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Rivers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Nigeria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Payment Method</h3>
          
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paystack">Paystack</SelectItem>
                      <SelectItem value="flutterwave">Flutterwave</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Special instructions for delivery or any other notes" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="mt-6 p-4 border border-gray-100 rounded-md bg-gray-50">
            <h4 className="font-medium mb-2">Our Return Policy</h4>
            <ReturnPolicy simplified />
            <p className="text-sm text-gray-600 mt-2">
              By placing your order, you acknowledge that you have read and agree to our
              <ReturnPolicy productName="all purchased items" /> and terms of service.
            </p>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
            disabled={isPaymentProcessing || createAuthenticatedOrderMutation.isPending || createGuestOrderMutation.isPending}
          >
            {(isPaymentProcessing || createAuthenticatedOrderMutation.isPending || createGuestOrderMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isPaymentProcessing 
              ? "Processing Payment..." 
              : `Pay ₦${(totalAmount - couponDiscount).toLocaleString()}`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CheckoutForm;
