import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define Product interface
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
  care_instructions: string;
  images: string[];
  inStoreAvailable: boolean;
  storeQuantity: number;
  quantity: number;
  featured: boolean;
  rating: number;
  review_count: number;
  specifications: Record<string, string>;
  is_new_arrival: boolean;
  brand?: string;
  brandType?: string;
  sku?: string;
  barcode?: string;
  discountEndDate?: Date;
}

// Define a type for our custom product with extended fields
interface CustomProduct extends Product {
  brand: string;
  brandType: string;
  sku: string;
  barcode: string;
  discountEndDate: Date;
}

// More modern, fashion-focused placeholder images categorized by product type

// Women's clothing images
const clothingImageUrls = [
  "https://placehold.co/800x1100/f8f0e3/3d3d3d?text=Elegant+Dress",
  "https://placehold.co/800x1100/f5f5f5/3d3d3d?text=Designer+Blouse",
  "https://placehold.co/800x1100/e8e8e8/3d3d3d?text=Luxury+Skirt",
  "https://placehold.co/800x1100/f0e6e6/3d3d3d?text=Premium+Coat",
  "https://placehold.co/800x1100/e0e8e8/3d3d3d?text=Silk+Shirt",
  "https://placehold.co/800x1100/f8e0e0/3d3d3d?text=Evening+Gown",
  "https://placehold.co/800x1100/e0f0e0/3d3d3d?text=Cashmere+Sweater",
  "https://placehold.co/800x1100/e6e0f0/3d3d3d?text=Tailored+Pants",
  "https://placehold.co/800x1100/fff0d8/3d3d3d?text=Designer+Jacket",
  "https://placehold.co/800x1100/f0f0ff/3d3d3d?text=Silk+Blouse",
  "https://placehold.co/800x1100/fff0f0/3d3d3d?text=Formal+Jumpsuit",
  "https://placehold.co/800x1100/f0fff0/3d3d3d?text=Luxury+Cardigan",
  "https://placehold.co/800x1100/f0f8ff/3d3d3d?text=Pencil+Skirt",
  "https://placehold.co/800x1100/fff8f0/3d3d3d?text=Cotton+Tshirt",
  "https://placehold.co/800x1100/f8f8f8/3d3d3d?text=Designer+Jeans"
];

// Bags & purses images
const bagImageUrls = [
  "https://placehold.co/800x800/f8f0e3/3d3d3d?text=Leather+Tote",
  "https://placehold.co/800x800/f5f5f5/3d3d3d?text=Designer+Handbag",
  "https://placehold.co/800x800/e8e8e8/3d3d3d?text=Luxury+Purse",
  "https://placehold.co/800x800/f0e6e6/3d3d3d?text=Evening+Clutch",
  "https://placehold.co/800x800/e0e8e8/3d3d3d?text=Crossbody+Bag",
  "https://placehold.co/800x800/f8e0e0/3d3d3d?text=Shoulder+Bag",
  "https://placehold.co/800x800/e0f0e0/3d3d3d?text=Woven+Tote",
  "https://placehold.co/800x800/e6e0f0/3d3d3d?text=Bucket+Bag",
  "https://placehold.co/800x800/fff0d8/3d3d3d?text=Satchel+Bag",
  "https://placehold.co/800x800/f0f0ff/3d3d3d?text=Mini+Bag",
  "https://placehold.co/800x800/fff0f0/3d3d3d?text=Structured+Tote",
  "https://placehold.co/800x800/f0fff0/3d3d3d?text=Backpack+Purse"
];

// Jewelry images
const jewelryImageUrls = [
  "https://placehold.co/800x800/f8f0e3/3d3d3d?text=Diamond+Necklace",
  "https://placehold.co/800x800/f5f5f5/3d3d3d?text=Gold+Bracelet",
  "https://placehold.co/800x800/e8e8e8/3d3d3d?text=Pearl+Earrings",
  "https://placehold.co/800x800/f0e6e6/3d3d3d?text=Silver+Ring",
  "https://placehold.co/800x800/e0e8e8/3d3d3d?text=Gemstone+Pendant",
  "https://placehold.co/800x800/f8e0e0/3d3d3d?text=Luxury+Watch",
  "https://placehold.co/800x800/e0f0e0/3d3d3d?text=Diamond+Ring",
  "https://placehold.co/800x800/e6e0f0/3d3d3d?text=Gold+Hoop+Earrings",
  "https://placehold.co/800x800/fff0d8/3d3d3d?text=Emerald+Necklace",
  "https://placehold.co/800x800/f0f0ff/3d3d3d?text=Pearl+Bracelet",
  "https://placehold.co/800x800/fff0f0/3d3d3d?text=Diamond+Studs",
  "https://placehold.co/800x800/f0fff0/3d3d3d?text=Sapphire+Ring"
];

