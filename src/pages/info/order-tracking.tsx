import { useState } from "react";
import PageLayout from "@/components/ui/PageLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Search, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
// Define a more complete Order type for the UI
interface ExtendedOrder {
  id: number;
  trackingNumber: string | null;
  userId: number | null;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  createdAt?: Date;
  shippedAt?: Date;
  outForDeliveryAt?: Date;
  deliveredAt?: Date;
  notes?: string;
}

const OrderTrackingPage = () => {
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<ExtendedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a tracking number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setOrderData(null);
    
    try {
      const response = await apiRequest("GET", `/api/orders/track/${trackingNumber}`);
      const data = await response.json();
      
      if (response.ok) {
        setOrderData(data);
      } else {
        setError(data.message || "Unable to find order with that tracking number");
        toast({
          title: "Tracking Failed",
          description: data.message || "Unable to find order with that tracking number",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("An error occurred while tracking your order. Please try again.");
      toast({
        title: "Tracking Error",
        description: "An error occurred while tracking your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get delivery status step
  const getDeliveryStep = (status: string): number => {
    switch (status) {
      case "processing": return 1;
      case "shipped": return 2;
      case "out_for_delivery": return 3;
      case "delivered": return 4;
      default: return 1;
    }
  };

  // Function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <PageLayout title="Order Tracking">
      <div className="max-w-3xl mx-auto">
        <p className="mb-8">
          Enter your tracking number below to check the status of your order. 
          The tracking number can be found in your order confirmation email.
        </p>
        
        <form onSubmit={handleTrackOrder} className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter tracking number (e.g., DASH-20250428-ABCDEF)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-black hover:bg-[#D4AF37] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Track Order
                </>
              )}
            </Button>
          </div>
        </form>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 mb-8">
            <h3 className="text-lg font-medium text-red-800 mb-2">Tracking Error</h3>
            <p className="text-red-700">{error}</p>
            <p className="mt-4 text-gray-700">
              If you continue to experience issues, please contact our customer service for assistance.
            </p>
            <Button 
              className="mt-4 bg-black hover:bg-[#D4AF37] text-white"
              asChild
            >
              <a href="/info/contact">Contact Customer Service</a>
            </Button>
          </div>
        )}
        
        {orderData && (
          <div className="bg-white border rounded-md p-6 shadow-sm">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-serif font-medium mb-2">Order #{orderData.id}</h2>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
                <p>Tracking Number: <span className="font-medium">{orderData.trackingNumber}</span></p>
                <p>Order Date: <span className="font-medium">{formatDate(orderData.createdAt?.toString() || "")}</span></p>
                <p>Status: <span className="font-medium capitalize">{orderData.status?.replace("_", " ")}</span></p>
              </div>
            </div>
            
            {/* Tracking Timeline */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-6">Delivery Status</h3>
              
              <div className="relative">
                {/* Progress Bar */}
                <div className="absolute left-6 top-0 ml-px border-l-2 border-gray-200 h-full"></div>
                
                {/* Progress Checkpoints */}
                <ol className="relative space-y-8">
                  <li className="flex items-start">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getDeliveryStep(orderData.status || "") >= 1 ? "bg-[#D4AF37] text-white" : "bg-gray-200 text-gray-500"}`}>
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium">Order Processing</h4>
                      <p className="text-gray-600">Your order has been received and is being processed</p>
                      {getDeliveryStep(orderData.status || "") >= 1 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(orderData.createdAt?.toString() || "")}
                        </p>
                      )}
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getDeliveryStep(orderData.status || "") >= 2 ? "bg-[#D4AF37] text-white" : "bg-gray-200 text-gray-500"}`}>
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium">Shipped</h4>
                      <p className="text-gray-600">Your order has been shipped</p>
                      {getDeliveryStep(orderData.status || "") >= 2 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {orderData.shippedAt ? formatDate(orderData.shippedAt.toString()) : "Pending"}
                        </p>
                      )}
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getDeliveryStep(orderData.status || "") >= 3 ? "bg-[#D4AF37] text-white" : "bg-gray-200 text-gray-500"}`}>
                      <Truck className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium">Out for Delivery</h4>
                      <p className="text-gray-600">Your order is out for delivery</p>
                      {getDeliveryStep(orderData.status || "") >= 3 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {orderData.outForDeliveryAt ? formatDate(orderData.outForDeliveryAt.toString()) : "Pending"}
                        </p>
                      )}
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getDeliveryStep(orderData.status || "") >= 4 ? "bg-[#D4AF37] text-white" : "bg-gray-200 text-gray-500"}`}>
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium">Delivered</h4>
                      <p className="text-gray-600">Your order has been delivered</p>
                      {getDeliveryStep(orderData.status || "") >= 4 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {orderData.deliveredAt ? formatDate(orderData.deliveredAt.toString()) : "Pending"}
                        </p>
                      )}
                    </div>
                  </li>
                </ol>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Shipping Address</h3>
              <p className="text-gray-700 whitespace-pre-line">{orderData.shippingAddress}</p>
            </div>
            
            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-medium mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Total</span>
                  <span className="font-medium">₦{orderData.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">{orderData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="font-medium capitalize">{orderData.paymentStatus}</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button 
                className="bg-black hover:bg-[#D4AF37] text-white"
                asChild
              >
                <a href="/info/contact">Contact Support</a>
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-12 bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-serif font-medium mb-4">Having Trouble With Your Order?</h3>
          <p className="mb-4">
            If you're experiencing any issues with tracking your order or have questions about your delivery, our customer service team is here to help.
          </p>
          <Button className="bg-black hover:bg-[#D4AF37] text-white" asChild>
            <a href="/info/contact">Contact Customer Service</a>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default OrderTrackingPage;