// @ts-nocheck

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import {
  ChartBarStacked,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FileText,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  ChevronRight,
  Loader2,
  ScanLine,
  Upload,
  PlusCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/lib/schema";

const AdminOrders = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [trackingNumbers, setTrackingNumbers] = useState<Record<number, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const ordersPerPage = 10;
  
  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // WebSocket for real-time updates
  useEffect(() => {
    // Only connect if user is admin
    if (!user?.isAdmin) return;
    
    // Create WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Handle order status updates
      if (data.type === 'order_status_update' || data.type === 'order_update' || data.type === 'delivery_status_update') {
        // Refresh orders data
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
        
        // Show toast notification
        if (data.type === 'delivery_status_update' && data.data.deliveryStatus) {
          toast({
            title: 'Order Delivery Status Updated',
            description: `Order #${data.data.orderId} delivery status changed to ${data.data.deliveryStatus}`,
          });
        }
      }
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    // Clean up on unmount
    return () => {
      socket.close();
    };
  }, [user, queryClient, toast]);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders?includeItems=true", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    enabled: !!user?.isAdmin,
  });
  
  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Failed to update order status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'Order Updated',
        description: 'Order status has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Update delivery status mutation
  const updateDeliveryStatusMutation = useMutation({
    mutationFn: async ({ orderId, deliveryStatus }: { orderId: number; deliveryStatus: string }) => {
      const res = await fetch(`/api/orders/${orderId}/delivery`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: deliveryStatus }),
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Failed to update delivery status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'Delivery Status Updated',
        description: 'Delivery status has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Update payment status mutation
  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ orderId, paymentStatus }: { orderId: number; paymentStatus: string }) => {
      const res = await fetch(`/api/orders/${orderId}/payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Failed to update payment status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'Payment Status Updated',
        description: 'Payment status has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Update tracking number mutation
  const updateTrackingNumberMutation = useMutation({
    mutationFn: async ({ orderId, trackingNumber }: { orderId: number; trackingNumber: string }) => {
      const res = await fetch(`/api/orders/${orderId}/tracking`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber }),
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Failed to update tracking number');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'Tracking Updated',
        description: 'Tracking number has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Handler functions
  const handleStatusUpdate = (orderId: number, status: string) => {
    updateOrderStatusMutation.mutate({ orderId, status });
  };
  
  const handleDeliveryStatusUpdate = (orderId: number, deliveryStatus: string) => {
    updateDeliveryStatusMutation.mutate({ orderId, deliveryStatus });
  };
  
  const handlePaymentStatusUpdate = (orderId: number, paymentStatus: string) => {
    updatePaymentStatusMutation.mutate({ orderId, paymentStatus });
  };
  
  const handleTrackingUpdate = (orderId: number, trackingNumber: string) => {
    updateTrackingNumberMutation.mutate({ orderId, trackingNumber });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Ensure user is admin, redirect if not
  if (!user?.isAdmin) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">You do not have permission to access this page.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  const navItems = [
    {
      label: "Dashboard",
      icon: <ChartBarStacked className="h-5 w-5" />,
      href: "/admin/dashboard",
    },
    {
      label: "Products",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/products",
    },
    {
      label: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/admin/orders",
    },
    {
      label: "Customers",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/customers",
    },
    {
      label: "Promotions",
      icon: <Tag className="h-5 w-5" />,
      href: "/admin/promotions",
    },
    {
      label: "Reports",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/reports",
    },
  ];

  const isActiveLink = (path: string) => {
    return location === path;
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

  const getDeliveryStatusClass = (status: string | null | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filtering logic
  const filteredOrders = orders
    ? orders
        .filter((order) => {
          // Filter by status if selected
          if (statusFilter && statusFilter !== "all" && order.status !== statusFilter) {
            return false;
          }

          // Search by order ID
          if (searchQuery) {
            return order.id.toString().includes(searchQuery);
          }

          return true;
        })
        .sort((a, b) => {
          // Sort by created date, newest first
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
    : [];

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <Helmet>
        <title>Manage Orders | Admin Dashboard</title>
      </Helmet>

      <div className="flex h-screen bg-gray-100">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-40 w-64 bg-white border-r border-gray-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6">
            <Link href="/">
              <h1 className="text-2xl font-bold font-serif">
                DASH<span className="text-[#D4AF37]">.</span>
              </h1>
            </Link>
            <div className="mt-2 text-gray-600 text-sm">Admin Panel</div>
          </div>

          <nav className="mt-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a
                      className={`flex items-center px-6 py-3 text-sm ${
                        isActiveLink(item.href)
                          ? "bg-gray-100 text-[#D4AF37] font-medium border-r-2 border-[#D4AF37]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-8 pb-4 px-6 mt-auto">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-medium">
                  {user?.firstName?.[0] || user?.username?.[0]}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {user?.firstName || user?.username}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <header className="bg-white shadow-sm py-4 px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-medium">Orders Management</h1>
              <div className="flex space-x-2">
                <OrderScanModal />
                <Link href="/admin/orders/new">
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Order
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <main className="p-6">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by order ID..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-64">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    className="flex-shrink-0"
                    onClick={() => {
                      setStatusFilter("all");
                      setSearchQuery("");
                    }}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Order ID</th>
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-left py-3 px-4">Customer</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Delivery</th>
                            <th className="text-left py-3 px-4">Payment</th>
                            <th className="text-right py-3 px-4">Amount</th>
                            <th className="text-right py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentOrders.map((order) => (
                            <>
                              <tr 
                                key={`order-${order.id}`} 
                                className={`border-b ${expandedOrders.includes(order.id) ? 'bg-gray-50' : ''}`}
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-5 w-5 mr-1"
                                      onClick={() => toggleOrderExpand(order.id)}
                                    >
                                      {expandedOrders.includes(order.id) ? 
                                        <ChevronUp className="h-4 w-4" /> : 
                                        <ChevronDown className="h-4 w-4" />
                                      }
                                    </Button>
                                    #{order.id}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">
                                  {order.customerName || `User #${order.userId}`}
                                  {order.customerEmail && <div className="text-xs text-gray-500">{order.customerEmail}</div>}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(
                                      order.status
                                    )}`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-block px-2 py-1 text-xs rounded-full ${getDeliveryStatusClass(
                                      order.deliveryStatus
                                    )}`}
                                  >
                                    {order.deliveryStatus || 'pending'}
                                  </span>
                                  {order.trackingNumber && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Tracking: {order.trackingNumber}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                                      order.paymentStatus === "paid"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {order.paymentStatus}
                                  </span>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {order.paymentMethod}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  ₦{order.totalAmount.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <Link href={`/admin/orders/${order.id}`}>
                                    <Button variant="ghost" size="sm">
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </td>
                              </tr>
                              
                              {/* Expanded details row */}
                              {expandedOrders.includes(order.id) && (
                                <tr key={`details-${order.id}`} className="bg-gray-50">
                                  <td colSpan={8} className="py-4 px-8">
                                    <div className="text-sm">
                                      <h4 className="font-medium mb-2">Order Items</h4>
                                      <div className="bg-white rounded-md shadow-sm">
                                        {order.items && order.items.length > 0 ? (
                                          <table className="w-full text-xs">
                                            <thead>
                                              <tr className="border-b">
                                                <th className="text-left py-2 px-3">Product</th>
                                                <th className="text-left py-2 px-3">Description</th>
                                                <th className="text-center py-2 px-3">Quantity</th>
                                                <th className="text-center py-2 px-3">Size/Color</th>
                                                <th className="text-right py-2 px-3">Price</th>
                                                <th className="text-right py-2 px-3">Total</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {order.items.map((item: any) => (
                                                <tr key={item.id} className="border-b">
                                                  <td className="py-2 px-3">
                                                    <div className="flex items-center">
                                                      {item.product && item.product.images && item.product.images[0] ? (
                                                        <img 
                                                          src={item.product.images[0]} 
                                                          alt={item.product.name}
                                                          className="w-8 h-8 object-cover rounded mr-2"
                                                        />
                                                      ) : (
                                                        <div className="w-8 h-8 bg-gray-200 rounded mr-2 flex items-center justify-center text-gray-400">
                                                          <Package className="w-4 h-4" />
                                                        </div>
                                                      )}
                                                      <span className="font-medium">
                                                        {item.product ? item.product.name : `Product #${item.productId}`}
                                                      </span>
                                                    </div>
                                                  </td>
                                                  <td className="py-2 px-3">
                                                    {item.product ? item.product.description.substring(0, 60) + (item.product.description.length > 60 ? '...' : '') : ''}
                                                  </td>
                                                  <td className="py-2 px-3 text-center">{item.quantity}</td>
                                                  <td className="py-2 px-3 text-center">
                                                    {item.size && <span className="mr-1">{item.size}</span>}
                                                    {item.color && (
                                                      <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                                                    )}
                                                  </td>
                                                  <td className="py-2 px-3 text-right">
                                                    ₦{item.price ? item.price.toLocaleString() : (item.product ? item.product.price.toLocaleString() : 0)}
                                                  </td>
                                                  <td className="py-2 px-3 text-right font-medium">
                                                    ₦{((item.price || (item.product ? item.product.price : 0)) * item.quantity).toLocaleString()}
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        ) : (
                                          <p className="py-3 px-4 text-gray-500">No items found for this order.</p>
                                        )}
                                      </div>
                                      
                                      {/* Order details - bottom section */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                          <h5 className="font-medium mb-1">Shipping Address</h5>
                                          <p className="text-gray-600 whitespace-pre-line">
                                            {order.shippingAddress || 'No shipping address provided'}
                                          </p>
                                          
                                          {order.notes && (
                                            <>
                                              <h5 className="font-medium mb-1 mt-3">Notes</h5>
                                              <p className="text-gray-600">{order.notes}</p>
                                            </>
                                          )}
                                        </div>
                                        
                                        <div>
                                          <h5 className="font-medium mb-1">Order Summary</h5>
                                          <div className="bg-white rounded-md shadow-sm p-3">
                                            <div className="flex justify-between py-1">
                                              <span>Subtotal</span>
                                              <span>₦{order.totalAmount.toLocaleString()}</span>
                                            </div>
                                            
                                            {order.discountAmount > 0 && (
                                              <div className="flex justify-between py-1 text-green-600">
                                                <span>Discount</span>
                                                <span>-₦{order.discountAmount.toLocaleString()}</span>
                                              </div>
                                            )}
                                            
                                            {order.shippingFee > 0 && (
                                              <div className="flex justify-between py-1">
                                                <span>Shipping</span>
                                                <span>₦{order.shippingFee.toLocaleString()}</span>
                                              </div>
                                            )}
                                            
                                            <div className="flex justify-between py-1 font-bold border-t mt-1 pt-1">
                                              <span>Total</span>
                                              <span>₦{order.totalAmount.toLocaleString()}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Action Buttons - Status Management */}
                                      <div className="mt-4 pt-4 border-t">
                                        <h5 className="font-medium mb-2">Order Management</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          {/* Order Status Actions */}
                                          <div className="bg-gray-100 p-3 rounded-md">
                                            <h6 className="text-xs font-medium mb-2">Update Order Status</h6>
                                            <div className="flex flex-wrap gap-2">
                                              <Button 
                                                size="sm" 
                                                variant={order.status === 'pending' ? 'default' : 'outline'}
                                                className={order.status === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                                                onClick={() => handleStatusUpdate(order.id, 'pending')}
                                              >
                                                Pending
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant={order.status === 'processing' ? 'default' : 'outline'}
                                                className={order.status === 'processing' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                                onClick={() => handleStatusUpdate(order.id, 'processing')}
                                              >
                                                Processing
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant={order.status === 'completed' ? 'default' : 'outline'}
                                                className={order.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                onClick={() => handleStatusUpdate(order.id, 'completed')}
                                              >
                                                Completed
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant={order.status === 'cancelled' ? 'default' : 'outline'}
                                                className={order.status === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : ''}
                                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                              >
                                                Cancelled
                                              </Button>
                                            </div>
                                          </div>
                                          
                                          {/* Delivery Status Actions */}
                                          <div className="bg-gray-100 p-3 rounded-md">
                                            <h6 className="text-xs font-medium mb-2">Update Delivery Status</h6>
                                            <div className="flex flex-wrap gap-2">
                                              <Button 
                                                size="sm" 
                                                variant={order.deliveryStatus === 'pending' ? 'default' : 'outline'}
                                                className={order.deliveryStatus === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                                                onClick={() => handleDeliveryStatusUpdate(order.id, 'pending')}
                                              >
                                                Pending
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant={order.deliveryStatus === 'processing' ? 'default' : 'outline'}
                                                className={order.deliveryStatus === 'processing' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                                onClick={() => handleDeliveryStatusUpdate(order.id, 'processing')}
                                              >
                                                Processing
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant={order.deliveryStatus === 'shipped' ? 'default' : 'outline'}
                                                className={order.deliveryStatus === 'shipped' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                                                onClick={() => handleDeliveryStatusUpdate(order.id, 'shipped')}
                                              >
                                                Shipped
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant={order.deliveryStatus === 'delivered' ? 'default' : 'outline'}
                                                className={order.deliveryStatus === 'delivered' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                onClick={() => handleDeliveryStatusUpdate(order.id, 'delivered')}
                                              >
                                                Delivered
                                              </Button>
                                            </div>
                                          </div>
                                          
                                          {/* Payment Status Actions */}
                                          <div className="bg-gray-100 p-3 rounded-md">
                                            <h6 className="text-xs font-medium mb-2">Update Payment Status</h6>
                                            <div className="flex flex-wrap gap-2">
                                              <Button 
                                                size="sm" 
                                                variant={order.paymentStatus === 'pending' ? 'default' : 'outline'}
                                                className={order.paymentStatus === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                                                onClick={() => handlePaymentStatusUpdate(order.id, 'pending')}
                                              >
                                                Pending
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}
                                                className={order.paymentStatus === 'paid' ? 'bg-green-600 hover:bg-green-700' : ''}
                                                onClick={() => handlePaymentStatusUpdate(order.id, 'paid')}
                                              >
                                                Paid
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant={order.paymentStatus === 'refunded' ? 'default' : 'outline'}
                                                className={order.paymentStatus === 'refunded' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                                                onClick={() => handlePaymentStatusUpdate(order.id, 'refunded')}
                                              >
                                                Refunded
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant={order.paymentStatus === 'failed' ? 'default' : 'outline'}
                                                className={order.paymentStatus === 'failed' ? 'bg-red-600 hover:bg-red-700' : ''}
                                                onClick={() => handlePaymentStatusUpdate(order.id, 'failed')}
                                              >
                                                Failed
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {/* Tracking Number Update */}
                                        <div className="mt-4">
                                          <h6 className="text-xs font-medium mb-2">Update Tracking Details</h6>
                                          <div className="flex flex-col md:flex-row gap-2">
                                            <Input
                                              placeholder="Enter tracking number"
                                              value={trackingNumbers[order.id] || ''}
                                              onChange={(e) => setTrackingNumbers({
                                                ...trackingNumbers,
                                                [order.id]: e.target.value
                                              })}
                                              className="flex-grow"
                                            />
                                            <Button 
                                              size="sm"
                                              onClick={() => handleTrackingUpdate(order.id, trackingNumbers[order.id] || '')}
                                              disabled={!trackingNumbers[order.id]}
                                            >
                                              Update Tracking
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-6">
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                            (number) => (
                              <Button
                                key={number}
                                variant={
                                  currentPage === number ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => paginate(number)}
                              >
                                {number}
                              </Button>
                            )
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              paginate(Math.min(totalPages, currentPage + 1))
                            }
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No orders found.
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
};

const OrderScanModal = () => {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form fields
  const [totalAmount, setTotalAmount] = useState<string>('0');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [paymentStatus, setPaymentStatus] = useState<string>('paid');
  const [orderNote, setOrderNote] = useState<string>('');

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview of the selected image
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset form
  const resetForm = () => {
    setTotalAmount('0');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setShippingAddress('');
    setPaymentMethod('cash');
    setPaymentStatus('paid');
    setOrderNote('');
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle close
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileInputRef.current?.files?.[0]) {
      toast({
        title: "No image selected",
        description: "Please upload an order scan image",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('orderImage', fileInputRef.current.files[0]);
      formData.append('totalAmount', totalAmount);
      formData.append('customerName', customerName);
      formData.append('customerEmail', customerEmail);
      formData.append('customerPhone', customerPhone);
      formData.append('shippingAddress', shippingAddress);
      formData.append('paymentMethod', paymentMethod);
      formData.append('paymentStatus', paymentStatus);
      formData.append('orderNote', orderNote);
      
      const response = await fetch('/api/orders/scan', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload order scan');
      }
      
      const result = await response.json();
      
      toast({
        title: "Order scan processed",
        description: `Order #${result.order.id} created successfully`,
      });
      
      // Refresh orders data
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      
      // Close modal and reset form
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process order scan",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ScanLine className="mr-2 h-4 w-4" />
          Scan Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Order Scan</DialogTitle>
          <DialogDescription>
            Upload an image of a physical order document to create a digital record.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="orderImage">Order Document Image *</Label>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer" 
              onClick={() => fileInputRef.current?.click()}>
              {uploadedImage ? (
                <div className="relative w-full">
                  <img src={uploadedImage} alt="Order scan preview" className="max-h-64 mx-auto rounded-md" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
              <input 
                type="file" 
                id="orderImage" 
                name="orderImage"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                required
              />
            </div>
          </div>
          
          {/* Basic Order Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount (₦) *</Label>
              <Input 
                id="totalAmount" 
                name="totalAmount"
                type="number"
                min="0"
                step="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="pos">POS</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status *</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Customer Information */}
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input 
              id="customerName" 
              name="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Walk-in Customer"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input 
                id="customerEmail" 
                name="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Customer Phone</Label>
              <Input 
                id="customerPhone" 
                name="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shippingAddress">Shipping Address</Label>
            <Textarea 
              id="shippingAddress" 
              name="shippingAddress"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="In-store pickup"
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="orderNote">Order Notes</Label>
            <Textarea 
              id="orderNote" 
              name="orderNote"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Additional information about this order"
              className="min-h-[80px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Save Order
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOrders;
