import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Percent,
  Calendar,
  MoreHorizontal,
  Plus,
  Trash2,
  Edit,
  Copy,
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const promotionSchema = z.object({
  code: z.string().min(3, { message: "Coupon code must be at least 3 characters" }),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().min(1, { message: "Discount value must be greater than 0" }),
  minPurchase: z.coerce.number().min(0, { message: "Minimum purchase must be a positive number" }).optional(),
  maxUses: z.coerce.number().min(1, { message: "Maximum uses must be greater than 0" }).optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
  applicableCategories: z.array(z.string()).optional(),
  applicableBrands: z.array(z.string()).optional(),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

const AdminPromotions = () => {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);

  // Fetch all promotions (coupons)
  const { data: promotions, isLoading: isPromotionsLoading } = useQuery({
    queryKey: ["/api/coupons"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/coupons", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch coupons");
        return res.json();
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
        return [];
      }
    },
  });

  // Create promotion mutation
  const createPromotionMutation = useMutation({
    mutationFn: async (data: PromotionFormValues) => {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create coupon");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Promotion created successfully",
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/coupons"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create promotion",
        variant: "destructive",
      });
    },
  });

  // Delete promotion mutation
  const deletePromotionMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/coupons/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete coupon");
      }
      
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Promotion deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/coupons"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete promotion",
        variant: "destructive",
      });
    },
  });

  const filteredPromotions = promotions?.filter((promo: any) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      promo.code?.toLowerCase().includes(searchLower) ||
      promo.description?.toLowerCase().includes(searchLower)
    );
  });

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: 10,
      minPurchase: 0,
      maxUses: 100,
      isActive: true,
      description: "",
      applicableCategories: [],
      applicableBrands: [],
    },
  });

  const handleCreatePromotion = (data: PromotionFormValues) => {
    createPromotionMutation.mutate(data);
  };

  const handleDeletePromotion = (id: number) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      deletePromotionMutation.mutate(id);
    }
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
      // Redirect to home page after logout
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No expiration";
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
        <title>Promotions Management | DASH Admin</title>
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
                <h1 className="text-2xl font-bold mb-2">Promotions Management</h1>
                <p className="text-gray-500">
                  Create and manage promotional coupons
                </p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#D4AF37] hover:bg-[#C09B2A]">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Promotion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Promotion</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to create a new promotional coupon.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreatePromotion)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Coupon Code</FormLabel>
                            <FormControl>
                              <Input placeholder="SUMMER20" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter a unique code for customers to use at checkout
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="discountType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a discount type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="discountValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {form.watch("discountType") === "percentage" 
                                ? "Discount Percentage (%)" 
                                : "Discount Amount ($)"}
                            </FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="minPurchase"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Min. Purchase ($)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="maxUses"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Uses</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="expiresAt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiration Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Active</FormLabel>
                              <FormDescription>
                                Enable this promotion to make it available for customers
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Summer sale discount" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createPromotionMutation.isPending}>
                          {createPromotionMutation.isPending ? "Creating..." : "Create Promotion"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search & Filter */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search promotions by code or description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Promotions Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Promotion List</CardTitle>
                <CardDescription>
                  {filteredPromotions?.length || 0} promotions found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPromotionsLoading ? (
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
                ) : filteredPromotions && filteredPromotions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPromotions.map((promotion: any) => (
                        <TableRow key={promotion.id}>
                          <TableCell>
                            <div className="font-medium">{promotion.code}</div>
                            <div className="text-sm text-gray-500">{promotion.description}</div>
                          </TableCell>
                          <TableCell>
                            {promotion.discountType === "percentage" ? (
                              <div className="flex items-center">
                                <Percent className="mr-1 h-3.5 w-3.5 text-gray-500" />
                                <span>{promotion.discountValue}% off</span>
                              </div>
                            ) : (
                              <div>${promotion.discountValue} off</div>
                            )}
                            {promotion.minPurchase > 0 && (
                              <div className="text-xs text-gray-500">
                                Min. purchase: ${promotion.minPurchase}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {promotion.isActive ? (
                              <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                                Active
                              </div>
                            ) : (
                              <Badge variant="secondary">
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3.5 w-3.5 text-gray-500" />
                              <span>{formatDate(promotion.expiresAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {promotion.usedCount || 0} / {promotion.maxUses || "∞"}
                            </div>
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
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/promotions/${promotion.id}`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    navigator.clipboard.writeText(promotion.code);
                                    toast({
                                      title: "Copied",
                                      description: "Coupon code copied to clipboard",
                                    });
                                  }}
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy Code
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeletePromotion(promotion.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
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
                    <Tag className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-4 text-gray-500">
                      {searchTerm
                        ? "No promotions match your search criteria"
                        : "No promotions created yet"}
                    </p>
                    <Button
                      variant="link"
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="mt-2"
                    >
                      Create your first promotion
                    </Button>
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

export default AdminPromotions;