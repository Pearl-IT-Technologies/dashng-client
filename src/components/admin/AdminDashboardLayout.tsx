import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  Home, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  BarChart2, 
  Settings, 
  Truck, 
  LogOut, 
  Menu, 
  X, 
  User, 
  ShoppingCart, 
  AlertCircle, 
  Edit3,
  Database,
  Tag,
  ChevronLeft,
  Bell,
  Clock,
  Key,
  Inbox,
  Gift,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define interface for NavItem
interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
  roles: ('admin' | 'manager' | 'storekeeper' | 'sales')[];
  badge?: number | string;
}

// Define interface for component props
interface AdminDashboardLayoutProps {
  children: ReactNode;
}

const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location] = useLocation();
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  // Sample notification data - in a real app this would come from an API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Order',
      message: 'Order #12345 has been placed and is awaiting processing',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      icon: <Package className="h-5 w-5 text-primary" />,
      read: false
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      message: '5 products are running low on inventory',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
      read: false
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Payment of ₦45,500 received for order #12340',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: <ShoppingCart className="h-5 w-5 text-emerald-500" />,
      read: true
    },
    {
      id: 4,
      title: 'System Update',
      message: 'New features have been added to the dashboard',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      icon: <Database className="h-5 w-5 text-blue-500" />,
      read: true
    },
    {
      id: 5,
      title: 'New User Registered',
      message: 'A new customer has created an account',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: <User className="h-5 w-5 text-violet-500" />,
      read: true
    }
  ]);
  
  // Function to mark a single notification as read
  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Function to mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    toast({
      title: "Marked all as read",
      description: "All notifications have been marked as read.",
    });
  };
  
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

  // Navigation items based on user role
  const navItems: NavItem[] = [
    { 
      label: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: <Home className="h-5 w-5" />, 
      roles: ['admin', 'manager', 'storekeeper', 'sales'] 
    },
    { 
      label: 'Inventory', 
      path: '/admin/inventory', 
      icon: <ShoppingBag className="h-5 w-5" />, 
      roles: ['admin', 'manager', 'storekeeper', 'sales'],
      badge: 25 // Example of new items in inventory
    },
    { 
      label: 'Products', 
      path: '/admin/products', 
      icon: <Tag className="h-5 w-5" />, 
      roles: ['admin', 'manager', 'storekeeper'] 
    },
    { 
      label: 'Orders', 
      path: '/admin/orders', 
      icon: <Package className="h-5 w-5" />, 
      roles: ['admin', 'manager', 'sales'],
      badge: 12 // Example of pending orders
    },
    { 
      label: 'Shipments', 
      path: '/admin/shipments', 
      icon: <Truck className="h-5 w-5" />, 
      roles: ['admin', 'manager', 'storekeeper'] 
    },
    { 
      label: 'Staff', 
      path: '/admin/staff', 
      icon: <Users className="h-5 w-5" />, 
      roles: ['admin', 'manager'] 
    },
    { 
      label: 'Sales', 
      path: '/admin/sales', 
      icon: <ShoppingCart className="h-5 w-5" />, 
      roles: ['admin', 'manager', 'sales'] 
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['admin', 'manager', 'storekeeper', 'sales']
    },
    { 
      label: 'Analytics', 
      path: '/admin/analytics', 
      icon: <TrendingUp className="h-5 w-5" />, 
      roles: ['admin', 'manager'] 
    },
    { 
      label: 'Reports', 
      path: '/admin/reports', 
      icon: <BarChart2 className="h-5 w-5" />, 
      roles: ['admin', 'manager'] 
    },
    { 
      label: 'Settings', 
      path: '/admin/settings', 
      icon: <Settings className="h-5 w-5" />, 
      roles: ['admin', 'manager', 'storekeeper', 'sales'] 
    },
    { 
      label: 'Product Images', 
      path: '/admin/images', 
      icon: <Edit3 className="h-5 w-5" />, 
      roles: ['admin', 'manager'] 
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/auth');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
        variant: "default",
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Close sidebar when route changes (for mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  // Role display names
  const roleDisplayNames = {
    admin: 'Business Owner',
    manager: 'Store Manager',
    storekeeper: 'Storekeeper',
    sales: 'Sales Staff'
  };
  
  // We're using the notifications state from above

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle button */}
      <div className="fixed z-50 top-4 left-4 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-full bg-background shadow-md"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar - desktop is static, mobile is animated */}
      <motion.aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card shadow-lg flex-shrink-0 flex flex-col md:relative md:translate-x-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : -256,
          opacity: isSidebarOpen ? 1 : 0.8
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Brand Logo and Name */}
        <div className="px-4 py-6 flex items-center">
          <div className="font-bold text-2xl tracking-tight flex-1 text-primary">DASH</div>
          <div className="text-xs bg-primary text-white px-2 py-1 rounded-md">Admin</div>
        </div>
        
        {/* User Profile Section */}
        <div className="px-4 py-3 border-b flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={user?.username || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.username?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.username || "User"}</p>
            <p className="text-xs text-muted-foreground">{user ? roleDisplayNames[role] : "Guest"}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.path} className="relative group">
                <Button
                  variant={location === item.path ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    location === item.path ? "bg-primary text-primary-foreground" : ""
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="outline" className={location === item.path ? "bg-primary-foreground text-primary" : ""}>{item.badge}</Badge>
                  )}
                </Button>
                
                {/* Tooltip that shows on hover when sidebar is collapsed */}
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden md:hidden group-hover:block z-50">
                  <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded shadow-lg text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer with logout button */}
        <div className="p-4 border-t">
          <div className="relative group">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </Button>
            
            {/* Tooltip that shows on hover when sidebar is collapsed */}
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden md:hidden group-hover:block z-50">
              <div className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded shadow-lg text-sm font-medium whitespace-nowrap">
                Log out from DASH
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0 overflow-hidden">
        {/* Header */}
        <header className="bg-card shadow z-10 py-4 px-6 md:px-8 sticky top-0">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative group">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mr-2" 
                    onClick={() => {
                      // Log current user info for debugging
                      console.log('Navigating to dashboard. User role:', user?.adminRole);
                      
                      // Direct storekeepers to staff dashboard, others to admin dashboard
                      if (user && user.adminRole === 'storekeeper') {
                        window.location.href = '/admin/staff';
                      } else if (user && user.adminRole === 'sales') {
                        window.location.href = '/admin/staff';
                      } else if (user && user.adminRole === 'super') {
                        window.location.href = '/admin/super';
                      } else {
                        window.location.href = '/admin/dashboard';
                      }
                      
                      // Add toast notification to confirm action
                      toast({
                        title: "Navigating to dashboard",
                        description: "Redirecting to your dashboard...",
                      });
                    }}
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    <span>Back to Dashboard</span>
                  </Button>
                  
                  {/* Hover tooltip */}
                  <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50">
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                      Return to main dashboard
                    </div>
                  </div>
                </div>
                <h1 className="text-2xl font-bold">
                  {filteredNavItems.find(item => item.path === location)?.label || "Dashboard"}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setNotificationDialogOpen(true)}
                  >
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </Button>
                  <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50">
                    <div className="bg-card px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                      Notifications
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setProfileDialogOpen(true)}
                  >
                    <User className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50">
                    <div className="bg-card px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                      Profile
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs - only show on certain pages */}
            {['/admin/images', '/admin/inventory', '/admin/products', '/admin/sales'].includes(location) && (
              <Tabs defaultValue="view" className="w-full">
                <TabsList className="grid grid-cols-4 max-w-md">
                  <div className="relative group">
                    <TabsTrigger value="view" onClick={() => {}}>View</TabsTrigger>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block z-50">
                      <div className="bg-primary text-primary-foreground px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                        View {location.split('/').pop()?.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <TabsTrigger value="add" onClick={() => {}}>Add New</TabsTrigger>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block z-50">
                      <div className="bg-primary text-primary-foreground px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                        Add new {location.split('/').pop()?.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <TabsTrigger value="manage" onClick={() => {}}>Manage</TabsTrigger>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block z-50">
                      <div className="bg-primary text-primary-foreground px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                        Manage {location.split('/').pop()?.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <TabsTrigger value="reports" onClick={() => {}}>Reports</TabsTrigger>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block z-50">
                      <div className="bg-primary text-primary-foreground px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
                        {location.split('/').pop()?.replace('-', ' ')} reports
                      </div>
                    </div>
                  </div>
                </TabsList>
              </Tabs>
            )}
          </div>
        </header>

        {/* Main content area with padding */}
        <main className="flex-1 overflow-auto p-6 md:p-8 bg-background">
          {children}
        </main>
      </div>
      
      {/* Notifications Dialog */}
      <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" /> Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge variant="outline" className="ml-2 bg-primary text-primary-foreground">
                  {notifications.filter(n => !n.read).length} new
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Stay updated with the latest activities and alerts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-1">No notifications</h3>
                <p className="text-muted-foreground text-sm">You're all caught up! Check back later for updates.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Card key={notification.id} className={`overflow-hidden ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 p-2 rounded-full ${!notification.read ? 'bg-primary/10' : 'bg-muted'}`}>
                          {notification.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {notification.timestamp.toLocaleTimeString('en-NG', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              {(() => {
                                const now = new Date();
                                const diff = now.getTime() - notification.timestamp.getTime();
                                const minutes = Math.floor(diff / 60000);
                                const hours = Math.floor(minutes / 60);
                                const days = Math.floor(hours / 24);
                                
                                if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
                                if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
                                if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
                                return 'Just now';
                              })()}
                            </span>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <Badge variant="outline" className="bg-primary/10 text-primary text-xs hover:bg-primary/20">
                                  New
                                </Badge>
                              )}
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => markNotificationAsRead(notification.id)}
                                >
                                  Mark as read
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs"
              onClick={markAllNotificationsAsRead}
              disabled={notifications.every(notification => notification.read)}
            >
              Mark all as read
            </Button>
            <Button onClick={() => setNotificationDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Manage your account information and preferences.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {/* User profile section */}
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src="" alt={user?.username || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {user?.username?.substring(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{user?.username || "User"}</h3>
                <p className="text-sm text-muted-foreground">{user ? roleDisplayNames[role] : "Guest"}</p>
                <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
              </div>
            </div>
            
            {/* Quick actions section */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button variant="outline" className="justify-start" onClick={() => navigate('/admin/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" className="justify-start">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="justify-start">
                <Inbox className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button variant="outline" className="justify-start">
                <Gift className="h-4 w-4 mr-2" />
                Rewards
              </Button>
            </div>
            
            {/* Other options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Security Settings</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/settings')}>
                  Manage
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Notification Preferences</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/settings')}>
                  Manage
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              className="mr-auto"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button onClick={() => setProfileDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboardLayout;