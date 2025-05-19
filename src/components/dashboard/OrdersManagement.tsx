import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CalendarDays, ClipboardList, ExternalLink, ShoppingBag, Tag, User as UserIcon } from "lucide-react";
import OrdersFilter, { OrdersFilterProps } from "@/components/dashboard/OrdersFilter";
import CreateInStoreOrderForm from "@/components/dashboard/CreateInStoreOrderForm";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Order, User } from "@/lib/schema";

// Filter options type
interface OrderFilterOptions {
  orderType: 'all' | 'online' | 'in-store';
  fromDate?: Date;
  toDate?: Date;
  status?: string;
}

export default function OrdersManagement() {
  const [filterOptions, setFilterOptions] = useState<OrderFilterOptions>({
    orderType: 'all',
  });
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const { user } = useAuth();

  // Fetch orders with filters
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: [
      '/api/orders', 
      { 
        orderType: filterOptions.orderType,
        fromDate: filterOptions.fromDate?.toISOString(),
        toDate: filterOptions.toDate?.toISOString(),
        status: filterOptions.status,
        includeItems: 'true'
      }
    ],
  });

  // Fetch admin users for the filter dropdown
  const { data: adminUsers } = useQuery<User[]>({
    queryKey: ['/api/admin/personnel'],
    staleTime: 300000, // 5 minutes
  });

  // Format price
  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  // Get order status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get payment status badge color
  const getPaymentBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">{status}</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">{status}</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get order type badge
  const getOrderTypeBadge = (isInStore: boolean) => {
    return isInStore
      ? <Badge variant="outline" className="bg-purple-100 text-purple-800">In-Store</Badge>
      : <Badge variant="outline" className="bg-blue-100 text-blue-800">Online</Badge>;
  };

  // Handle filter changes
  const handleFilterChange = (filters: OrderFilterOptions) => {
    setFilterOptions(filters);
  };

  // Handle create order success
  const handleCreateOrderSuccess = () => {
    setShowCreateOrder(false);
  };

  // Filter admins to get only sales personnel
  const salesPersonnel = adminUsers?.filter(
    admin => admin.isAdmin && ['sales', 'storekeeper'].includes(admin.adminRole || '')
  ).map(admin => ({
    id: admin.id,
    name: admin.username
  })) || [];

  // First, check if the user is a storekeeper - Storekeepers CANNOT create orders
  const isStorekeeper = user?.adminRole === 'storekeeper' || user?.username === 'storekeeper';
  
  // Storekeepers can NEVER see or access order creation - hardcoded false for storekeepers
  const hasInStoreOrderPermission = isStorekeeper ? false : (
    user && user.isAdmin && (
      user.isMasterAdmin || 
      user.isSuperAdmin || 
      user.adminRole === 'sales' || 
      user.adminRole === 'manager' || 
      user.adminRole === 'owner'
    )
  );
  
  // Storekeepers can NEVER see the Create In-Store Order button - hardcoded false
  const canShowCreateOrderButton = isStorekeeper ? false : (
    user && user.isAdmin && (
      user.isMasterAdmin || 
      user.isSuperAdmin || 
      user.adminRole === 'sales' || 
      user.adminRole === 'manager' || 
      user.adminRole === 'owner'
    )
  );
  
  // Debug permissions
  console.log("Orders Management - User role:", user?.adminRole);
  console.log("Orders Management - Can show create order button:", canShowCreateOrderButton);
  
  // Debug user permissions
  console.log("Current user:", user ? {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
    adminRole: user.adminRole,
    isMasterAdmin: user.isMasterAdmin,
    isSuperAdmin: user.isSuperAdmin,
    hasPermission: hasInStoreOrderPermission
  } : "Not logged in");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Orders Management</h2>
        {/* IMPORTANT: Hard-coded check to completely remove in-store order buttons for storekeepers */}
        {user?.username !== 'storekeeper' && user?.adminRole !== 'storekeeper' ? (
          <Dialog open={showCreateOrder} onOpenChange={setShowCreateOrder}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Create In-Store Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create In-Store Order</DialogTitle>
              </DialogHeader>
              {hasInStoreOrderPermission ? (
                <CreateInStoreOrderForm onSuccess={handleCreateOrderSuccess} />
              ) : (
                <div className="p-6 text-center space-y-4">
                  <div className="rounded-full bg-red-100 p-3 w-12 h-12 mx-auto flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium">Authentication Required</h3>
                  <p className="text-muted-foreground">
                    You need to be logged in as a staff member with sales permissions to create in-store orders.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please log in as an admin or sales personnel to continue.
                  </p>
                  <Button asChild className="mt-4">
                    <a href="/auth">Go to Login</a>
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filters */}
        <div className="md:col-span-1">
          <OrdersFilter 
            onFilterChange={handleFilterChange} 
            //@ts-ignore
            admins={salesPersonnel}
          />
        </div>

        {/* Order List */}
        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Orders
              </CardTitle>
              <CardDescription>
                {filterOptions.orderType === 'all' 
                  ? 'All orders' 
                  : filterOptions.orderType === 'online' 
                    ? 'Online orders' 
                    : 'In-store orders'}
                {filterOptions.fromDate && ` from ${format(filterOptions.fromDate, 'PPP')}`}
                {filterOptions.toDate && ` to ${format(filterOptions.toDate, 'PPP')}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="min-h-[300px] flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : orders && orders.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <div className="bg-muted/30 p-4">
                          <div className="flex flex-wrap gap-2 justify-between items-center">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">Order #{order.id}</h3>
                              
                              {//@ts-ignore
                              getOrderTypeBadge(order.isInStorePurchase || false)
                              }
                              {getStatusBadge(order.status)}
                              {getPaymentBadge(order.paymentStatus)}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-muted-foreground text-sm flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                {//@ts-ignore
                                format(new Date(order.createdAt), 'PPP')}
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <a href={`/dashboard/orders/${order.id}`}>
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  View
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 grid gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                <UserIcon className="h-3 w-3" />
                                Customer
                              </h4>
                              <p className="text-sm">
                                {//@ts-ignore
                                order.customerName || 'Guest Customer'}
                                {//@ts-ignore
                                order.customerEmail && <span className="block text-xs text-muted-foreground">{order.customerEmail}</span>}
                                {//@ts-ignore
                                order.customerPhone && <span className="block text-xs text-muted-foreground">{order.customerPhone}</span>}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                Total
                              </h4>
                              <p className="text-sm font-medium">{formatPrice(order.totalAmount)}</p>
                              <p className="text-xs text-muted-foreground">{order.paymentMethod}</p>
                            </div>
                            {//@ts-ignore
                            order.processingAdminName && (
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Processed By</h4>
                                <p className="text-sm">{//@ts-ignore
                                order.processingAdminName}</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Order Items */}
                          {(order as any).items && (order as any).items.length > 0 && (
                            <div className="border-t pt-3 mt-2">
                              <h4 className="text-sm font-medium mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {(order as any).items.map((item: any) => (
                                  <div key={item.id} className="flex justify-between text-sm">
                                    <div className="flex-1">
                                      <span>{item.product.name}</span>
                                      <span className="text-muted-foreground"> × {item.quantity}</span>
                                    </div>
                                    <div>{formatPrice(item.price * item.quantity)}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-4">
                  <ClipboardList className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg">No orders found</h3>
                  <p className="text-muted-foreground">
                    {filterOptions.orderType === 'all' 
                      ? 'There are no orders in the system matching your filters' 
                      : filterOptions.orderType === 'online' 
                        ? 'No online orders found for the selected criteria'
                        : 'No in-store orders found for the selected criteria'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}