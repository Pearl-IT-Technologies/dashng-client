import { useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { 
  ShoppingBag, 
  Users, 
  Package, 
  Tag, 
  BarChart4, 
  Clock, 
  Boxes, 
  CheckCircle,
  ChevronRight,
  Calendar,
  Settings,
  Bell,
  Loader2
} from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CreateInStoreOrderForm from "@/components/dashboard/CreateInStoreOrderForm";
import { formatPrice } from "@/lib/utils";

export default function StaffDashboard() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  
  // Determine if the user is a storekeeper
  const isStorekeeper = user?.adminRole === 'storekeeper';
  
  // IMPORTANT: Check if user can see/access the Create In-Store Order functionality 
  // Storekeepers are explicitly excluded from creating orders
  const canUseCreateOrder = !isStorekeeper && user && user.isAdmin && (
    user.isMasterAdmin || 
    user.isSuperAdmin || 
    user.adminRole === 'sales' || 
    user.adminRole === 'manager' || 
    user.adminRole === 'owner'
  );
  
  // Debug user permissions
  console.log("Navigating to dashboard. User role:", user?.adminRole);
  console.log("User can create orders:", canUseCreateOrder);

  // Fetch staff performance data
  const { data: performanceData, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ["/api/admin/performance"],
    queryFn: async () => {
      const res = await fetch("/api/admin/performance");
      if (!res.ok) throw new Error("Failed to load performance data");
      return res.json();
    },
  });

  // Fetch recent in-store orders
  const { data: recentOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["/api/orders", { limit: 5, isInStorePurchase: true, processingAdminId: user?.id }],
    queryFn: async () => {
      const res = await fetch(`/api/orders?limit=5&isInStorePurchase=true&processingAdminId=${user?.id}`);
      if (!res.ok) throw new Error("Failed to load orders");
      return res.json();
    },
  });

  // Handle create order success
  const handleCreateOrderSuccess = () => {
    setShowCreateOrder(false);
  };

  // Calculate today's sales
  const todaySales = performanceData?.todaySales || { count: 0, total: 0 };
  const weekSales = performanceData?.weekSales || { count: 0, total: 0 };
  const monthSales = performanceData?.monthSales || { count: 0, total: 0 };

  // Add dialog for Create In-Store Order only for non-storekeeper roles
  const orderDialog = !isStorekeeper ? (
    <Dialog open={showCreateOrder} onOpenChange={setShowCreateOrder}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create In-Store Order</DialogTitle>
        </DialogHeader>
        <CreateInStoreOrderForm onSuccess={handleCreateOrderSuccess} />
      </DialogContent>
    </Dialog>
  ) : null;

  return (
    <DashboardLayout>
      <Helmet>
        <title>Staff Dashboard | DASH</title>
      </Helmet>

      {orderDialog}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName || user?.username}. 
            {isStorekeeper 
              ? "Manage inventory and view store performance." 
              : "Manage in-store sales and view your performance."}
          </p>
        </div>
      
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(todaySales.total)}</div>
            <p className="text-xs text-muted-foreground">
              {todaySales.count} {todaySales.count === 1 ? "order" : "orders"} today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Sales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(weekSales.total)}</div>
            <p className="text-xs text-muted-foreground">
              {weekSales.count} {weekSales.count === 1 ? "order" : "orders"} this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
            <BarChart4 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(monthSales.total)}</div>
            <p className="text-xs text-muted-foreground">
              {monthSales.count} {monthSales.count === 1 ? "order" : "orders"} this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(performanceData?.averageOrderValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {performanceData?.totalSales && performanceData.totalSales > 0
                ? `Based on ${performanceData.totalSales} sales`
                : "No sales recorded yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent In-Store Orders</CardTitle>
            <CardDescription>Your most recent in-store sales</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-6">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="font-medium">Order #{order.id}</p>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {order.customerName} • {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={order.paymentStatus === "paid" ? "default" : 
                                     order.paymentStatus === "partial" ? "outline" : "secondary"}>
                          {order.paymentStatus === "paid" ? "Paid" : 
                           order.paymentStatus === "partial" ? "Partially Paid" : "Pending"}
                        </Badge>
                        <Badge variant="outline">{order.paymentMethod}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatPrice(order.totalAmount)}</div>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-xs px-0"
                        onClick={() => setLocation(`/admin/orders/${order.id}`)}
                      >
                        View Details
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No in-store orders found</p>
                {/* "Create your first in-store order" link removed */}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setLocation('/admin/orders')}
            >
              View All Orders
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for store staff</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* "Create In-Store Order" button removed completely */}
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setLocation('/admin/inventory')}
            >
              <Boxes className="mr-2 h-4 w-4" />
              Check Inventory
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setLocation('/admin/products')}
            >
              <Package className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setLocation('/admin/customers')}
            >
              <Users className="mr-2 h-4 w-4" />
              Customer Directory
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setLocation('/admin/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}