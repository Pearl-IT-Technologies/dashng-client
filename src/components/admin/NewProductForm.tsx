import React, { useState, useRef, useEffect, memo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X, ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AnimatedButton } from "@/components/ui/animated-feedback";

interface FormData {
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  discountPrice: number;
  quantity: number;
  storeQuantity: number;
  sku: string;
  barcode: string;
  images: File[];
}

interface NewProductFormProps {
  onSuccess: (product: any) => void;
  onCancel: () => void;
}

// Create memo-wrapped form component to prevent unnecessary re-renders
const NewProductForm = memo(({ onSuccess, onCancel }: NewProductFormProps) => {
  const { toast } = useToast();
  
  // Local form state - completely independent from parent component
  const [formData, setFormData] = useState<FormData>({
    name: '',
    brand: '',
    category: '',
    subcategory: '',
    description: '',
    price: 0,
    discountPrice: 0,
    quantity: 0,
    storeQuantity: 0,
    sku: '',
    barcode: '',
    images: []
  });
  
  // Temporary values for character counting and validation feedback
  const [descriptionLength, setDescriptionLength] = useState(0);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // Input references for direct DOM manipulation if needed
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  
  // Form change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // For number inputs, convert string to number
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Update character count for description
    if (name === 'description') {
      setDescriptionLength(value.length);
    }
  };
  
  // Select change handler (for React components)
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Generate random SKU based on product info
  const generateSKU = () => {
    const brandPrefix = formData.brand.substring(0, 3).toUpperCase() || 'BRD';
    const namePrefix = formData.name.substring(0, 3).toUpperCase() || 'PRD';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    const newSku = `${brandPrefix}-${namePrefix}-${random}`;
    setFormData(prev => ({ ...prev, sku: newSku }));
  };
  
  // Generate random barcode
  const generateBarcode = () => {
    const newBarcode = `DASH${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;
    setFormData(prev => ({ ...prev, barcode: newBarcode }));
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Create array from FileList
    const newFiles = Array.from(files);
    
    // Create previews
    const newImagePreviews = [...imagePreviews];
    newFiles.forEach(file => {
      newImagePreviews.push(URL.createObjectURL(file));
    });
    
    // Update state
    setImagePreviews(newImagePreviews);
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, ...newFiles]
    }));
  };
  
  // Remove image
  const removeImage = (index: number) => {
    // Remove preview
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
    
    // Remove from form data
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
  };
  
  // Form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Missing product name",
        description: "Please enter a product name",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.brand.trim()) {
      toast({
        title: "Missing brand",
        description: "Please enter a brand name",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.category) {
      toast({
        title: "Missing category",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.price <= 0) {
      toast({
        title: "Invalid price",
        description: "Price must be greater than 0",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for image upload
      const productFormData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          productFormData.append(key, String(value));
        }
      });
      
      // Add images
      formData.images.forEach(image => {
        productFormData.append('images', image);
      });
      
      // Send the request
      const response = await fetch('/api/products', {
        method: 'POST',
        body: productFormData
      });
      
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      
      const result = await response.json();
      
      toast({
        title: "Product created",
        description: "The product has been successfully created"
      });
      
      // Call success callback with the result
      onSuccess(result);
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Failed to create product",
        description: (error as Error).message || "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Clean up image previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, []);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Essential fields section */}
      <div className="border rounded-md p-4 bg-muted/5">
        <h3 className="text-sm font-medium mb-3">Essential Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-right">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Clear, descriptive name that customers will see
            </p>
          </div>
        </div>
      </div>
      
      {/* Categorization section */}
      <div className="border rounded-md p-4 bg-muted/5">
        <h3 className="text-sm font-medium mb-3">Categorization</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="brand" className="text-right">
              Brand <span className="text-red-500">*</span>
            </Label>
            <Input
              id="brand"
              name="brand"
              placeholder="Enter brand name"
              value={formData.brand}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        
          <div>
            <Label htmlFor="category" className="text-right">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="bags">Bags</SelectItem>
                <SelectItem value="jewelry">Jewelry</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        
          <div>
            <Label htmlFor="subcategory" className="text-right">
              Subcategory <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subcategory"
              name="subcategory"
              placeholder="E.g. Dresses, Shoes, Watches"
              value={formData.subcategory}
              onChange={handleChange}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Specific type of item within the category
            </p>
          </div>
        </div>
      </div>
      
      {/* Description section */}
      <div className="border rounded-md p-4 bg-muted/5">
        <h3 className="text-sm font-medium mb-3">Description</h3>
        <div>
          <Label htmlFor="description" className="text-right">
            Product Description <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              ref={descriptionRef}
              placeholder="A short description of the product"
              value={formData.description}
              onChange={handleChange}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 mt-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={2}
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground opacity-80">
              <span className={descriptionLength < 10 ? "text-rose-500" : "text-green-500"}>
                {descriptionLength}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            A brief description is adequate (minimum 10 characters)
          </p>
        </div>
      </div>
      
      {/* Images section */}
      <div className="border rounded-md p-4 bg-muted/5">
        <h3 className="text-sm font-medium mb-3">Product Images</h3>
        <div>
          <div className="flex flex-wrap gap-3 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-20 h-20 overflow-hidden rounded border">
                <img 
                  src={preview} 
                  alt={`Preview ${index+1}`} 
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {imagePreviews.length < 5 && (
              <label className="flex flex-col items-center justify-center w-20 h-20 rounded border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple={imagePreviews.length === 0}
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Images optional. You can add them later.
          </p>
        </div>
      </div>
      
      {/* Pricing section */}
      <div className="border rounded-md p-4 bg-muted/5">
        <h3 className="text-sm font-medium mb-3">Pricing</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="price" className="text-right">
              Price (₦) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="Enter price in Naira"
              value={formData.price === 0 ? '' : formData.price}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        
          <div>
            <Label htmlFor="discountPrice" className="text-right">
              Discount Price (₦)
            </Label>
            <Input
              id="discountPrice"
              name="discountPrice"
              type="number"
              placeholder="Enter discount price if applicable"
              value={formData.discountPrice === 0 ? '' : formData.discountPrice}
              onChange={handleChange}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty if not on sale
            </p>
          </div>
        </div>
      </div>
      
      {/* Inventory section */}
      <div className="border rounded-md p-4 bg-muted/5">
        <h3 className="text-sm font-medium mb-3">Inventory Management</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity" className="text-right">
              Warehouse Quantity
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              placeholder="0"
              value={formData.quantity === 0 ? '' : formData.quantity}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        
          <div>
            <Label htmlFor="storeQuantity" className="text-right">
              Store Quantity
            </Label>
            <Input
              id="storeQuantity"
              name="storeQuantity"
              type="number"
              placeholder="0"
              value={formData.storeQuantity === 0 ? '' : formData.storeQuantity}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
      </div>
      
      {/* Reference codes section */}
      <div className="border rounded-md p-4 bg-muted/5">
        <h3 className="text-sm font-medium mb-3">Reference Codes (Optional)</h3>
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="sku" className="text-right">
                SKU
              </Label>
              <Input
                id="sku"
                name="sku"
                placeholder="Auto-generated if empty"
                value={formData.sku}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={generateSKU}
              className="mb-[0.1rem]"
            >
              Generate
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-[-0.5rem]">
            Stock Keeping Unit code for internal reference
          </p>
        
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="barcode" className="text-right">
                Barcode
              </Label>
              <Input
                id="barcode"
                name="barcode"
                placeholder="Auto-generated if empty"
                value={formData.barcode}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={generateBarcode}
              className="mb-[0.1rem]"
            >
              Generate
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-[-0.5rem]">
            Used for inventory scanning
          </p>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button
          onClick={onCancel} 
          disabled={isSubmitting}
          variant="outline"
          className="bg-transparent border border-input hover:bg-accent"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Product
        </Button>
      </div>
    </form>
  );
});

// Display name for React DevTools
NewProductForm.displayName = 'NewProductForm';

export default NewProductForm;