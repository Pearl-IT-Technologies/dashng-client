import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const UserOrders = () => {
  const [, setLocation] = useLocation();

  // Get user's orders with items
  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders?includeItems=true", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClass = (status: string | null | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            View and track all your purchased orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isOrdersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center border-b pb-4 mb-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="border-b pb-4 mb-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="col-span-2">
                      <h3 className="font-medium">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="text-sm mt-1">
                        Items: {order.items?.length || 0} | 
                        Total: ₦{order.totalAmount?.toLocaleString() || '0'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Payment: {order.paymentMethod}
                        <span className={`ml-2 inline-block w-2 h-2 rounded-full ${
                          order.paymentStatus === "paid" ? "bg-green-500" :
                          order.paymentStatus === "refunded" ? "bg-blue-500" :
                          order.paymentStatus === "failed" ? "bg-red-500" :
                          "bg-yellow-500"
                        }`}></span>
                        <span className="ml-1 text-xs">{order.paymentStatus}</span>
                      </p>
                    </div>
                    <div className="md:text-center">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                        {order.status || "pending"}
                      </div>
                      {order.deliveryStatus && (
                        <p className="text-sm text-gray-500 mt-2">
                          Delivery: {order.deliveryStatus}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLocation(`/order-tracking?orderId=${order.id}`)}
                      >
                        Track Order
                      </Button>
                      {order.trackingNumber && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLocation(`/order-tracking?tab=shipment&tracking=${order.trackingNumber}`)}
                        >
                          Track Shipment
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex items-center border-b border-gray-100 pb-3">
                            <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              {item.product?.images && item.product.images.length > 0 ? (
                                <img 
                                  src={item.product.images[0]} 
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4 flex-grow">
                              <div className="font-medium text-sm">{item.product?.name || "Product"}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Qty: {item.quantity} × ₦{item.price?.toLocaleString() || '0'}
                              </div>
                              {(item.selectedColor || item.selectedSize) && (
                                <div className="flex text-xs text-gray-500 mt-1">
                                  {item.selectedColor && (
                                    <span className="mr-2">Color: {item.selectedColor}</span>
                                  )}
                                  {item.selectedSize && (
                                    <span>Size: {item.selectedSize}</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-medium">
                              ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-16 w-16 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-500">
                You haven't placed any orders yet.
              </p>
              <Button 
                className="mt-4 bg-[#D4AF37] hover:bg-[#C09C1F] text-white"
                onClick={() => setLocation("/products")}
              >
                Start shopping
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOrders;