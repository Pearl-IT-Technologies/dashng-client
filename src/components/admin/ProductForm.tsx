import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Loader2, X, Plus, Upload, Image as ImageIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { insertProductSchema, Product } from "@/lib/schema";

const formSchema = insertProductSchema.extend({
  images: z.array(z.string()).min(1, "At least one image is required"),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  price: z.number().min(1, "Price must be greater than 0"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  storeQuantity: z.number().min(0, "Store quantity cannot be negative"),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: Product | null;
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

const categories = [
  { value: "clothing", label: "Clothing" },
  { value: "bags", label: "Bags" },
  { value: "shoes", label: "Shoes" },
  { value: "jewelry", label: "Jewelry" },
  { value: "accessories", label: "Accessories" },
];

const subcategories = {
  clothing: [
    { value: "dresses", label: "Dresses" },
    { value: "tops", label: "Tops" },
    { value: "pants", label: "Pants" },
    { value: "skirts", label: "Skirts" },
    { value: "suits", label: "Suits" },
    { value: "outerwear", label: "Outerwear" },
    { value: "activewear", label: "Activewear" },
    { value: "men", label: "Men's Clothing" },
    { value: "women", label: "Women's Clothing" },
  ],
  bags: [
    { value: "tote", label: "Tote Bags" },
    { value: "clutch", label: "Clutch Bags" },
    { value: "shoulder", label: "Shoulder Bags" },
    { value: "crossbody", label: "Crossbody Bags" },
    { value: "backpack", label: "Backpacks" },
    { value: "travel", label: "Travel Bags" },
  ],
  shoes: [
    { value: "heels", label: "Heels" },
    { value: "flats", label: "Flats" },
    { value: "sneakers", label: "Sneakers" },
    { value: "boots", label: "Boots" },
    { value: "sandals", label: "Sandals" },
    { value: "loafers", label: "Loafers" },
  ],
  jewelry: [
    { value: "necklaces", label: "Necklaces" },
    { value: "earrings", label: "Earrings" },
    { value: "bracelets", label: "Bracelets" },
    { value: "rings", label: "Rings" },
    { value: "watches", label: "Watches" },
  ],
  accessories: [
    { value: "belts", label: "Belts" },
    { value: "scarves", label: "Scarves" },
    { value: "hats", label: "Hats" },
    { value: "sunglasses", label: "Sunglasses" },
    { value: "wallets", label: "Wallets" },
  ],
};

const brands = [
  { value: "Luxury Brand", label: "Luxury Brand" },
  { value: "Designer Collection", label: "Designer Collection" },
  { value: "Premium Menswear", label: "Premium Menswear" },
  { value: "Premium Womenswear", label: "Premium Womenswear" },
  { value: "Urban Premium", label: "Urban Premium" },
  { value: "Classic Luxury", label: "Classic Luxury" },
  { value: "Fine Jewelry", label: "Fine Jewelry" },
  { value: "Haute Couture", label: "Haute Couture" },
];

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const isEditing = !!initialData;
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [currentColor, setCurrentColor] = useState("");
  const [currentSize, setCurrentSize] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialData?.category || "clothing"
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default values for the form
  const defaultValues: Partial<ProductFormValues> = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    discountPrice: initialData?.discountPrice || null,
    discountPercentage: initialData?.discountPercentage || null,
    discountEndDate: initialData?.discountEndDate || null,
    category: initialData?.category || "clothing",
    subcategory: initialData?.subcategory || "",
    brand: initialData?.brand || "",
    brandType: initialData?.brandType || "",
    images: initialData?.images || [],
    colors: initialData?.colors || [],
    sizes: initialData?.sizes || [],
    material: initialData?.material || "",
    careInstructions: initialData?.careInstructions || "",
    inStock: initialData?.inStock !== undefined ? initialData.inStock : true,
    quantity: initialData?.quantity !== undefined ? initialData.quantity : 0,
    featured: initialData?.featured || false,
    isNewArrival: initialData?.isNewArrival || false,
    barcode: initialData?.barcode || "",
    sku: initialData?.sku || "",
    inStoreAvailable: initialData?.inStoreAvailable || false,
    storeQuantity: initialData?.storeQuantity || 0,
    specifications: initialData?.specifications || {},
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const watchCategory = form.watch("category");
  if (watchCategory !== selectedCategory) {
    setSelectedCategory(watchCategory);
    form.setValue("subcategory", ""); // Reset subcategory when category changes
  }

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      // JSON.stringify() and JSON.parse() to handle any undefined values
      const sanitizedData = JSON.parse(JSON.stringify(data));

      // Fix for potential null/undefined arrays
      if (!sanitizedData.colors) sanitizedData.colors = [];
      if (!sanitizedData.sizes) sanitizedData.sizes = [];
      if (!sanitizedData.images) sanitizedData.images = [];

      let result;
      if (isEditing && initialData) {
        // Update existing product
        const response = await apiRequest(
          "PUT",
          `/api/products/${initialData.id}`,
          sanitizedData
        );
        result = await response.json();
        toast({
          title: "Product updated",
          description: "The product has been successfully updated.",
        });
      } else {
        // Create new product
        const response = await apiRequest("POST", "/api/products", sanitizedData);
        result = await response.json();
        
        // If we uploaded images and just created a new product, update the product with the correct product ID
        if (result && result.id && sanitizedData.images && sanitizedData.images.length > 0) {
          // Some images may have been uploaded before knowing the product ID
          // Let's ensure they're properly associated with this product
          try {
            // The backend will handle this automatically with productId in the request
            // But we'll make sure the images array is correctly linked in the product
            const updateResponse = await apiRequest(
              "PUT",
              `/api/products/${result.id}`,
              { 
                images: sanitizedData.images,
                // Include product ID in case the images need to be reorganized in storage
                productId: result.id
              }
            );
            
            // Update result with the latest data
            result = await updateResponse.json();
          } catch (updateError) {
            console.error("Error updating product with correct image associations:", updateError);
            // Don't fail the entire operation if this additional step fails
          }
        }
        
        toast({
          title: "Product created",
          description: "The product has been successfully created.",
        });
      }

      onSuccess(result);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: isEditing ? "Failed to update product" : "Failed to create product",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddColor = () => {
    if (currentColor && !form.getValues("colors")?.includes(currentColor)) {
      const currentColors = form.getValues("colors") || [];
      form.setValue("colors", [...currentColors, currentColor]);
      setCurrentColor("");
    }
  };

  const handleRemoveColor = (color: string) => {
    const currentColors = form.getValues("colors") || [];
    form.setValue(
      "colors",
      currentColors.filter((c) => c !== color)
    );
  };

  const handleAddSize = () => {
    if (currentSize && !form.getValues("sizes")?.includes(currentSize)) {
      const currentSizes = form.getValues("sizes") || [];
      form.setValue("sizes", [...currentSizes, currentSize]);
      setCurrentSize("");
    }
  };

  const handleRemoveSize = (size: string) => {
    const currentSizes = form.getValues("sizes") || [];
    form.setValue(
      "sizes",
      currentSizes.filter((s) => s !== size)
    );
  };

  const handleAddImage = () => {
    if (
      currentImage &&
      currentImage.startsWith("http") &&
      !form.getValues("images")?.includes(currentImage)
    ) {
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, currentImage]);
      setCurrentImage("");
    } else if (currentImage) {
      toast({
        title: "Invalid image URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = (image: string) => {
    const currentImages = form.getValues("images") || [];
    form.setValue(
      "images",
      currentImages.filter((i) => i !== image)
    );
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImage(true);
    setUploadProgress(0);
    
    try {
      // Get product info for better file naming
      const productName = form.getValues("name") || "";
      const productId = isEditing && initialData ? initialData.id : undefined;
      
      // Create form data for upload
      const formData = new FormData();
      
      // If multiple files, use multiple upload endpoint
      if (files.length > 1) {
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }
        
        // Add product info for better file organization
        if (productId) formData.append('productId', productId.toString());
        if (productName) formData.append('productName', productName);
        
        // Use category as image type for better organization
        formData.append('imageType', form.getValues("category") || "product");
        
        const response = await fetch('/api/products/upload-multiple', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload images');
        }
        
        const result = await response.json();
        
        // Add new images to the form
        const currentImages = form.getValues("images") || [];
        form.setValue("images", [...currentImages, ...result.imageUrls]);
        
        toast({
          title: 'Images uploaded',
          description: `Successfully uploaded ${result.imageUrls.length} images`,
        });
      } else {
        // Single file upload
        formData.append('image', files[0]);
        
        // Add product info for better file organization
        if (productId) formData.append('productId', productId.toString());
        if (productName) formData.append('productName', productName);
        
        // Use category as image type for better organization
        formData.append('imageType', form.getValues("category") || "product");
        
        const response = await fetch('/api/products/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const result = await response.json();
        
        // Add new image to the form
        const currentImages = form.getValues("images") || [];
        form.setValue("images", [...currentImages, result.imageUrl]);
        
        toast({
          title: 'Image uploaded',
          description: 'Successfully uploaded image',
        });
      }
      
      // If we have a valid product, auto-save the product with the new images
      if (isEditing && initialData) {
        // Update existing product automatically with new images
        try {
          const currentData = form.getValues();
          const sanitizedData = JSON.parse(JSON.stringify(currentData));
          
          await apiRequest(
            "PUT",
            `/api/products/${initialData.id}`,
            sanitizedData
          );
          
          toast({
            title: "Product updated",
            description: "The product has been automatically updated with new images.",
          });
        } catch (error) {
          console.error("Error auto-updating product:", error);
          // Don't show error toast since images were uploaded successfully
        }
      }
      
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Upload failed',
        description: (error as Error).message || 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details & Pricing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="images">Images & Variants</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details of the product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category*</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCategory(value);
                            form.setValue("subcategory", "");
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subcategory</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subcategory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subcategories[selectedCategory as keyof typeof subcategories]?.map(
                              (subcategory) => (
                                <SelectItem
                                  key={subcategory.value}
                                  value={subcategory.value}
                                >
                                  {subcategory.label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          //@ts-ignore
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {brands.map((brand) => (
                              <SelectItem
                                key={brand.value}
                                value={brand.value}
                              >
                                {brand.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter brand type"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          E.g., Luxury, Designer, Premium
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details & Pricing Tab */}
          <TabsContent value="details" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>
                  Set your product's price and discounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₦)*</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => {
                              field.onChange(
                                e.target.value === ""
                                  ? 0
                                  : parseFloat(e.target.value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Price (₦)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            value={field.value === null ? "" : field.value}
                            onChange={(e) => {
                              field.onChange(
                                e.target.value === ""
                                  ? null
                                  : parseFloat(e.target.value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Percentage (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            max="100"
                            {...field}
                            value={field.value === null ? "" : field.value}
                            onChange={(e) => {
                              field.onChange(
                                e.target.value === ""
                                  ? null
                                  : parseInt(e.target.value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount End Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              field.onChange(
                                e.target.value === ""
                                  ? null
                                  : new Date(e.target.value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Material & Care</CardTitle>
                <CardDescription>
                  Information about the product's materials and care instructions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., 100% Cotton, Leather, etc."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="careInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Care Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="E.g., Hand wash cold, Dry clean only, etc."
                          {...field}
                          value={field.value || ""}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  Manage your product's inventory and availability.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-row items-start space-x-3 space-y-0">
                  <FormField
                    control={form.control}
                    name="inStock"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>In Stock</FormLabel>
                          <FormDescription>
                            Is this product in stock online?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-row items-start space-x-3 space-y-0 pt-4">
                  <FormField
                    control={form.control}
                    name="inStoreAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Available In-Store</FormLabel>
                          <FormDescription>
                            Is this product available in physical stores?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Online Quantity*</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(
                                e.target.value === ""
                                  ? 0
                                  : parseInt(e.target.value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Number of items available for online purchase
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="storeQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>In-Store Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            onChange={(e) => {
                              field.onChange(
                                e.target.value === ""
                                  ? 0
                                  : parseInt(e.target.value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Number of items available in physical stores
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter barcode"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Unique barcode for product scanning
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter SKU"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Stock Keeping Unit number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Featured Product</FormLabel>
                          <FormDescription>
                            Display this product in featured sections
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isNewArrival"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>New Arrival</FormLabel>
                          <FormDescription>
                            Mark this product as a new arrival
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images & Variants Tab */}
          <TabsContent value="images" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Add images for your product. At least one image is required.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image upload section */}
                <div className="flex flex-col space-y-4 mb-4">
                  <Label>Upload Product Images</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          multiple
                          className="hidden"
                          id="product-image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="w-full"
                        >
                          {uploadingImage ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          {uploadingImage ? "Uploading..." : "Upload Images"}
                        </Button>
                      </div>
                      <div>
                        <FormDescription className="mt-1">
                          Upload product images directly from your computer.
                          {uploadingImage && (
                            <span className="block mt-1 text-sm font-medium">
                              Uploading... {uploadProgress}%
                            </span>
                          )}
                        </FormDescription>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Or add by URL section */}
                <div className="flex items-end gap-2 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="image-url">Or Add by Image URL</Label>
                    <Input
                      id="image-url"
                      value={currentImage}
                      onChange={(e) => setCurrentImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddImage}
                    className="flex-shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {form.getValues("images")?.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => handleRemoveImage(image)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {form.formState.errors.images && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.images.message}
                  </p>
                )}

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Variants</h3>

                  {/* Colors section */}
                  <div className="space-y-2">
                    <Label>Colors</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={currentColor}
                        onChange={(e) => setCurrentColor(e.target.value)}
                        placeholder="E.g., Red, Blue, Black"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddColor}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.getValues("colors")?.map((color, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          <span>{color}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => handleRemoveColor(color)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sizes section */}
                  <div className="space-y-2 mt-4">
                    <Label>Sizes</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={currentSize}
                        onChange={(e) => setCurrentSize(e.target.value)}
                        placeholder="E.g., S, M, L, XL"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSize}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.getValues("sizes")?.map((size, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          <span>{size}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => handleRemoveSize(size)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;