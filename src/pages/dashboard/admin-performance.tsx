import { Helmet } from "react-helmet";
import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format, subMonths, subWeeks, subDays, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Loader2, 
  Calendar as CalendarIcon, 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Award, 
  BarChart3,
  LineChart 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A77BF3'];

export default function AdminPerformancePage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | null,
    to: Date | null
  }>({
    from: subMonths(new Date(), 1),
    to: new Date()
  });
  
  // Calculate date range based on selected period
  const updateDateRangeFromPeriod = (period: string) => {
    const now = new Date();
    let from = null;
    
    switch(period) {
      case "week":
        from = subWeeks(now, 1);
        break;
      case "month":
        from = subMonths(now, 1);
        break;
      case "quarter":
        from = subMonths(now, 3);
        break;
      case "year":
        from = subMonths(now, 12);
        break;
      case "custom":
        // Don't change the custom range
        return;
      default:
        from = subMonths(now, 1);
    }
    
    setDateRange({ from, to: now });
  };
  
  // Fetch all admins for filter dropdown
  const { data: admins, isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['/api/super-admin/admins'],
    enabled: !!user?.isSuperAdmin,
  });
  
  // Fetch top performing admins
  const { data: topAdmins, isLoading: isLoadingTopAdmins } = useQuery({
    queryKey: [
      '/api/super-admin/performance', 
      { 
        top: true, 
        limit: 5,
        startDate: dateRange.from?.toISOString(),
        endDate: dateRange.to?.toISOString(),
      }
    ],
    enabled: !!user?.isSuperAdmin,
  });
  
  // Fetch performance data for selected admin
  const { data: adminPerformance, isLoading: isLoadingPerformance } = useQuery({
    queryKey: [
      '/api/super-admin/performance', 
      { 
        adminId: selectedAdmin,
        startDate: dateRange.from?.toISOString(),
        endDate: dateRange.to?.toISOString(),
      }
    ],
    enabled: !!user?.isSuperAdmin && !!selectedAdmin,
  });
  
  // Process performance data for charts
  const getPerformanceChartData = () => {
    if (!adminPerformance) return [];
    
    return adminPerformance.map((day: any) => ({
      date: format(new Date(day.date), "MMM dd"),
      sales: day.salesCount || 0,
      revenue: day.salesTotal || 0,
      orders: day.ordersProcessed || 0,
      customers: day.customersServed || 0,
      avgOrder: day.averageOrderValue || 0
    }));
  };
  
  const performanceData = getPerformanceChartData();
  
  // Calculate totals for the selected admin
  const getTotals = () => {
    if (!adminPerformance || adminPerformance.length === 0) return {
      totalSales: 0,
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      avgOrderValue: 0
    };
    
    const totals = adminPerformance.reduce((acc: any, day: any) => {
      acc.totalSales += day.salesCount || 0;
      acc.totalRevenue += day.salesTotal || 0;
      acc.totalOrders += day.ordersProcessed || 0;
      acc.totalCustomers += day.customersServed || 0;
      return acc;
    }, { 
      totalSales: 0, 
      totalRevenue: 0, 
      totalOrders: 0, 
      totalCustomers: 0 
    });
    
    totals.avgOrderValue = totals.totalOrders > 0 ? 
      totals.totalRevenue / totals.totalOrders : 0;
      
    return totals;
  };
  
  const totals = getTotals();
  
  // Format number for display
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num * 100) / 100);
  };
  
  if (!user?.isSuperAdmin) {
    return (
      <DashboardLayout>
        <div className="px-4 py-10 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-center mb-4">Access Denied</h2>
          <p className="text-center text-muted-foreground mb-6">
            You don't have permission to access the Admin Performance page.
          </p>
          <Button onClick={() => setLocation("/admin/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Admin Performance Analytics | DASH</title>
      </Helmet>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2" 
              onClick={() => setLocation("/admin/super")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Admin Performance</h1>
              <p className="text-muted-foreground">Analyze admin sales and productivity metrics</p>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Performance Analytics</CardTitle>
            <CardDescription>View and compare admin performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Admin</label>
                <Select 
                  value={selectedAdmin || ""} 
                  onValueChange={(value) => setSelectedAdmin(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {admins?.map((admin: any) => (
                      <SelectItem key={admin.id} value={admin.id.toString()}>
                        {admin.adminName || admin.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Time Period</label>
                <Select 
                  value={selectedPeriod} 
                  onValueChange={(value) => {
                    setSelectedPeriod(value);
                    updateDateRangeFromPeriod(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedPeriod === "custom" && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Custom Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Select date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from || new Date()}
                        selected={{
                          from: dateRange.from || undefined,
                          to: dateRange.to || undefined,
                        }}
                        onSelect={(range) => 
                          setDateRange({ 
                            from: range?.from || null, 
                            to: range?.to || null 
                          })
                        }
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Top Performers Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Top Performing Admins</CardTitle>
            <CardDescription>
              Top 5 admins by sales volume during the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTopAdmins ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : topAdmins && topAdmins.length > 0 ? (
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topAdmins} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="adminName" width={150} />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'salesTotal') return [`$${formatNumber(value as number)}`, 'Sales Revenue'];
                        return [formatNumber(value as number), name === 'salesCount' ? 'Sales Count' : name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="salesCount" name="Sales Count" fill="#8884d8" />
                    <Bar dataKey="salesTotal" name="Revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {topAdmins.map((admin: any, index: number) => (
                    <Card key={admin.adminId} className={cn(
                      "overflow-hidden",
                      index === 0 && "border-2 border-primary"
                    )}>
                      <CardHeader className={cn(
                        "py-3",
                        index === 0 && "bg-primary text-primary-foreground"
                      )}>
                        <CardTitle className="text-sm font-medium flex items-center">
                          {index === 0 && <Award className="h-4 w-4 mr-2" />}
                          {admin.adminName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-4">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Sales</div>
                          <div className="text-xl font-bold">{formatNumber(admin.salesCount)}</div>
                        </div>
                        <div className="space-y-1 mt-3">
                          <div className="text-xs text-muted-foreground">Revenue</div>
                          <div className="text-xl font-bold">${formatNumber(admin.salesTotal)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="font-medium text-lg mb-2">No Performance Data Available</h3>
                <p className="text-muted-foreground">
                  No admin performance data exists for the selected period.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Individual Admin Performance */}
        {selectedAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>
                {admins?.find((a: any) => a.id.toString() === selectedAdmin)?.adminName || 'Admin'} Performance
              </CardTitle>
              <CardDescription>
                Detailed performance metrics for the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPerformance ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : adminPerformance && adminPerformance.length > 0 ? (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                          Total Sales
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(totals.totalSales)}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-primary" />
                          Revenue
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${formatNumber(totals.totalRevenue)}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-2 text-primary" />
                          Orders Processed
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(totals.totalOrders)}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <Users className="h-4 w-4 mr-2 text-primary" />
                          Customers Served
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(totals.totalCustomers)}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                          Avg. Order Value
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${formatNumber(totals.avgOrderValue)}</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Performance Tabs */}
                  <Tabs defaultValue="sales">
                    <TabsList className="mb-4">
                      <TabsTrigger value="sales">Sales</TabsTrigger>
                      <TabsTrigger value="revenue">Revenue</TabsTrigger>
                      <TabsTrigger value="orders">Orders</TabsTrigger>
                      <TabsTrigger value="customers">Customers</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="sales">
                      <Card>
                        <CardHeader>
                          <CardTitle>Sales Performance</CardTitle>
                          <CardDescription>Number of sales over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={performanceData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="revenue">
                      <Card>
                        <CardHeader>
                          <CardTitle>Revenue</CardTitle>
                          <CardDescription>Sales revenue over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={performanceData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip formatter={(value) => [`$${formatNumber(value as number)}`, 'Revenue']} />
                              <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fill="#82ca9d" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="orders">
                      <Card>
                        <CardHeader>
                          <CardTitle>Orders Processed</CardTitle>
                          <CardDescription>Number of orders processed over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={performanceData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="orders" stroke="#ff7300" />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="customers">
                      <Card>
                        <CardHeader>
                          <CardTitle>Customers Served</CardTitle>
                          <CardDescription>Number of customers served over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={performanceData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="customers" stroke="#ff0000" />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="font-medium text-lg mb-2">No Performance Data Available</h3>
                  <p className="text-muted-foreground">
                    No performance data exists for this admin during the selected period.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}