// Accessories images
const accessoryImageUrls = [
  "https://placehold.co/800x800/f8f0e3/3d3d3d?text=Silk+Scarf",
  "https://placehold.co/800x800/f5f5f5/3d3d3d?text=Designer+Sunglasses",
  "https://placehold.co/800x800/e8e8e8/3d3d3d?text=Leather+Belt",
  "https://placehold.co/800x800/f0e6e6/3d3d3d?text=Cashmere+Gloves",
  "https://placehold.co/800x800/e0e8e8/3d3d3d?text=Luxury+Hat",
  "https://placehold.co/800x800/f8e0e0/3d3d3d?text=Designer+Wallet",
  "https://placehold.co/800x800/e0f0e0/3d3d3d?text=Hair+Accessory",
  "https://placehold.co/800x800/e6e0f0/3d3d3d?text=Silk+Tie",
  "https://placehold.co/800x800/fff0d8/3d3d3d?text=Woven+Hat",
  "https://placehold.co/800x800/f0f0ff/3d3d3d?text=Leather+Gloves",
  "https://placehold.co/800x800/fff0f0/3d3d3d?text=Designer+Keychain",
  "https://placehold.co/800x800/f0fff0/3d3d3d?text=Premium+Watch"
];

// Additional product angles and views
const productViewImageUrls = [
  "https://placehold.co/800x800/f8f0e3/3d3d3d?text=Front+View",
  "https://placehold.co/800x800/f5f5f5/3d3d3d?text=Back+View",
  "https://placehold.co/800x800/e8e8e8/3d3d3d?text=Side+View",
  "https://placehold.co/800x800/f0e6e6/3d3d3d?text=Detail+View",
  "https://placehold.co/800x800/e0e8e8/3d3d3d?text=Material+Detail",
  "https://placehold.co/800x800/f8e0e0/3d3d3d?text=Close+Up",
  "https://placehold.co/800x800/111111/ffffff?text=Luxury+Brand",
  "https://placehold.co/800x800/f8f0e3/111111?text=Designer+Collection",
  "https://placehold.co/800x800/000080/ffffff?text=Classic+Luxury",
  "https://placehold.co/800x800/4b0082/ffffff?text=Haute+Couture"
];

// Combine all image URLs into one array for backwards compatibility
const reliableImageUrls = [
  ...clothingImageUrls,
  ...bagImageUrls,
  ...jewelryImageUrls,
  ...accessoryImageUrls,
  ...productViewImageUrls
];

