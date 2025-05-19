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
  Search,
  Mail,
  Phone,
  MapPin,
  User,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";

const AdminCustomers = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
      }
    },
  });

  const filteredUsers = users?.filter((user: any) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchTerm)
    );
  });

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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
        <title>Customer Management | DASH Admin</title>
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
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Customer Management</h1>
              <p className="text-gray-500">
                View and manage all registered customers
              </p>
            </div>

            {/* Search & Filter */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers by name, email or phone..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Customers Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Customer List</CardTitle>
                <CardDescription>
                  {filteredUsers?.length || 0} customers found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isUsersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[160px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredUsers && filteredUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((customer: any) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {customer.firstName?.[0] || customer.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {customer.firstName && customer.lastName
                                    ? `${customer.firstName} ${customer.lastName}`
                                    : customer.username}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {customer.isAdmin ? "Admin" : "Customer"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="mr-2 h-3 w-3 text-gray-500" />
                                {customer.email}
                              </div>
                              {customer.phone && (
                                <div className="flex items-center text-sm">
                                  <Phone className="mr-2 h-3 w-3 text-gray-500" />
                                  {customer.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {customer.city ? (
                              <div className="flex items-center text-sm">
                                <MapPin className="mr-2 h-3 w-3 text-gray-500" />
                                {customer.city}, {customer.country || ""}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Not set</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(customer.createdAt)}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Link href={`/admin/customers/${customer.id}`}>
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link href={`/admin/orders?customerId=${customer.id}`}>
                                    View Orders
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-10">
                    <User className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-4 text-gray-500">
                      {searchTerm
                        ? "No customers match your search criteria"
                        : "No customers found"}
                    </p>
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

export default AdminCustomers;