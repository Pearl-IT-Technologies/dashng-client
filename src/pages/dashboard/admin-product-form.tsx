import { useState, useEffect } from "react";
import { useLocation, useRoute, useRouter } from "wouter";
import { Helmet } from "react-helmet";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/admin/ProductForm";
import { Product } from "../schema";

const AdminProductForm = () => {
  const [, setLocation] = useLocation();
  const router = useRouter();
  const [, params] = useRoute("/admin/products/edit/:id");
  const isEdit = !!params?.id;
  const productId = params?.id ? parseInt(params.id) : null;
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);

  // Fetch product if in edit mode
  const { data: product, isLoading: isProductLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      if (!productId) return null;
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }
      return res.json();
    },
    enabled: isEdit && !!productId,
  });

  useEffect(() => {
    // Set loading state based on whether we're waiting for product data
    setLoading(isEdit ? isProductLoading : false);
  }, [isEdit, isProductLoading]);

  // Ensure user is admin, redirect if not
  if (!user?.isAdmin) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">You do not have permission to access this page.</p>
        <Button onClick={() => setLocation("/")}>Return to Home</Button>
      </div>
    );
  }

  const handleSuccess = (product: Product) => {
    queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    if (isEdit) {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/products", productId] 
      });
    }
    setLocation("/admin/products");
  };

  const handleCancel = () => {
    setLocation("/admin/products");
  };

  return (
    <>
      <Helmet>
        <title>{isEdit ? "Edit Product" : "Add Product"} | Admin Dashboard</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm py-4 px-6 mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={handleCancel} className="mr-4">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Products
            </Button>
            <h1 className="text-xl font-medium">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
          </div>
        </div>

        <main className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <ProductForm
              initialData={isEdit ? product : null}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default AdminProductForm;