// Additional product templates by category
// Women's clothing items
const additionalWomenClothingProducts = [
  {
    name: "Silk Evening Gown",
    description: "Exquisite silk evening gown with delicate detailing and a flowing silhouette. Perfect for formal occasions and red carpet events.",
    price: 189500,
    discountPrice: 170550,
    discountPercentage: 10,
    category: "women",
    subcategory: "clothing",
    material: "100% Silk",
    colors: ["Black", "Burgundy", "Navy", "Emerald"],
    sizes: ["XS", "S", "M", "L", "XL"],
    care_instructions: "Dry clean only. Store on padded hanger.",
    images: [], // Will be filled with random images
    inStoreAvailable: true,
    storeQuantity: 8,
    quantity: 15,
    featured: true,
    rating: 4.8,
    review_count: 32,
    specifications: {
      "Material": "100% Silk",
      "Care": "Dry clean only",
      "Origin": "Italy",
      "Season": "All Season"
    },
    is_new_arrival: true
  },
  {
    name: "Designer Tailored Blazer",
    description: "Precision-cut blazer crafted from premium wool blend with satin lining. Versatile style for both professional and evening wear.",
    price: 145000,
    discountPrice: 123250,
    discountPercentage: 15,
    category: "women",
    subcategory: "clothing",
    material: "Wool Blend",
    colors: ["Black", "White", "Camel", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL"],
    care_instructions: "Dry clean only. Keep buttoned when hanging.",
    images: [], // Will be filled with random images
    inStoreAvailable: true,
    storeQuantity: 12,
    quantity: 25,
    featured: false,
    rating: 4.7,
    review_count: 28,
    specifications: {
      "Material": "Wool Blend",
      "Care": "Dry clean only",
      "Origin": "UK",
      "Season": "Fall/Winter"
    },
    is_new_arrival: false
  }
];

// Bag products
const additionalBagProducts = [
  {
    name: "Leather Structured Tote",
    description: "Handcrafted structured tote in premium leather with gold-tone hardware and suede interior. Features multiple compartments and a detachable shoulder strap.",
    price: 245000,
    discountPrice: 220500,
    discountPercentage: 10,
    category: "bags",
    subcategory: "totes",
    material: "Full-grain Leather",
    colors: ["Black", "Tan", "Navy", "Burgundy"],
    sizes: ["One Size"],
    care_instructions: "Treat with leather conditioner. Store with dust bag.",
    images: [], // Will be filled with random images
    inStoreAvailable: true,
    storeQuantity: 10,
    quantity: 20,
    featured: true,
    rating: 4.9,
    review_count: 36,
    specifications: {
      "Material": "Full-grain Leather",
      "Dimensions": "30cm x 40cm x 15cm",
      "Hardware": "Gold-tone",
      "Origin": "Italy"
    },
    is_new_arrival: true
  },
  {
    name: "Quilted Chain Shoulder Bag",
    description: "Iconic quilted lambskin shoulder bag with signature chain strap and twist lock closure. Timeless design that transitions from day to evening.",
    price: 320000,
    discountPrice: 288000,
    discountPercentage: 10,
    category: "bags",
    subcategory: "shoulder",
    material: "Lambskin",
    colors: ["Black", "Beige", "Red", "Blue"],
    sizes: ["One Size"],
    care_instructions: "Avoid exposure to direct sunlight and water. Store in dust bag.",
    images: [], // Will be filled with random images
    inStoreAvailable: true,
    storeQuantity: 8,
    quantity: 15,
    featured: true,
    rating: 4.8,
    review_count: 42,
    specifications: {
      "Material": "Lambskin",
      "Dimensions": "25cm x 15cm x 7cm",
      "Chain Drop": "55cm",
      "Origin": "France"
    },
    is_new_arrival: true
  }
];

// Jewelry products
const additionalJewelryProducts = [
  {
    name: "Diamond Tennis Bracelet",
    description: "Exquisite tennis bracelet featuring 3 carats of round brilliant diamonds set in 18k white gold. Secure box clasp with safety latch.",
    price: 850000,
    discountPrice: 765000,
    discountPercentage: 10,
    category: "jewelry",
    subcategory: "bracelets",
    material: "18k White Gold, Diamonds",
    colors: ["White Gold"],
    sizes: ["7 inches"],
    care_instructions: "Clean with gentle jewelry cleaner. Store in jewelry box.",
    images: [], // Will be filled with random images
    inStoreAvailable: true,
    storeQuantity: 5,
    quantity: 10,
    featured: true,
    rating: 5.0,
    review_count: 18,
    specifications: {
      "Metal": "18k White Gold",
      "Diamonds": "3 ct total weight",
      "Clarity": "VS",
      "Color": "F-G"
    },
    is_new_arrival: true
  },
  {
    name: "Pearl Strand Necklace",
    description: "Classic strand of Akoya cultured pearls with 18k gold clasp. Each pearl hand-selected for superior luster and matching.",
    price: 420000,
    discountPrice: 378000,
    discountPercentage: 10,
    category: "jewelry",
    subcategory: "necklaces",
    material: "Akoya Pearls, 18k Gold",
    colors: ["White/Gold"],
    sizes: ["18 inches"],
    care_instructions: "Wipe with soft cloth after wearing. Store flat.",
    images: [], // Will be filled with random images
    inStoreAvailable: true,
    storeQuantity: 6,
    quantity: 12,
    featured: true,
    rating: 4.9,
    review_count: 24,
    specifications: {
      "Pearl Type": "Akoya Cultured",
      "Pearl Size": "7-7.5mm",
      "Clasp": "18k Gold",
      "Origin": "Japan"
    },
    is_new_arrival: false
  }
];

// Accessories products
const additionalAccessoryProducts = [
  {
    name: "Cashmere Wrap Scarf",
    description: "Luxuriously soft oversized cashmere wrap scarf. Lightweight yet warm with hand-rolled edges.",
    price: 89500,
    discountPrice: 76075,
    discountPercentage: 15,
    category: "accessories",
    subcategory: "scarves",
    material: "100% Cashmere",
    colors: ["Camel", "Gray", "Black", "Burgundy"],
    sizes: ["One Size"],
    care_instructions: "Dry clean only or hand wash cold. Reshape and lay flat to dry.",
    images: [], // Will be filled with random images
    inStoreAvailable: true,
    storeQuantity: 15,
    quantity: 25,
    featured: true,
    rating: 4.8,
    review_count: 32,
    specifications: {
      "Material": "100% Cashmere",
      "Dimensions": "200cm x 75cm",
      "Weight": "Light",
      "Origin": "Scotland"
    },
    is_new_arrival: true
  },
  {
    name: "Designer Sunglasses",
    description: "Iconic designer sunglasses with polarized lenses and acetate frame. Includes leather case and cleaning cloth.",
    price: 128000,
    discountPrice: 115200,
    discountPercentage: 10,
    category: "accessories",
    subcategory: "eyewear",
    material: "Acetate, Metal",
    colors: ["Black", "Tortoise", "Havana"],
    sizes: ["One Size"],
    care_instructions: "Clean with provided cloth. Store in case when not in use.",
    images: [], // Will be filled with random images
    inStoreAvailable: true,
    storeQuantity: 12,
    quantity: 20,
    featured: true,
    rating: 4.7,
    review_count: 28,
    specifications: {
      "Frame": "Acetate",
      "Lens": "Polarized",
      "UV Protection": "100%",
      "Origin": "Italy"
    },
    is_new_arrival: false
  }
];

// Combine all product templates for backward compatibility
const additionalWomenProducts = [...additionalWomenClothingProducts];

// All available brands
const allBrands = [
  "Luxury Brand",
  "Designer Collection",
  "Classic Luxury",
  "Modern Luxury",
  "Haute Couture",
  "Eleganza",
  "Milano",
  "Savile Row",
  "Parisian Chic",
  "Maison Luxe"
];

// Function to get a random subset of images
function getRandomImages() {
  // Get 3-5 random images from the reliableImageUrls array
  const numImages = Math.floor(Math.random() * 3) + 3; // 3 to 5 images
  const shuffled = [...reliableImageUrls].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numImages);
}

