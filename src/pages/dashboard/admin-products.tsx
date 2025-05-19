// @ts-nocheck

import { useState } from "react";
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
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Product } from "@/lib/schema";

const AdminProducts = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProductMutation.mutate(selectedProduct.id);
    }
  };

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

  const filteredProducts = products
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <Helmet>
        <title>Manage Products | Admin Dashboard</title>
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
              <h1 className="text-xl font-medium">Products Management</h1>
              <Link href="/admin/products/new">
                <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </header>

          <main className="p-6">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="flex-shrink-0">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
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
                ) : filteredProducts.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Product</th>
                            <th className="text-left py-3 px-4">Category</th>
                            <th className="text-left py-3 px-4">Brand</th>
                            <th className="text-right py-3 px-4">Price</th>
                            <th className="text-right py-3 px-4">Stock</th>
                            <th className="text-right py-3 px-4">Featured</th>
                            <th className="text-center py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentProducts.map((product) => (
                            <tr key={product.id} className="border-b">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 mr-3 overflow-hidden rounded">
                                    <img
                                      src={product.images[0]}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="truncate max-w-[12rem]">
                                    {product.name}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">{product.category}</td>
                              <td className="py-3 px-4">{product.brand}</td>
                              <td className="py-3 px-4 text-right">
                                {product.discountPrice ? (
                                  <div>
                                    <span className="line-through text-gray-500">
                                      ₦{product.price.toLocaleString()}
                                    </span>
                                    <span className="ml-2 text-red-600">
                                      ₦{product.discountPrice.toLocaleString()}
                                    </span>
                                  </div>
                                ) : (
                                  <span>₦{product.price.toLocaleString()}</span>
                                )}
                              </td>
                              <td
                                className={`py-3 px-4 text-right ${
                                  product.quantity === 0
                                    ? "text-red-600"
                                    : product.quantity < 10
                                    ? "text-yellow-600"
                                    : "text-green-600"
                                }`}
                              >
                                {product.quantity}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {product.featured ? (
                                  <span className="text-[#D4AF37]">✓</span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex justify-center space-x-2">
                                  <Link href={`/admin/products/edit/${product.id}`}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => handleDeleteClick(product)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
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
                    No products found.
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminProducts;
