import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Plus, RotateCcw, Filter, BarChart3 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Props interface
interface ImageManagerProps {
  initialView?: 'browse' | 'add' | 'categories' | 'statistics';
}

// Product interface
interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  discountPercentage: number;
  category: string;
  subcategory: string;
  material: string;
  colors: string[];
  sizes: string[];
  careInstructions: string;
  images: string[];
  inStoreAvailable: boolean;
  storeQuantity: number;
  quantity: number;
  featured: boolean;
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
  isNewArrival: boolean;
  brand?: string;
  brandType?: string;
  sku?: string;
  barcode?: string;
  discountEndDate?: string;
}

// Sample image URLs for different categories
const clothingImageUrls = [
  'https://images.unsplash.com/photo-1525450824786-227cbef70703',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
  'https://images.unsplash.com/photo-1581044777550-4cfa60707c03',
  'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0',
  'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd',
  'https://images.unsplash.com/photo-1542060748-10c28b62716f'
];

const bagsImageUrls = [
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
  'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d',
  'https://images.unsplash.com/photo-1595302269428-821b7b3a4b2a',
  'https://images.unsplash.com/photo-1600857062241-98c6c0fd6c32'
];

const jewelryImageUrls = [
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0',
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d',
  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9'
];

const accessoriesImageUrls = [
  'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75',
  'https://images.unsplash.com/photo-1618517047922-dc4dff5ae812',
  'https://images.unsplash.com/photo-1598532213005-6342e5ed7b30'
];

// Product templates
const productTemplates = {
  clothing: [
    {
      name: "Elegant Evening Dress",
      description: "A sophisticated evening dress perfect for formal occasions.",
      price: 249.99,
      discountPrice: 199.99,
      discountPercentage: 20,
      category: "women",
      subcategory: "clothing",
      material: "Silk",
      colors: ["Black", "Navy", "Burgundy"],
      sizes: ["XS", "S", "M", "L", "XL"],
      care_instructions: "Dry clean only",
      inStoreAvailable: true,
      storeQuantity: 15,
      quantity: 25,
      featured: true,
      rating: 4.8,
      review_count: 24,
      is_new_arrival: true
    }
  ],
  bags: [
    {
      name: "Classic Structured Tote",
      description: "A spacious and structured tote perfect for everyday use.",
      price: 189.99,
      discountPrice: 159.99,
      discountPercentage: 15,
      category: "bags",
      subcategory: "",
      material: "Genuine Leather",
      colors: ["Black", "Tan", "Navy"],
      sizes: ["One Size"],
      care_instructions: "Clean with leather conditioner",
      inStoreAvailable: true,
      storeQuantity: 12,
      quantity: 18,
      featured: true,
      rating: 4.7,
      review_count: 32,
      is_new_arrival: true
    }
  ],
  jewelry: [
    {
      name: "Diamond Pendant Necklace",
      description: "Elegant diamond pendant on a delicate gold chain.",
      price: 899.99,
      discountPrice: 799.99,
      discountPercentage: 11,
      category: "jewelry",
      subcategory: "",
      material: "18K Gold, Diamond",
      colors: ["Gold"],
      sizes: ["16 inch", "18 inch", "20 inch"],
      care_instructions: "Store in jewelry box, clean with professional jewelry cleaner",
      inStoreAvailable: true,
      storeQuantity: 5,
      quantity: 10,
      featured: true,
      rating: 4.9,
      review_count: 15,
      is_new_arrival: true
    }
  ],
  accessories: [
    {
      name: "Silk Square Scarf",
      description: "Luxurious silk scarf with artistic print.",
      price: 129.99,
      discountPrice: 99.99,
      discountPercentage: 23,
      category: "accessories",
      subcategory: "",
      material: "100% Silk",
      colors: ["Multicolor", "Blue/Gold", "Red/Black"],
      sizes: ["One Size"],
      care_instructions: "Dry clean only",
      inStoreAvailable: true,
      storeQuantity: 8,
      quantity: 15,
      featured: false,
      rating: 4.6,
      review_count: 12,
      is_new_arrival: true
    }
  ]
};

