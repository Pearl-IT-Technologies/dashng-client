import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
import NewProductForm from '@/components/admin/NewProductForm';
import InventoryTrendInsights from '@/components/inventory/InventoryTrendInsights';
import BarcodeManager from '@/components/admin/BarcodeManager';
import BarcodeScanner from '@/components/admin/BarcodeScanner';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Search,
  Filter,
  Plus,
  RefreshCw,
  ArrowUpDown,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Upload,
  Image as ImageIcon,
  Package,
  X,
  FileText,
  MoreHorizontal,
  Barcode,
  ScanLine,
  Tag,
  QrCode
} from 'lucide-react';
import { 
  Button,
  buttonVariants
} from '@/components/ui/button';
import { AnimatedButton, AnimatedCard, AnimatedListItem, useClickAnimation, ClickAnimation } from '@/components/ui/animated-feedback';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { AnimationWrapper } from '@/components/ui/animated-feedback';

// Define product interface
interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  discountPrice: number;
  quantity: number;
  storeQuantity: number;
  sku: string;
  barcode: string;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  description?: string; // Optional product description field
}

// Inventory management component
const AdminInventory = () => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);
  const [currentTab, setCurrentTab] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [addStockDialogOpen, setAddStockDialogOpen] = useState(false);
  const [productDetailsDialogOpen, setProductDetailsDialogOpen] = useState(false);
  const [newProductDialogOpen, setNewProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockToAdd, setStockToAdd] = useState(0);
  const [stockLocation, setStockLocation] = useState<'store' | 'warehouse'>('store');
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [activeView, setActiveView] = useState<'products' | 'barcodes' | 'scanner'>('products');
  
  // Input values for search field
  const [inputValues, setInputValues] = useState({
    search: ''
  });
  
  // Debounce handler for search input with proper cleanup
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounced search update function
  const updateSearchDebounced = useCallback((value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
  }, []);
  
  // Clean up timeouts on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);
  
  // Initialize search field
  useEffect(() => {
    setInputValues(prev => ({
      ...prev,
      search: searchQuery
    }));
  }, []);
  
  // Get the current user role
  const userRole = (): 'admin' | 'manager' | 'storekeeper' | 'sales' => {
    if (!user) return 'sales'; // Default fallback
    
    if (user.username === 'owner') return 'admin';
    if (user.username.startsWith('storekeeper')) return 'storekeeper';
    if (user.username.startsWith('salesperson')) return 'sales';
    if (user.username.startsWith('manager')) return 'manager';
    
    // Check if user has admin role but is not the owner
    if (user.isAdmin && user.username !== 'owner') return 'manager';
    
    // Fallback for other cases
    return 'sales';
  };
  
  const role = userRole();
  
  // Check if user can edit inventory
  const canEditInventory = ['admin', 'manager', 'storekeeper'].includes(role);
  
  // Hard-coded check to prevent storekeepers from adding products
  const isStorekeeper = role === 'storekeeper' || user?.username === 'storekeeper';
  // NEVER allow storekeepers to add products
  const canAddNewProducts = isStorekeeper ? false : true;
  
  // Debug
  console.log("User role for inventory permissions:", role);
  console.log("Is user a storekeeper?", isStorekeeper);
  console.log("Can user add new products?", canAddNewProducts);
  
  // Summary stats
  const [inventorySummary, setInventorySummary] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    recentlyUpdated: 0 // last 24 hours
  });
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      try {
        // In a real app, this would be an API call to fetch products
        // For this demo, let's create some sample data
        
        const response = await apiRequest('GET', '/api/products');
        const productData = await response.json();
        
        // Transform the data to match our Product interface
        const transformedProducts: Product[] = productData.map((item: any) => {
          // Determine status based on quantity
          let status: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock';
          if (item.quantity <= 0) {
            status = 'out-of-stock';
          } else if (item.quantity < 5) {
            status = 'low-stock';
          }
          
          return {
            id: item.id,
            name: item.name,
            brand: item.brand || 'Unknown',
            category: item.category,
            subcategory: item.subcategory,
            price: item.price,
            discountPrice: item.discountPrice || item.price,
            quantity: item.quantity || 0,
            storeQuantity: item.storeQuantity || 0,
            sku: item.sku || `SKU-${item.id}`,
            barcode: item.barcode || `BAR-${item.id}`,
            lastUpdated: new Date().toISOString(),
            description: item.description || '',
            status
          };
        });
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        
        // Calculate summary stats
        const totalValue = transformedProducts.reduce((acc, prod) => acc + prod.price * (prod.quantity + prod.storeQuantity), 0);
        const lowStockItems = transformedProducts.filter(p => p.status === 'low-stock').length;
        const outOfStockItems = transformedProducts.filter(p => p.status === 'out-of-stock').length;
        
        setInventorySummary({
          totalProducts: transformedProducts.length,
          totalValue,
          lowStockItems,
          outOfStockItems,
          recentlyUpdated: Math.floor(transformedProducts.length * 0.2) // 20% for demo purposes
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error fetching products",
          description: "Failed to load product data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsProductsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter and sort products when search, category or tab changes
  useEffect(() => {
    let result = [...products];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.barcode.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    // Filter by status tab
    if (currentTab !== 'all') {
      result = result.filter(product => product.status === currentTab);
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        const key = sortConfig.key;
        const direction = sortConfig.direction;
        
        // Handle string comparisons
        if (typeof a[key] === 'string' && typeof b[key] === 'string') {
          return direction === 'asc' 
            ? (a[key] as string).localeCompare(b[key] as string)
            : (b[key] as string).localeCompare(a[key] as string);
        }
        
        // Handle number comparisons
        if (typeof a[key] === 'number' && typeof b[key] === 'number') {
          return direction === 'asc'
            ? (a[key] as number) - (b[key] as number)
            : (b[key] as number) - (a[key] as number);
        }
        
        // Default case
        return 0;
      });
    }
    
    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, currentTab, sortConfig]);
  
  // Handle sorting
  const requestSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Generate random SKU for new products
  const generateSKU = (brand: string, name: string) => {
    const brandPrefix = brand.substring(0, 3).toUpperCase();
    const namePrefix = name.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${brandPrefix}-${namePrefix}-${random}`;
  };
  
  // Generate random barcode for new products
  const generateBarcode = () => {
    return `DASH${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;
  };

  // Handle updating stock
  const handleAddStock = async () => {
    if (!selectedProduct || stockToAdd <= 0) return;
    
    setIsUpdatingStock(true);
    try {
      // In a real app, you would send an API request to update the stock
      // For this demo, we'll just update the local state
      
      const updatedProducts = products.map(product => {
        if (product.id === selectedProduct.id) {
          const updatedProduct = { ...product };
          
          if (stockLocation === 'store') {
            updatedProduct.storeQuantity += stockToAdd;
          } else {
            updatedProduct.quantity += stockToAdd;
          }
          
          // Recalculate status
          if (updatedProduct.quantity + updatedProduct.storeQuantity <= 0) {
            updatedProduct.status = 'out-of-stock';
          } else if (updatedProduct.quantity + updatedProduct.storeQuantity < 5) {
            updatedProduct.status = 'low-stock';
          } else {
            updatedProduct.status = 'in-stock';
          }
          
          updatedProduct.lastUpdated = new Date().toISOString();
          return updatedProduct;
        }
        return product;
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(updatedProducts);
      
      toast({
        title: "Stock updated successfully",
        description: `Added ${stockToAdd} units to ${selectedProduct.name} (${stockLocation}).`,
        variant: "default"
      });
      
      // Close dialog and reset form
      setAddStockDialogOpen(false);
      setSelectedProduct(null);
      setStockToAdd(0);
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error updating stock",
        description: "Failed to update product stock. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingStock(false);
    }
  };
  
  // Handle showing product details
  const handleViewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setProductDetailsDialogOpen(true);
  };
  
  // Render stock status badge with appropriate color
  const renderStatusBadge = (status: 'in-stock' | 'low-stock' | 'out-of-stock') => {
    switch (status) {
      case 'in-stock':
        return <Badge className="bg-green-500">{status}</Badge>;
      case 'low-stock':
        return <Badge className="bg-yellow-500">{status}</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-500">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Format date string for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
  <AdminDashboardLayout>
    <AnimationWrapper>
      <Helmet>
        <title>Inventory Management | DASH Admin</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Manage your products, categories, and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex gap-1 items-center"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ArrowUpRight size={16} />
            <span>Back to Dashboard</span>
          </Button>
          
          {/* "+New Product" button completely removed */}
        </div>
      </div>
      
      {/* Smart Inventory Trend Predictor */}
      <div className="mb-6">
        <InventoryTrendInsights
          className="w-full"
          onSelectProduct={(productId: number) => {
            const product = products.find(p => p.id === productId);
            if (product) {
              setSelectedProduct(product);
              setProductDetailsDialogOpen(true);
            }
          }}
        />
      </div>
      
      {/* Inventory View Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="products" onValueChange={(value) => setActiveView(value as 'products' | 'barcodes' | 'scanner')}>
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="products" className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="barcodes" className="flex items-center gap-1">
              <Barcode className="h-4 w-4" />
              <span>Barcode Manager</span>
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-1">
              <ScanLine className="h-4 w-4" />
              <span>Scanner</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeView === 'barcodes' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Barcode className="mr-2 h-5 w-5" />
              Barcode Management
            </CardTitle>
            <CardDescription>
              Generate and manage barcodes for your inventory items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarcodeManager />
          </CardContent>
        </Card>
      )}
      
      {activeView === 'scanner' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ScanLine className="mr-2 h-5 w-5" />
              Barcode Scanner
            </CardTitle>
            <CardDescription>
              Scan barcodes to quickly look up products and update inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarcodeScanner />
          </CardContent>
        </Card>
      )}
      
      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <AnimatedCard>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <h3 className="text-2xl font-bold">{inventorySummary.totalProducts}</h3>
              </div>
              <Package className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </AnimatedCard>
        
        <AnimatedCard>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                <h3 className="text-2xl font-bold">{formatCurrency(inventorySummary.totalValue)}</h3>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <ArrowUpRight className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
        
        <AnimatedCard>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <h3 className="text-2xl font-bold">{inventorySummary.lowStockItems}</h3>
              </div>
              <div className="rounded-full bg-yellow-500/10 p-2">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
        
        <AnimatedCard>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <h3 className="text-2xl font-bold">{inventorySummary.outOfStockItems}</h3>
              </div>
              <div className="rounded-full bg-red-500/10 p-2">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>
      
      {activeView === 'products' && (
        <>
          {/* Filter and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex gap-2 items-center">
              <div className="w-[280px] relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Search products..."
                  value={inputValues.search}
                  onChange={(e) => {
                    // Update the local state immediately for responsive UI
                    setInputValues(prev => ({ ...prev, search: e.target.value }));
                    // Debounce the actual search query update
                    updateSearchDebounced(e.target.value);
                  }}
                  className="max-w-sm pl-9"
                />
              </div>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="bags">Bags</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={() => window.location.reload()} className="flex gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
          
          {/* Status Tabs */}
          <Tabs
            defaultValue="all"
            value={currentTab}
            onValueChange={(value) => setCurrentTab(value as 'all' | 'in-stock' | 'low-stock' | 'out-of-stock')}
            className="mb-6"
          >
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="in-stock">In Stock</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
              <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">#</TableHead>
                  <TableHead className="min-w-[200px]">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => requestSort('name')}>
                      Product
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => requestSort('brand')}>
                      Brand
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1 cursor-pointer" onClick={() => requestSort('category')}>
                      Category
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer" onClick={() => requestSort('price')}>
                      Price
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1 cursor-pointer" onClick={() => requestSort('quantity')}>
                      Quantity
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isProductsLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col justify-center items-center gap-2">
                        <p className="text-muted-foreground">No products found</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                            setCurrentTab('all');
                            setInputValues(prev => ({ ...prev, search: '' }));
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product, index) => (
                    <AnimatedListItem key={product.id} index={index}>
                      <TableCell className="font-mono text-xs">{product.id}</TableCell>
                      <TableCell>
                        <button 
                          className="font-medium text-left hover:text-primary transition-colors"
                          onClick={() => handleViewProductDetails(product)}
                        >
                          {product.name}
                        </button>
                      </TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                      <TableCell className="text-center">
                        {product.quantity + product.storeQuantity}
                        <div className="text-xs text-muted-foreground mt-1">
                          <span className="mr-2">Warehouse: {product.quantity}</span>
                          <span>Store: {product.storeQuantity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {renderStatusBadge(product.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(product.lastUpdated)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => handleViewProductDetails(product)}
                              className="cursor-pointer"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            {/* Only non-storekeepers can add stock or edit products */}
                            {!(user?.username === 'storekeeper' || user?.adminRole === 'storekeeper') && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setAddStockDialogOpen(true);
                                  }}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  <span>Add Stock</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit Product</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 cursor-pointer"
                                  onClick={() => {
                                    // In a real app, you would ask for confirmation before deleting
                                    toast({
                                      title: "Not implemented",
                                      description: "Delete functionality would go here in a real app",
                                      variant: "default"
                                    });
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </AnimatedListItem>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      
      {/* Add Stock Dialog */}
      <Dialog open={addStockDialogOpen} onOpenChange={setAddStockDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Stock</DialogTitle>
            <DialogDescription>
              Update inventory for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Quantity
              </Label>
              <Input
                id="stock"
                type="number"
                value={stockToAdd === 0 ? '' : stockToAdd}
                onChange={(e) => setStockToAdd(parseInt(e.target.value) || 0)}
                className="col-span-3"
                min={1}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Location
              </Label>
              <div className="col-span-3">
                <Select value={stockLocation} onValueChange={(value) => setStockLocation(value as 'store' | 'warehouse')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="store">Store</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddStockDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddStock}
              disabled={isUpdatingStock || stockToAdd <= 0}
            >
              {isUpdatingStock && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Product Details Dialog */}
      <Dialog open={productDetailsDialogOpen} onOpenChange={setProductDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Product details and information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {selectedProduct && (
              <>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <div className="aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-medium">Basic Information</h3>
                      <Separator className="my-2" />
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Brand</div>
                        <div>{selectedProduct.brand}</div>
                        
                        <div className="text-muted-foreground">Category</div>
                        <div className="capitalize">{selectedProduct.category}</div>
                        
                        <div className="text-muted-foreground">Subcategory</div>
                        <div className="capitalize">{selectedProduct.subcategory}</div>
                        
                        <div className="text-muted-foreground">Status</div>
                        <div>{renderStatusBadge(selectedProduct.status)}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Pricing</h3>
                      <Separator className="my-2" />
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Regular Price</div>
                        <div className="font-medium">{formatCurrency(selectedProduct.price)}</div>
                        
                        <div className="text-muted-foreground">Discount Price</div>
                        <div>
                          {selectedProduct.discountPrice !== selectedProduct.price ? (
                            <span className="font-medium">{formatCurrency(selectedProduct.discountPrice)}</span>
                          ) : (
                            <span className="text-muted-foreground italic">No discount</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Inventory</h3>
                      <Separator className="my-2" />
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Warehouse Quantity</div>
                        <div>{selectedProduct.quantity} units</div>
                        
                        <div className="text-muted-foreground">Store Quantity</div>
                        <div>{selectedProduct.storeQuantity} units</div>
                        
                        <div className="text-muted-foreground">Total Quantity</div>
                        <div className="font-medium">{selectedProduct.quantity + selectedProduct.storeQuantity} units</div>
                        
                        <div className="text-muted-foreground">SKU</div>
                        <div className="font-mono text-xs">{selectedProduct.sku}</div>
                        
                        <div className="text-muted-foreground">Barcode</div>
                        <div className="font-mono text-xs">{selectedProduct.barcode}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedProduct.description && (
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <Separator className="my-2" />
                    <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                  </div>
                )}
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDetailsDialogOpen(false)}>
              Close
            </Button>
            {canEditInventory && selectedProduct && (
              <Button 
                onClick={() => {
                  setProductDetailsDialogOpen(false);
                  setSelectedProduct(selectedProduct);
                  setAddStockDialogOpen(true);
                }}
              >
                Add Stock
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Product Dialog */}
      <Dialog 
        open={newProductDialogOpen} 
        onOpenChange={setNewProductDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the product details below to add a new item to your inventory.
            </DialogDescription>
          </DialogHeader>
          
          {/* Use our new component-based form for better stability */}
          <NewProductForm 
            onSuccess={(product) => {
              // Add the new product to the list
              const newProductWithStatus = {
                ...product,
                status: (product.quantity + product.storeQuantity) <= 0 ? 'out-of-stock' : 
                       (product.quantity + product.storeQuantity) < 5 ? 'low-stock' : 'in-stock',
                lastUpdated: new Date().toISOString(),
              };
              
              setProducts(prev => [...prev, newProductWithStatus]);
              
              // Close the dialog
              setNewProductDialogOpen(false);
              
              // Show success notification
              toast({
                title: "Product added",
                description: `${product.name} has been added to your inventory.`,
                variant: "default"
              });
            }}
            onCancel={() => setNewProductDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AnimationWrapper>
  </AdminDashboardLayout>
  );
};

export default AdminInventory;