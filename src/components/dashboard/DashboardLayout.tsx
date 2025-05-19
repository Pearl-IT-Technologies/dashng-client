import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  Menu,
  X,
  LogOut,
  ChartBarStacked,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FileText,
  Store,
  Shield,
  UserCog,
  ClipboardList,
  BarChart3,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  //@ts-ignore
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Check if the user is store personnel but not admin
  const isStorePersonnel = user?.isAdmin && 
                           !user?.isMasterAdmin && 
                           !user?.isSuperAdmin && 
                           (user?.adminRole === 'storekeeper' || 
                            user?.adminRole === 'salesperson');

  // Redirect store personnel to their dashboard if they try to access admin pages
  if (isStorePersonnel && 
      location.startsWith('/admin/') && 
      !location.startsWith('/admin/staff') && 
      !location.startsWith('/admin/products') && 
      !location.startsWith('/admin/inventory') && 
      !location.startsWith('/admin/orders') && 
      !location.startsWith('/admin/customers')) {
    setLocation('/admin/staff');
    return null;
  }

  let navItems = [];
  
  if (isStorePersonnel) {
    // Store personnel menu items
    navItems = [
      {
        label: "Staff Dashboard",
        icon: <ChartBarStacked className="h-5 w-5" />,
        href: "/admin/staff",
      },
      {
        label: "In-Store Orders",
        icon: <ShoppingCart className="h-5 w-5" />,
        href: "/admin/orders",
      },
      {
        label: "Inventory",
        icon: <Store className="h-5 w-5" />,
        href: "/admin/inventory",
      },
      {
        label: "Products",
        icon: <Package className="h-5 w-5" />,
        href: "/admin/products",
      },
      {
        label: "Customers",
        icon: <Users className="h-5 w-5" />,
        href: "/admin/customers",
      },
    ];
  } else {
    // Regular admin menu items
    navItems = [
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
        label: "Inventory",
        icon: <Store className="h-5 w-5" />,
        href: "/admin/inventory",
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
    
    // Add Store Personnel management for master admins
    if (user?.isMasterAdmin || user?.adminRole === 'master') {
      navItems.push({
        label: "Store Personnel",
        icon: <Users className="h-5 w-5" />,
        href: "/admin/personnel",
      });
      navItems.push({
        label: "Activity Logs",
        icon: <ClipboardList className="h-5 w-5" />,
        href: "/admin/activity-logs",
      });
    }
    
    // Add Super Admin section for super admins
    if (user?.isSuperAdmin) {
      navItems.push({
        label: "Super Admin",
        icon: <Shield className="h-5 w-5" />,
        href: "/admin/super",
      });
      navItems.push({
        label: "Staff Management",
        icon: <UserCog className="h-5 w-5" />,
        href: "/admin/super/personnel", // Changed to super/personnel to avoid duplicate keys
      });
      navItems.push({
        label: "Activity Logs",
        icon: <ClipboardList className="h-5 w-5" />,
        href: "/admin/super/activity-logs",
      });
      navItems.push({
        label: "Admin Performance",
        icon: <BarChart3 className="h-5 w-5" />,
        href: "/admin/super/performance",
      });
    }
  }

  const isActiveLink = (path: string) => {
    return location === path;
  };

  return (
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
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
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
            {navItems.map((item, index) => (
              <li key={`${item.href}-${index}`}>
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
                <p className="text-xs text-gray-500">
                  {user?.isSuperAdmin 
                    ? "Super Admin" 
                    : user?.isMasterAdmin 
                    ? "Master Admin" 
                    : user?.adminRole === 'storekeeper'
                    ? "Store Keeper"
                    : user?.adminRole === 'salesperson'
                    ? "Sales Person"
                    : "Administrator"}
                </p>
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
        {children}
      </div>
    </div>
  );
}