// Supported brands
const allBrands = [
  "Elegance",
  "Luxe Collection",
  "Milan Couture",
  "Parisian Chic",
  "Maison Luxe"
];

// Helper functions
const generateSKU = (brand: string, name: string): string => {
  const brandPrefix = brand.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const namePrefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${brandPrefix}-${namePrefix}-${randomNum}`;
};

const generateBarcode = (): string => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

const getImagesByCategoryAndSubcategory = (category: string, subcategory: string) => {
  if (category === 'women' && subcategory === 'clothing') {
    return clothingImageUrls;
  } else if (category === 'bags') {
    return bagsImageUrls;
  } else if (category === 'jewelry') {
    return jewelryImageUrls;
  } else if (category === 'accessories') {
    return accessoriesImageUrls;
  }
  // Default to clothing
  return clothingImageUrls;
};

// Main component
const ImageManager = ({ initialView = 'browse' }: ImageManagerProps) => {
  // State
  const [viewMode, setViewMode] = useState<'browse' | 'add' | 'categories' | 'statistics'>(initialView as any);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);
  const [step, setStep] = useState<'updating' | 'adding'>('updating');
  const [selectedCategory, setSelectedCategory] = useState('clothing');

  // Set initial state based on initialView prop
  useEffect(() => {
    setViewMode(initialView as any);
  }, [initialView]);

  // Helper function to get human-readable category name
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'clothing': return "Women's Clothing";
      case 'bags': return "Bags & Purses";
      case 'jewelry': return "Jewelry";
      case 'accessories': return "Accessories";
      default: return "Products";
    }
  };

  // Action: Update existing products with new images
  const updateExistingProducts = async () => {
    setIsLoading(true);
    setProgress(0);
    setStep('updating');
    setResult(null);
    
    try {
      // Get all products
      const response = await apiRequest('GET', '/api/products');
      const products = await response.json();
      
      // Filter products based on current category
      const filteredProducts = products.filter((product: Product) => {
        if (selectedCategory === 'clothing') {
          return product.category === 'women' && product.subcategory === 'clothing';
        }
        return product.category === selectedCategory;
      });
      
      let updatedCount = 0;
      
      // Update each product
      for (let i = 0; i < filteredProducts.length; i++) {
        const product = filteredProducts[i];
        
        // Get relevant images for this category
        const categoryImages = getImagesByCategoryAndSubcategory(
          product.category, 
          product.subcategory || ''
        );
        
        // Get a subset of images to add
        const numImages = Math.floor(Math.random() * 2) + 1; // 1-2 new images
        const shuffled = [...categoryImages].sort(() => 0.5 - Math.random());
        const newImages = shuffled.slice(0, numImages);
        
        // Update the product with new images
        await apiRequest('PATCH', `/api/products/${product.id}`, {
          images: [...(product.images || []), ...newImages]
        });
        
        updatedCount++;
        setProgress(Math.round((i + 1) / filteredProducts.length * 100));
      }
      
      const categoryName = getCategoryName(selectedCategory);
      
      setResult({
        success: true,
        message: `Successfully updated ${updatedCount} ${categoryName.toLowerCase()} products with new images.`,
        count: updatedCount
      });
    } catch (error: any) {
      console.error('Error updating products:', error);
      setResult({
        success: false,
        message: `Error updating products: ${error.message || 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Action: Add new products
  const addNewProducts = async () => {
    setIsLoading(true);
    setProgress(0);
    setStep('adding');
    setResult(null);
    
    try {
      // Get templates for the selected category
      const templates = productTemplates[selectedCategory as keyof typeof productTemplates];
      
      let addedCount = 0;
      const totalToAdd = templates.length * allBrands.length;
      let progressCount = 0;
      
      // For each brand, add new products of the selected category
      for (const brand of allBrands) {
        for (const template of templates) {
          // Create a new product from template
          const newProduct: any = {
            // Map from template 
            name: template.name,
            description: template.description,
            price: template.price,
            discountPrice: template.discountPrice,
            discountPercentage: template.discountPercentage,
            category: template.category,
            subcategory: template.subcategory,
            material: template.material,
            colors: template.colors,
            sizes: template.sizes,
            careInstructions: template.care_instructions, // Convert snake_case to camelCase
            inStoreAvailable: template.inStoreAvailable,
            storeQuantity: template.storeQuantity,
            quantity: template.quantity,
            featured: template.featured,
            rating: template.rating,
            reviewCount: template.review_count, // Convert snake_case to camelCase
            isNewArrival: template.is_new_arrival, // Convert snake_case to camelCase
            specifications: {},
            
            // Additional required fields
            brand,
            brandType: brand.toLowerCase().includes('luxury') ? 'luxury' : 'premium',
            sku: generateSKU(brand, template.name),
            barcode: generateBarcode(),
            images: [],
            inStock: true // Required by schema with a default value
          };
          
          // Get category-specific images
          const categoryImages = getImagesByCategoryAndSubcategory(
            newProduct.category, 
            newProduct.subcategory || ''
          );
          
          // Add images
          const numImages = Math.floor(Math.random() * 3) + 2; // 2-4 images
          const shuffled = [...categoryImages].sort(() => 0.5 - Math.random());
          newProduct.images = shuffled.slice(0, numImages);
          
          // Set discount end date - 30 days from now
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 30);
          newProduct.discountEndDate = futureDate.toISOString();
          
          try {
            // Add product
            const response = await apiRequest('POST', '/api/products', newProduct);
            await response.json();
            
            addedCount++;
            progressCount++;
            setProgress(Math.round(progressCount / totalToAdd * 100));
          } catch (error) {
            console.error('Failed to add product:', error);
            throw error;
          }
        }
      }
      
      const categoryName = getCategoryName(selectedCategory);
      
      setResult({
        success: true,
        message: `Successfully added ${addedCount} new ${categoryName.toLowerCase()} products across all brands.`,
        count: addedCount
      });
    } catch (error: any) {
      console.error('Error adding products:', error);
      setResult({
        success: false,
        message: `Error adding products: ${error.message || 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render Browse View
  const renderBrowseView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Browse Product Images</CardTitle>
        <CardDescription>View and browse images used in the product catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="clothing" onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="clothing">Women's Clothing</TabsTrigger>
            <TabsTrigger value="bags">Bags</TabsTrigger>
            <TabsTrigger value="jewelry">Jewelry</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clothing">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {clothingImageUrls.map((url, index) => (
                <div key={index} className="overflow-hidden rounded-md border">
                  <img 
                    src={url} 
                    alt={`Clothing item ${index + 1}`} 
                    className="h-[200px] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="bags">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {bagsImageUrls.map((url, index) => (
                <div key={index} className="overflow-hidden rounded-md border">
                  <img 
                    src={url} 
                    alt={`Bag item ${index + 1}`} 
                    className="h-[200px] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="jewelry">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {jewelryImageUrls.map((url, index) => (
                <div key={index} className="overflow-hidden rounded-md border">
                  <img 
                    src={url} 
                    alt={`Jewelry item ${index + 1}`} 
                    className="h-[200px] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="accessories">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {accessoriesImageUrls.map((url, index) => (
                <div key={index} className="overflow-hidden rounded-md border">
                  <img 
                    src={url} 
                    alt={`Accessory item ${index + 1}`} 
                    className="h-[200px] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  // Render Add View
  const renderAddView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Add Products & Images</CardTitle>
        <CardDescription>Add new products or update existing product images</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="clothing" onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="clothing">Women's Clothing</TabsTrigger>
            <TabsTrigger value="bags">Bags</TabsTrigger>
            <TabsTrigger value="jewelry">Jewelry</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>
          
          {isLoading && (
            <div className="space-y-4 px-6 py-4 border rounded-md">
              <p className="text-center font-medium">
                {step === 'updating' 
                  ? `Updating existing ${getCategoryName(selectedCategory).toLowerCase()}...` 
                  : `Adding new ${getCategoryName(selectedCategory).toLowerCase()}...`}
              </p>
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-muted-foreground">
                {progress}% complete
              </p>
            </div>
          )}
          
          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
          
          <div className="mt-6 flex gap-4">
            <Button 
              onClick={updateExistingProducts} 
              variant="outline" 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Update Existing
            </Button>
            <Button 
              onClick={addNewProducts} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add New Products
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );

  // Render Categories View
  const renderCategoriesView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Category Management</CardTitle>
        <CardDescription>Organize and manage product categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Filter className="h-5 w-5 mr-2" /> Women's Clothing
            </h3>
            <p className="text-muted-foreground mb-4">Manage women's clothing categories and subcategories</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2 border rounded-md text-center">Dresses</div>
              <div className="p-2 border rounded-md text-center">Tops</div>
              <div className="p-2 border rounded-md text-center">Bottoms</div>
              <div className="p-2 border rounded-md text-center">Outerwear</div>
              <div className="p-2 border rounded-md text-center">Activewear</div>
              <div className="p-2 border rounded-md text-center">Formal</div>
            </div>
          </div>
          
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Filter className="h-5 w-5 mr-2" /> Bags & Purses
            </h3>
            <p className="text-muted-foreground mb-4">Manage bag categories and styles</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2 border rounded-md text-center">Totes</div>
              <div className="p-2 border rounded-md text-center">Clutches</div>
              <div className="p-2 border rounded-md text-center">Crossbody</div>
              <div className="p-2 border rounded-md text-center">Shoulder Bags</div>
              <div className="p-2 border rounded-md text-center">Backpacks</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render Statistics View
  const renderStatisticsView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Image Statistics</CardTitle>
        <CardDescription>Analytics on product image usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{clothingImageUrls.length}</div>
                <p className="text-sm text-muted-foreground">Women's Clothing Images</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{bagsImageUrls.length}</div>
                <p className="text-sm text-muted-foreground">Bags & Purses Images</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{jewelryImageUrls.length + accessoriesImageUrls.length}</div>
                <p className="text-sm text-muted-foreground">Jewelry & Accessories Images</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" /> Image Usage by Category
            </h3>
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Women's Clothing</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(clothingImageUrls.length / (clothingImageUrls.length + bagsImageUrls.length + jewelryImageUrls.length + accessoriesImageUrls.length) * 100)}%
                  </span>
                </div>
                <Progress value={clothingImageUrls.length / (clothingImageUrls.length + bagsImageUrls.length + jewelryImageUrls.length + accessoriesImageUrls.length) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Bags & Purses</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(bagsImageUrls.length / (clothingImageUrls.length + bagsImageUrls.length + jewelryImageUrls.length + accessoriesImageUrls.length) * 100)}%
                  </span>
                </div>
                <Progress value={bagsImageUrls.length / (clothingImageUrls.length + bagsImageUrls.length + jewelryImageUrls.length + accessoriesImageUrls.length) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // View mode selector
  const renderViewSelector = () => (
    <div className="mb-6">
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="browse" className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Browse
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-1">
            <Filter className="h-4 w-4" /> Categories
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" /> Statistics
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );

  // Main render
  return (
    <div className="w-full space-y-6">
      {renderViewSelector()}
      
      {viewMode === 'browse' && renderBrowseView()}
      {viewMode === 'add' && renderAddView()}
      {viewMode === 'categories' && renderCategoriesView()}
      {viewMode === 'statistics' && renderStatisticsView()}
    </div>
  );
};

export default ImageManager;