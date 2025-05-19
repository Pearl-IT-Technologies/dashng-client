import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import ShipmentTracker from "@/components/shipping/ShipmentTracker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Package, Truck, ShoppingBag, ArrowLeft } from "lucide-react";

const OrderTrackingSchema = z.object({
  trackingNumber: z.string().min(5, {
    message: "Tracking number must be at least 5 characters long",
  }),
});

type OrderTrackingValues = z.infer<typeof OrderTrackingSchema>;

export default function OrderTrackingPage() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [isTrackingSubmitted, setIsTrackingSubmitted] = useState(false);

  // Parse tracking number from URL if present
  const params = new URLSearchParams(window.location.search);
  const urlTrackingNumber = params.get("tracking");
  
  // Set tracking number from URL if available and not already tracking
  if (urlTrackingNumber && !isTrackingSubmitted && !trackingNumber) {
    setTrackingNumber(urlTrackingNumber);
    setIsTrackingSubmitted(true);
  }

  const form = useForm<OrderTrackingValues>({
    resolver: zodResolver(OrderTrackingSchema),
    defaultValues: {
      trackingNumber: urlTrackingNumber || "",
    },
  });

  const onSubmit = (values: OrderTrackingValues) => {
    setTrackingNumber(values.trackingNumber);
    setIsTrackingSubmitted(true);
    
    // Update URL with tracking number for shareable link
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("tracking", values.trackingNumber);
    window.history.pushState({}, "", newUrl.toString());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={() => setLocation("/")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your tracking number to see the current status of your shipment
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Enter Tracking Information</CardTitle>
            <CardDescription>
              Please enter the tracking number that was provided in your shipping confirmation email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="trackingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tracking Number</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          <Input placeholder="Enter tracking number" {...field} />
                          <Button type="submit">Track</Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        The tracking number is typically a 10-15 digit code
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {isTrackingSubmitted && (
          <div className="space-y-6">
            <ShipmentTracker 
              trackingNumber={trackingNumber} 
              courierName="DASH Logistics"
              courierTrackingUrl={`https://dashnglogistics.com/track?number=${trackingNumber}`}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-[#D4AF37]" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about your shipment or need assistance, please contact our customer support team.
                </p>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <a href="mailto:support@dashng.com" className="text-primary hover:underline">
                      support@dashng.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Phone:</span>
                    <a href="tel:+2341234567890" className="text-primary hover:underline">
                      +234 123 456 7890
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}