// Function to generate product SKU
function generateSKU(brand: string, name: string): string {
  const brandPrefix = brand.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const namePrefix = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${brandPrefix}-${namePrefix}-${randomNum}`;
}

// Function to generate product barcode
function generateBarcode() {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

// Helper function to get the appropriate image array based on category
function getImagesByCategoryAndSubcategory(category: string, subcategory: string) {
  if (category === 'women' && subcategory === 'clothing') {
    return clothingImageUrls;
  } else if (category === 'bags') {
    return bagImageUrls;
  } else if (category === 'jewelry') {
    return jewelryImageUrls;
  } else if (category === 'accessories') {
    return accessoryImageUrls;
  }
  return reliableImageUrls; // Fallback to all images
}

const ProductImageManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; message: string; count: number } | null>(null);
  const [step, setStep] = useState<'updating' | 'adding'>('updating');
  const [selectedCategory, setSelectedCategory] = useState('clothing');
  
  // Function to get the product templates based on selected category
  const getProductTemplatesByCategory = (category: string) => {
    switch (category) {
      case 'clothing':
        return additionalWomenClothingProducts;
      case 'bags':
        return additionalBagProducts;
      case 'jewelry':
        return additionalJewelryProducts;
      case 'accessories':
        return additionalAccessoryProducts;
      default:
        return additionalWomenClothingProducts;
    }
  };
  
  // Function to get the category and subcategory filter based on tab selection
  const getCategoryFilter = (category: string): { category: string; subcategory: string } => {
    switch (category) {
      case 'clothing':
        return { category: 'women', subcategory: 'clothing' };
      case 'bags':
        return { category: 'bags', subcategory: '' };
      case 'jewelry':
        return { category: 'jewelry', subcategory: '' };
      case 'accessories':
        return { category: 'accessories', subcategory: '' };
      default:
        return { category: 'women', subcategory: 'clothing' };
    }
  };
  
  // Get human-readable category name
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'clothing':
        return "Women's Clothing";
      case 'bags':
        return "Bags & Purses";
      case 'jewelry':
        return "Jewelry";
      case 'accessories':
        return "Accessories";
      default:
        return "Products";
    }
  };

  const updateExistingProducts = async () => {
    setIsLoading(true);
    setProgress(0);
    setStep('updating');
    setResult(null);
    
    try {
      // Get all products
      const response = await apiRequest('GET', '/api/products');
      const products = await response.json();
      
      // Get the filter for the current category
      const filter = getCategoryFilter(selectedCategory);
      
      // Filter products based on current category
      const filteredProducts = products.filter((product: Product) => {
        if (filter.subcategory) {
          return product.category === filter.category && product.subcategory === filter.subcategory;
        }
        return product.category === filter.category;
      });
      
      let updatedCount = 0;
      
      // Update each product
      for (let i = 0; i < filteredProducts.length; i++) {
        const product = filteredProducts[i];
        
        // Get relevant images for this category
        const categoryImages = getImagesByCategoryAndSubcategory(product.category, product.subcategory || '');
        
        // Create a mixed array of category-specific and general product views
        const imagePool = [...categoryImages, ...productViewImageUrls];
        const numImages = Math.floor(Math.random() * 3) + 3; // 3 to 5 images
        const shuffled = [...imagePool].sort(() => 0.5 - Math.random());
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
        message: `Error updating products: ${error.message || 'Unknown error'}`,
        count: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNewProducts = async () => {
    setIsLoading(true);
    setProgress(0);
    setStep('adding');
    setResult(null);
    
    try {
      // Get templates for the selected category
      const productTemplates = getProductTemplatesByCategory(selectedCategory);
      
      let addedCount = 0;
      const totalToAdd = productTemplates.length * allBrands.length;
      let progressCount = 0;
      
      // For each brand, add new products of the selected category
      for (const brand of allBrands) {
        for (const productTemplate of productTemplates) {
          // Create a copy of the template to customize
          const newProduct = { ...productTemplate } as CustomProduct;
          
          // Set unique fields
          newProduct.brand = brand;
          newProduct.brandType = brand.toLowerCase().includes('luxury') ? 'luxury' : 'premium';
          newProduct.sku = generateSKU(brand, newProduct.name);
          newProduct.barcode = generateBarcode();
          
          // Get category-specific images
          const categoryImages = getImagesByCategoryAndSubcategory(
            newProduct.category, 
            newProduct.subcategory || ''
          );
          
          // Create a mixed array of category-specific and general product views
          const imagePool = [...categoryImages, ...productViewImageUrls];
          const numImages = Math.floor(Math.random() * 3) + 3; // 3 to 5 images
          const shuffled = [...imagePool].sort(() => 0.5 - Math.random());
          newProduct.images = shuffled.slice(0, numImages);
          
          // Slightly randomize price if needed
          const priceAdjustment = (Math.random() * 0.2) - 0.1; // -10% to +10%
          newProduct.price = Math.round(newProduct.price * (1 + priceAdjustment));
          newProduct.discountPrice = Math.round(newProduct.price * (1 - (newProduct.discountPercentage / 100)));
          
          // Set discount end date
          newProduct.discountEndDate = new Date(Date.now() + (Math.floor(Math.random() * 30) + 5) * 24 * 60 * 60 * 1000); // 5-35 days from now
          
          // Add product
          await apiRequest('POST', '/api/products', newProduct);
          
          addedCount++;
          progressCount++;
          setProgress(Math.round(progressCount / totalToAdd * 100));
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
        message: `Error adding products: ${error.message || 'Unknown error'}`,
        count: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Product Images Manager</CardTitle>
        <CardDescription>
          Update existing products with new images or add new products across all brands
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="clothing" onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-4">
          <TabsTrigger value="clothing">Women's Clothing</TabsTrigger>
          <TabsTrigger value="bags">Bags & Purses</TabsTrigger>
          <TabsTrigger value="jewelry">Jewelry</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clothing" className="mt-0">
          <CardContent className="pt-0">
            {isLoading && (
              <div className="space-y-4">
                <p className="text-center font-medium">
                  {step === 'updating' ? 'Updating existing women\'s clothing...' : 'Adding new women\'s clothing...'}
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
          </CardContent>
        </TabsContent>
        
        <TabsContent value="bags" className="mt-0">
          <CardContent className="pt-0">
            {isLoading && (
              <div className="space-y-4">
                <p className="text-center font-medium">
                  {step === 'updating' ? 'Updating existing bags & purses...' : 'Adding new bags & purses...'}
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
          </CardContent>
        </TabsContent>
        
        <TabsContent value="jewelry" className="mt-0">
          <CardContent className="pt-0">
            {isLoading && (
              <div className="space-y-4">
                <p className="text-center font-medium">
                  {step === 'updating' ? 'Updating existing jewelry...' : 'Adding new jewelry...'}
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
          </CardContent>
        </TabsContent>
        
        <TabsContent value="accessories" className="mt-0">
          <CardContent className="pt-0">
            {isLoading && (
              <div className="space-y-4">
                <p className="text-center font-medium">
                  {step === 'updating' ? 'Updating existing accessories...' : 'Adding new accessories...'}
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
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between mt-4">
        <Button 
          onClick={updateExistingProducts} 
          variant="outline" 
          disabled={isLoading}
        >
          Update Existing Products
        </Button>
        <Button 
          onClick={addNewProducts} 
          disabled={isLoading}
        >
          Add New Products
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductImageManager;