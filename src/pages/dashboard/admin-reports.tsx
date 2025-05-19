import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Menu,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FileText,
  DownloadCloud,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ArrowRight,
  PieChart,
  BarChart,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";

const AdminReports = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("sales");
  const [reportPeriod, setReportPeriod] = useState("monthly");

  // Fetch sales data
  const { data: salesData, isLoading: isSalesDataLoading } = useQuery({
    queryKey: ["/api/reports/sales"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/reports/sales?period=${reportPeriod}`, {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Failed to fetch sales data");
        return res.json();
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
        return {
          dailySales: [],
          monthlySales: [],
          totalSales: 0,
          percentageChange: 0,
          averageOrderValue: 0
        };
      }
    },
  });

  // Fetch product data
  const { data: productData, isLoading: isProductDataLoading } = useQuery({
    queryKey: ["/api/reports/products"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/reports/products`, {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Failed to fetch product data");
        return res.json();
      } catch (error) {
        console.error("Failed to fetch product data:", error);
        return {
          topProducts: [],
          categoryBreakdown: [],
          brandBreakdown: []
        };
      }
    },
  });

  // Fetch customer data
  const { data: customerData, isLoading: isCustomerDataLoading } = useQuery({
    queryKey: ["/api/reports/customers"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/reports/customers`, {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Failed to fetch customer data");
        return res.json();
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
        return {
          newCustomers: [],
          customerRetention: 0,
          averageCustomerValue: 0
        };
      }
    },
  });

  const COLORS = ["#D4AF37", "#1E40AF", "#DC2626", "#2563EB", "#7C3AED", "#059669", "#9CA3AF"];

  const handleDownloadReport = () => {
    toast({
      title: "Download Started",
      description: "Your report is being generated and will download shortly.",
    });
    
    // This would be replaced with actual download functionality
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your report has been downloaded successfully.",
      });
    }, 2000);
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
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

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Admin Access Required</h1>
          <p className="mb-4">You need administrator privileges to view this page.</p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Analytics & Reports | DASH Admin</title>
      </Helmet>
      <div className="bg-gray-50 min-h-screen">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div
            className={`bg-white fixed top-0 left-0 z-40 h-full w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:relative lg:w-64 shadow-lg`}
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <Link href="/admin/dashboard">
                  <h1 className="font-bold text-xl text-[#D4AF37]">DASH Admin</h1>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
              <div className="p-4 flex-1">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Button
                        variant={isActiveLink(item.href) ? "secondary" : "ghost"}
                        className={`w-full justify-start ${
                          isActiveLink(item.href)
                            ? "bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20"
                            : ""
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 p-4 lg:p-8">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">Analytics & Reports</h1>
                <p className="text-gray-500">
                  Detailed insights and performance data
                </p>
              </div>
              <Button 
                variant="outline" 
                className="flex items-center" 
                onClick={handleDownloadReport}
              >
                <DownloadCloud className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>

            {/* Report Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Sales</p>
                      {isSalesDataLoading ? (
                        <Skeleton className="h-8 w-24 mt-1" />
                      ) : (
                        <h3 className="text-2xl font-bold">
                          {formatCurrency(salesData?.totalSales || 0)}
                        </h3>
                      )}
                    </div>
                    <div className={`p-3 rounded-full ${(salesData?.percentageChange || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                      {(salesData?.percentageChange || 0) >= 0 ? (
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                  </div>
                  {!isSalesDataLoading && (
                    <div className={`text-sm mt-2 ${(salesData?.percentageChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(salesData?.percentageChange || 0) >= 0 ? '+' : ''}
                      {salesData?.percentageChange}% from last period
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Avg. Order Value</p>
                      {isSalesDataLoading ? (
                        <Skeleton className="h-8 w-24 mt-1" />
                      ) : (
                        <h3 className="text-2xl font-bold">
                          {formatCurrency(salesData?.averageOrderValue || 0)}
                        </h3>
                      )}
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">New Customers</p>
                      {isCustomerDataLoading ? (
                        <Skeleton className="h-8 w-24 mt-1" />
                      ) : (
                        <h3 className="text-2xl font-bold">
                          {customerData?.newCustomers?.length || 0}
                        </h3>
                      )}
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Customer Retention</p>
                      {isCustomerDataLoading ? (
                        <Skeleton className="h-8 w-24 mt-1" />
                      ) : (
                        <h3 className="text-2xl font-bold">
                          {customerData?.customerRetention || 0}%
                        </h3>
                      )}
                    </div>
                    <div className="p-3 rounded-full bg-[#D4AF37]/20">
                      <ArrowRight className="h-6 w-6 text-[#D4AF37]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Content */}
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="sales" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  Sales Reports
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Product Analytics
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Customer Insights
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="sales" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Sales Trends</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant={reportPeriod === "daily" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setReportPeriod("daily")}
                        >
                          Daily
                        </Button>
                        <Button 
                          variant={reportPeriod === "monthly" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setReportPeriod("monthly")}
                        >
                          Monthly
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Overview of your sales performance over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSalesDataLoading ? (
                      <div className="w-full h-80 flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={reportPeriod === "daily" ? salesData?.dailySales : salesData?.monthlySales}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Legend />
                            <Bar 
                              dataKey="sales" 
                              name="Sales" 
                              fill="#D4AF37" 
                              radius={[4, 4, 0, 0]} 
                            />
                            <Bar 
                              dataKey="orders" 
                              name="Orders" 
                              fill="#2563EB" 
                              radius={[4, 4, 0, 0]} 
                            />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="products" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Top Selling Products</CardTitle>
                      <CardDescription>
                        Products with the highest sales volume
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isProductDataLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between">
                              <Skeleton className="h-4 w-40" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {productData?.topProducts?.map((product: any, index: number) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                  {index + 1}
                                </div>
                                <div className="truncate max-w-[180px]">{product.name}</div>
                              </div>
                              <div className="font-medium">{formatCurrency(product.sales)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Category Distribution</CardTitle>
                      <CardDescription>
                        Sales breakdown by product categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isProductDataLoading ? (
                        <div className="w-full h-60 flex items-center justify-center">
                          <Skeleton className="h-full w-full rounded-full" />
                        </div>
                      ) : (
                        <div className="w-full h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={productData?.categoryBreakdown}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {productData?.categoryBreakdown?.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${value} sales`} />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="customers" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Customer Growth</CardTitle>
                    <CardDescription>
                      New customer acquisitions over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isCustomerDataLoading ? (
                      <div className="w-full h-80 flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart
                            data={customerData?.newCustomers}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              name="New Customers" 
                              stroke="#7C3AED" 
                              strokeWidth={2} 
                              activeDot={{ r: 8 }} 
                            />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminReports;