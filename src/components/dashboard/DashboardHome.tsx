import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useWishlist } from "@/hooks/use-wishlist";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Heart, User, ShoppingBag } from "lucide-react";
import PersonalizedInsightsWidget from "./PersonalizedInsightsWidget";

interface DashboardHomeProps {
  user: any;
}

const DashboardHome = ({ user }: DashboardHomeProps) => {
  const [, setLocation] = useLocation();
  const { wishlistItems, isLoading: isWishlistLoading } = useWishlist();

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
        <CardHeader className="pb-2">
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Welcome back, {user.firstName || user.username}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#D4AF37]/10 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Orders</h3>
                  {isOrdersLoading ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{orders?.length || 0}</p>
                  )}
                </div>
                <ShoppingBag className="h-10 w-10 text-[#D4AF37]" />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Wishlist</h3>
                  {isWishlistLoading ? (
                    <Skeleton className="h-7 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{wishlistItems?.length || 0}</p>
                  )}
                </div>
                <Heart className="h-10 w-10 text-purple-500" />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Status</h3>
                  <p className="text-2xl font-bold">Active</p>
                </div>
                <User className="h-10 w-10 text-blue-500" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Your most recent purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isOrdersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders
                .slice(0, 3)
                .map((order: any) => (
                  <div
                    key={order.id}
                    className="border-b pb-3"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-medium">
                          Order #{order.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                        {order.status || "pending"}
                      </div>
                    </div>
                    
                    {/* Preview of order items */}
                    {order.items && order.items.length > 0 && (
                      <div className="flex items-center mt-2 overflow-x-auto pb-1">
                        <div className="flex space-x-2">
                          {order.items.slice(0, 3).map((item: any) => (
                            <div key={item.id} className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                              {item.product?.images && item.product.images.length > 0 ? (
                                <img 
                                  src={item.product.images[0]} 
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <Package className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500 border border-gray-200">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="ml-auto text-xs text-gray-500">
                          ₦{order.totalAmount?.toLocaleString() || '0'}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              <div className="pt-2 text-center">
                <Button 
                  variant="link" 
                  onClick={() => setLocation("/user-orders")}
                >
                  View all orders
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-500">
                You haven't placed any orders yet.
              </p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setLocation("/products")}
              >
                Start shopping
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personalized Insights Widget */}
      {user && user.id && (
        <PersonalizedInsightsWidget userId={user.id} />
      )}
    </div>
  );
};

export default DashboardHome;