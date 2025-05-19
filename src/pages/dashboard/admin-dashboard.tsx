import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  ArrowUp, 
  ArrowDown, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  AlertCircle,
  Package, 
  Truck,
  CheckSquare,
  Calendar,
  Clock,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

// Define staff performance data interface
interface StaffPerformance {
  id: number;
  name: string;
  role: string;
  sales: number;
  target: number;
  inventory: number;
  orders: number;
  avatar?: string;
}

// Define overview metrics interface
interface OverviewMetrics {
  totalSales: number;
  percentChange: number;
  totalOrders: number;
  orderPercentChange: number;
  totalCustomers: number;
  customerPercentChange: number;
  totalProducts: number;
  productPercentChange: number;
}

// Dashboard component
const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [overviewMetrics, setOverviewMetrics] = useState<OverviewMetrics>({
    totalSales: 0,
    percentChange: 0,
    totalOrders: 0,
    orderPercentChange: 0,
    totalCustomers: 0,
    customerPercentChange: 0,
    totalProducts: 0,
    productPercentChange: 0
  });
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  // Get the current user role
  const userRole = (): 'admin' | 'manager' | 'storekeeper' | 'sales' => {
    if (!user) return 'sales'; // Default fallback
    
    if (user.username === 'owner') return 'admin';
    if (user.username.startsWith('storekeeper')) return 'storekeeper';
    if (user.username.startsWith('salesperson')) return 'sales';
    if (user.username.startsWith('manager')) return 'manager';
    
    // Check if user has admin role but is not the owner
    if (user.isAdmin && user.username !== 'owner') return 'manager';
    
    // Fallback for other cases
    return 'sales';
  };
  
  const role = userRole();
  
  // Fetch dashboard data based on role and time range
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsDataLoading(true);
      try {
        // Fetch overview metrics
        // In a real app, these would be separate API calls based on role permissions
        // For now, we'll simulate data for demonstration
        
        // Sales data would be fetched from an endpoint like "/api/analytics/sales?range=weekly"
        setOverviewMetrics({
          totalSales: 125000 + Math.floor(Math.random() * 50000),
          percentChange: 12.5,
          totalOrders: 28 + Math.floor(Math.random() * 10),
          orderPercentChange: 8.2,
          totalCustomers: 350 + Math.floor(Math.random() * 50),
          customerPercentChange: 5.7,
          totalProducts: 115 + Math.floor(Math.random() * 20),
          productPercentChange: -2.3
        });
        
        // Staff performance would be fetched from an endpoint like "/api/analytics/staff-performance"
        setStaffPerformance([
          {
            id: 1,
            name: "John Smith",
            role: "Sales Staff",
            sales: 28500,
            target: 30000,
            inventory: 15,
            orders: 12
          },
          {
            id: 2,
            name: "Emily Johnson",
            role: "Sales Staff",
            sales: 35200,
            target: 30000,
            inventory: 8,
            orders: 18
          },
          {
            id: 3,
            name: "Michael Brown",
            role: "Storekeeper",
            sales: 0,
            target: 0,
            inventory: 42,
            orders: 0
          },
          {
            id: 4,
            name: "Jessica Williams",
            role: "Sales Staff",
            sales: 24800,
            target: 30000,
            inventory: 10,
            orders: 10
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [timeRange, role]);
  
  // Redirect if not logged in or not authorized
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    navigate("/auth");
    return null;
  }
  
  // Role-based access control - redirect if not admin, manager, storekeeper or sales
  if (!['admin', 'manager', 'storekeeper', 'sales'].includes(role)) {
    navigate("/");
    return null;
  }
  
  // Sales chart data
  const salesChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'In-Store Sales',
        data: [18500, 22000, 19500, 24000, 27500, 32000, 31500],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 2,
      },
      {
        label: 'Online Sales',
        data: [22000, 19000, 23500, 25000, 28500, 30000, 26000],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  };
  
  // Products chart data
  const productChartData = {
    labels: ['Clothing', 'Bags', 'Shoes', 'Accessories', 'Jewelry'],
    datasets: [
      {
        label: 'Product Categories',
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Orders chart data
  const orderChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Orders',
        data: [65, 78, 52, 91, 83, 99],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };
  
  return (
    <AdminDashboardLayout>
      <Helmet>
        <title>Admin Dashboard | DASH Fashion</title>
      </Helmet>
      
      {/* Time range selector */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Welcome back, {user?.username}! Here's what's happening.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={timeRange === 'daily' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('daily')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Daily
          </Button>
          <Button 
            variant={timeRange === 'weekly' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('weekly')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Weekly
          </Button>
          <Button 
            variant={timeRange === 'monthly' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('monthly')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Monthly
          </Button>
          <Button 
            variant={timeRange === 'yearly' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeRange('yearly')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Yearly
          </Button>
        </div>
      </div>
      
      {/* Overview cards - shown to all roles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Total Sales - shown to admin, manager, sales */}
        {(['admin', 'manager', 'sales'].includes(role)) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{(overviewMetrics.totalSales / 100).toLocaleString()}</div>
              <div className="flex items-center pt-1 text-xs">
                {overviewMetrics.percentChange > 0 ? (
                  <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-rose-500 mr-1" />
                )}
                <span className={overviewMetrics.percentChange > 0 ? "text-emerald-500" : "text-rose-500"}>
                  {Math.abs(overviewMetrics.percentChange)}%
                </span>
                <span className="text-muted-foreground ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Total Orders - shown to all roles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.totalOrders}</div>
            <div className="flex items-center pt-1 text-xs">
              {overviewMetrics.orderPercentChange > 0 ? (
                <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-rose-500 mr-1" />
              )}
              <span className={overviewMetrics.orderPercentChange > 0 ? "text-emerald-500" : "text-rose-500"}>
                {Math.abs(overviewMetrics.orderPercentChange)}%
              </span>
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Total Customers - shown to admin, manager, sales */}
        {(['admin', 'manager', 'sales'].includes(role)) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewMetrics.totalCustomers}</div>
              <div className="flex items-center pt-1 text-xs">
                {overviewMetrics.customerPercentChange > 0 ? (
                  <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-rose-500 mr-1" />
                )}
                <span className={overviewMetrics.customerPercentChange > 0 ? "text-emerald-500" : "text-rose-500"}>
                  {Math.abs(overviewMetrics.customerPercentChange)}%
                </span>
                <span className="text-muted-foreground ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Total Products - shown to all roles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewMetrics.totalProducts}</div>
            <div className="flex items-center pt-1 text-xs">
              {overviewMetrics.productPercentChange > 0 ? (
                <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-rose-500 mr-1" />
              )}
              <span className={overviewMetrics.productPercentChange > 0 ? "text-emerald-500" : "text-rose-500"}>
                {Math.abs(overviewMetrics.productPercentChange)}%
              </span>
              <span className="text-muted-foreground ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts section */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Sales chart - shown to admin, manager, sales */}
        {(['admin', 'manager', 'sales'].includes(role)) && (
          <Card className="col-span-2 md:col-span-1">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Comparison between in-store and online sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar 
                  data={salesChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Sales (₦)'
                        }
                      }
                    }
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Product category distribution - shown to admin, manager, storekeeper */}
        {(['admin', 'manager', 'storekeeper'].includes(role)) && (
          <Card className="col-span-2 md:col-span-1">
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Distribution of products by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <Doughnut 
                  data={productChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      }
                    }
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Orders trends - shown to admin, manager, storekeeper, sales */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Trends</CardTitle>
          <CardDescription>Monthly order volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Line 
              data={orderChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Orders'
                    }
                  }
                }
              }} 
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Staff performance - shown to admin and manager only */}
      {(['admin', 'manager'].includes(role)) && (
        <Card>
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
            <CardDescription>Overview of staff sales and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Staff</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-right py-3 px-4">Sales</th>
                    <th className="text-right py-3 px-4">Target</th>
                    <th className="text-right py-3 px-4">Inventory</th>
                    <th className="text-right py-3 px-4">Orders</th>
                    <th className="text-right py-3 px-4">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {staffPerformance.map((staff) => (
                    <tr key={staff.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium mr-3">
                            {staff.name.substring(0, 2)}
                          </div>
                          <span>{staff.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{staff.role}</td>
                      <td className="py-3 px-4 text-right">
                        {staff.sales > 0 ? `₦${(staff.sales / 100).toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {staff.target > 0 ? `₦${(staff.target / 100).toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">{staff.inventory}</td>
                      <td className="py-3 px-4 text-right">{staff.orders}</td>
                      <td className="py-3 px-4 text-right">
                        {staff.target > 0 ? (
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                               style={{
                                 backgroundColor: staff.sales >= staff.target ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                 color: staff.sales >= staff.target ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)'
                               }}>
                            {staff.sales >= staff.target ? (
                              <CheckSquare className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {Math.round((staff.sales / staff.target) * 100)}%
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;