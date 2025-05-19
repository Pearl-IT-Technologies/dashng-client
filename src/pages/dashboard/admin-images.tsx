import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";
import ImageManager from "@/components/admin/ImageManager";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const AdminImagesPage = () => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("view");
  
  // Redirect if not logged in or not an admin
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user || !user.isAdmin) {
    navigate("/");
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Product Image Management | Admin Dashboard</title>
      </Helmet>
      
      <AdminDashboardLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2">Product Image Management</h2>
            <p className="text-muted-foreground">
              Add and manage product images across the catalog.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="view">View Images</TabsTrigger>
              <TabsTrigger value="add">Add New</TabsTrigger>
              <TabsTrigger value="manage">Categories</TabsTrigger>
              <TabsTrigger value="reports">Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="view" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Browse Product Images</CardTitle>
                  <CardDescription>
                    View and search through all product images in the catalog
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageManager initialView="browse" />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="add" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Product Images</CardTitle>
                  <CardDescription>
                    Upload new images for products or bulk add products with images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageManager initialView="add" />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="manage" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Image Categories</CardTitle>
                  <CardDescription>
                    Organize images by product category and subcategory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageManager initialView="categories" />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Image Statistics</CardTitle>
                  <CardDescription>
                    View reports on image usage and product coverage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageManager initialView="statistics" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminDashboardLayout>
    </>
  );
};

export default AdminImagesPage;