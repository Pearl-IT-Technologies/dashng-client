import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout';
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
  ShoppingBag,
  DollarSign,
  Users,
  Loader2,
  CheckCircle,
  X,
  AlertTriangle,
  ArrowRight,
  ShoppingCart,
  Tag,
  Clock
} from 'lucide-react';
import { 
  Button,
  buttonVariants
} from '@/components/ui/button';
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
import { Separator } from '@/components/ui/separator';
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
import { toast } from '@/hooks/use-toast';

// Product interface
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
  images: string[];
}

// Cart item interface
interface CartItem {
  product: Product;
  quantity: number;
}

// Transaction interface
interface Transaction {
  id: number;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'cash' | 'card' | 'transfer';
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: string;
  createdBy: string;
}

// Sales Dashboard component
const AdminSales = () => {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [newSaleDialogOpen, setNewSaleDialogOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [isProcessingSale, setIsProcessingSale] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTab, setCurrentTab] = useState<'all' | 'completed' | 'pending'>('all');
  const [barcodeInput, setBarcodeInput] = useState('');
  
  // Get the current user role
  const userRole = (): 'admin' | 'manager' | 'storekeeper' | 'sales' => {
    if (!user) return 'sales'; // Default fallback
    
    if (user.username === 'owner') return 'admin';
    if (user.username.startsWith('storekeeper')) return 'storekeeper';
    if (user.username.startsWith('salesperson')) return 'sales';
    
    // Check if user is a manager
    if (user.isAdmin && user.username !== 'owner') return 'manager';
    
    // Fallback for other cases
    return 'sales';
  };
  
  const role = userRole();
  
  // Check if user can create sales
  const canCreateSales = ['admin', 'manager', 'sales'].includes(role);
  
  // Sales summary stats
  const [salesSummary, setSalesSummary] = useState({
    todaySales: 0,
    todayTransactions: 0,
    averageOrderValue: 0,
    pendingTransactions: 0,
  });
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsProductsLoading(true);
      try {
        const response = await apiRequest('GET', '/api/products');
        const productData = await response.json();
        
        // Only include products that have store quantity > 0
        const availableProducts = productData.filter((item: any) => item.storeQuantity > 0);
        
        setProducts(availableProducts);
        setFilteredProducts(availableProducts);
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
    
    // Generate some dummy transactions for demo
    const dummyTransactions: Transaction[] = [
      {
        id: 1,
        items: [
          {
            product: {
              id: 1,
              name: "Designer Handbag",
              brand: "Luxury Brand",
              category: "bags",
              subcategory: "handbags",
              price: 250000,
              discountPrice: 250000,
              quantity: 5,
              storeQuantity: 2,
              sku: "LUX-HB-12345",
              barcode: "1234567890123",
              images: []
            },
            quantity: 1
          }
        ],
        total: 250000,
        customerName: "Jane Smith",
        customerPhone: "08012345678",
        paymentMethod: "card",
        status: "completed",
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        createdBy: user?.username || "Unknown"
      },
      {
        id: 2,
        items: [
          {
            product: {
              id: 3,
              name: "Leather Wallet",
              brand: "Milano",
              category: "accessories",
              subcategory: "wallets",
              price: 45000,
              discountPrice: 38000,
              quantity: 10,
              storeQuantity: 5,
              sku: "MIL-WL-54321",
              barcode: "3210987654321",
              images: []
            },
            quantity: 1
          },
          {
            product: {
              id: 5,
              name: "Silk Scarf",
              brand: "Eleganza",
              category: "accessories",
              subcategory: "scarves",
              price: 35000,
              discountPrice: 35000,
              quantity: 8,
              storeQuantity: 3,
              sku: "ELG-SC-67890",
              barcode: "6789012345678",
              images: []
            },
            quantity: 1
          }
        ],
        total: 73000,
        customerName: "John Doe",
        customerPhone: "08098765432",
        paymentMethod: "cash",
        status: "completed",
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        createdBy: user?.username || "Unknown"
      },
      {
        id: 3,
        items: [
          {
            product: {
              id: 7,
              name: "Gold Bracelet",
              brand: "Classic Luxury",
              category: "jewelry",
              subcategory: "bracelets",
              price: 350000,
              discountPrice: 315000,
              quantity: 3,
              storeQuantity: 1,
              sku: "CLS-BR-13579",
              barcode: "1357924680123",
              images: []
            },
            quantity: 1
          }
        ],
        total: 315000,
        customerName: "Sarah Johnson",
        customerPhone: "08023456789",
        paymentMethod: "transfer",
        status: "pending",
        createdAt: new Date().toISOString(),
        createdBy: user?.username || "Unknown"
      }
    ];
    
    setTransactions(dummyTransactions);
    
    // Calculate summary stats
    const todayTransactions = dummyTransactions.filter(t => {
      const transactionDate = new Date(t.createdAt);
      const today = new Date();
      return transactionDate.toDateString() === today.toDateString();
    });
    
    const completedTransactions = dummyTransactions.filter(t => t.status === 'completed');
    
    setSalesSummary({
      todaySales: todayTransactions.reduce((sum, t) => sum + t.total, 0),
      todayTransactions: todayTransactions.length,
      averageOrderValue: completedTransactions.length > 0 
        ? completedTransactions.reduce((sum, t) => sum + t.total, 0) / completedTransactions.length 
        : 0,
      pendingTransactions: dummyTransactions.filter(t => t.status === 'pending').length
    });
  }, [user?.username]);
  
  // Filter products when search or category changes
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
    
    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory]);
  
  // Filter transactions based on current tab
  const filteredTransactions = transactions.filter(transaction => {
    if (currentTab === 'all') return true;
    return transaction.status === currentTab;
  });
  
  // Add product to cart
  const addToCart = (product: Product) => {
    // Check if product is already in cart
    const existingItemIndex = cartItems.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Increment quantity if already in cart
      const updatedCartItems = [...cartItems];
      const item = updatedCartItems[existingItemIndex];
      
      // Check if we have enough store quantity
      if (item.quantity >= product.storeQuantity) {
        toast({
          title: "Cannot add more",
          description: `Only ${product.storeQuantity} units available in store.`,
          variant: "destructive"
        });
        return;
      }
      
      updatedCartItems[existingItemIndex] = {
        ...item,
        quantity: item.quantity + 1
      };
      
      setCartItems(updatedCartItems);
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { product, quantity: 1 }]);
    }
    
    toast({
      title: "Product added",
      description: `Added ${product.name} to cart.`,
      variant: "default"
    });
  };
  
  // Remove product from cart
  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };
  
  // Update cart item quantity
  const updateCartItemQuantity = (productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if we have enough store quantity
    if (quantity > product.storeQuantity) {
      toast({
        title: "Cannot add more",
        description: `Only ${product.storeQuantity} units available in store.`,
        variant: "destructive"
      });
      return;
    }
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };
  
  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product.discountPrice * item.quantity),
    0
  );
  
  // Handle barcode input
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!barcodeInput.trim()) return;
    
    // Find product by barcode
    const product = products.find(p => p.barcode === barcodeInput);
    
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      toast({
        title: "Product not found",
        description: `No product found with barcode: ${barcodeInput}`,
        variant: "destructive"
      });
    }
  };
  
  // Process sale
  const handleProcessSale = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add products to the cart before checking out.",
        variant: "destructive"
      });
      return;
    }
    
    if (!customerName.trim()) {
      toast({
        title: "Customer name required",
        description: "Please enter the customer's name.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessingSale(true);
    
    try {
      // In a real app, you would send an API request to create the sale
      // For this demo, we'll just update the local state
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new transaction
      const newTransaction: Transaction = {
        id: transactions.length + 1,
        items: [...cartItems],
        total: cartTotal,
        customerName,
        customerPhone,
        paymentMethod,
        status: 'completed',
        createdAt: new Date().toISOString(),
        createdBy: user?.username || "Unknown"
      };
      
      // Update transactions list
      setTransactions([newTransaction, ...transactions]);
      
      // Update products stock (decrement store quantity)
      const updatedProducts = products.map(product => {
        const cartItem = cartItems.find(item => item.product.id === product.id);
        
        if (cartItem) {
          return {
            ...product,
            storeQuantity: product.storeQuantity - cartItem.quantity
          };
        }
        
        return product;
      });
      
      setProducts(updatedProducts);
      
      // Update sales summary
      setSalesSummary({
        ...salesSummary,
        todaySales: salesSummary.todaySales + cartTotal,
        todayTransactions: salesSummary.todayTransactions + 1,
        averageOrderValue: (salesSummary.averageOrderValue * salesSummary.todayTransactions + cartTotal) / (salesSummary.todayTransactions + 1)
      });
      
      toast({
        title: "Sale completed",
        description: "The sale has been successfully processed.",
        variant: "default"
      });
      
      // Reset cart
      setCartItems([]);
      setCustomerName('');
      setCustomerPhone('');
      setPaymentMethod('cash');
      setNewSaleDialogOpen(false);
    } catch (error) {
      console.error('Error processing sale:', error);
      toast({
        title: "Error processing sale",
        description: "Failed to process the sale. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingSale(false);
    }
  };
  
  // Redirect if not logged in or not authorized
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    navigate("/auth");
    return null;
  }
  
  // Role-based access control - redirect if not admin, manager, or sales
  if (!['admin', 'manager', 'sales'].includes(role)) {
    toast({
      title: "Access denied",
      description: "You don't have permission to access the sales dashboard.",
      variant: "destructive"
    });
    navigate("/admin/dashboard");
    return null;
  }
  
  return (
    <AdminDashboardLayout>
      <Helmet>
        <title>Sales Dashboard | DASH Fashion</title>
      </Helmet>
      
      {/* Page header with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Dashboard</h2>
          <p className="text-muted-foreground">Process in-store sales and view transactions.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {canCreateSales && (
            <Button onClick={() => setNewSaleDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          )}
        </div>
      </div>
      
      {/* Sales summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(salesSummary.todaySales / 100).toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transactions Today</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesSummary.todayTransactions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{(salesSummary.averageOrderValue / 100).toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesSummary.pendingTransactions}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>View and manage your recent in-store sales.</CardDescription>
          
          <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as any)} className="mt-4">
            <TabsList className="grid grid-cols-3 md:w-[300px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">No transactions found</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                {currentTab !== 'all' 
                  ? `There are no ${currentTab} transactions to display.`
                  : "There are no transactions to display. Create a new sale to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{transaction.customerName}</div>
                          <div className="text-xs text-muted-foreground">{transaction.customerPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>{transaction.items.reduce((total, item) => total + item.quantity, 0)} items</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{transaction.paymentMethod}</TableCell>
                      <TableCell>{transaction.createdBy}</TableCell>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString()} 
                        <div className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.status === 'completed' && (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Completed</Badge>
                        )}
                        {transaction.status === 'pending' && (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>
                        )}
                        {transaction.status === 'cancelled' && (
                          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Cancelled</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">₦{(transaction.total / 100).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* New Sale Dialog */}
      <Dialog open={newSaleDialogOpen} onOpenChange={setNewSaleDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>New In-Store Sale</DialogTitle>
            <DialogDescription>
              Create a new sale for walk-in customers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4 md:grid-cols-2">
            {/* Left side - Products */}
            <div className="space-y-4">
              <div className="font-medium text-sm">Add Products</div>
              
              {/* Barcode Scanner Input */}
              <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
                <Input 
                  placeholder="Scan barcode..." 
                  value={barcodeInput} 
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary">Add</Button>
              </form>
              
              {/* Product Search */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Product List */}
              <div className="h-[300px] overflow-y-auto border rounded-md">
                {isProductsLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                    <span>Loading products...</span>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <AlertTriangle className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No products found</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="p-3 flex items-center justify-between hover:bg-muted/50">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.brand} · In store: {product.storeQuantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">₦{(product.discountPrice / 100).toLocaleString()}</div>
                            {product.discountPrice < product.price && (
                              <div className="text-sm line-through text-muted-foreground">
                                ₦{(product.price / 100).toLocaleString()}
                              </div>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => addToCart(product)}
                            disabled={product.storeQuantity <= 0}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right side - Cart & Customer info */}
            <div className="space-y-4">
              <div className="font-medium text-sm">Cart ({cartItems.length} items)</div>
              
              {/* Cart items */}
              <div className="h-[180px] overflow-y-auto border rounded-md">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Cart is empty</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-muted-foreground">{item.product.brand}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <path d="M5 12h14"/>
                            </svg>
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.storeQuantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <div className="w-24 text-right font-medium">
                            ₦{((item.product.discountPrice * item.quantity) / 100).toLocaleString()}
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Cart Total */}
              <div className="flex items-center justify-between py-2 border-t border-b">
                <div className="font-medium">Total</div>
                <div className="text-xl font-bold">₦{(cartTotal / 100).toLocaleString()}</div>
              </div>
              
              {/* Customer Information */}
              <div className="space-y-4 pt-2">
                <div className="font-medium text-sm">Customer Information</div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Name</Label>
                  <Input 
                    id="customer-name" 
                    placeholder="Customer name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Phone (optional)</Label>
                  <Input 
                    id="customer-phone" 
                    placeholder="Customer phone" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select 
                    value={paymentMethod} 
                    onValueChange={(value) => setPaymentMethod(value as 'cash' | 'card' | 'transfer')}
                  >
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewSaleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleProcessSale} 
              disabled={isProcessingSale || cartItems.length === 0 || !customerName.trim()}
            >
              {isProcessingSale && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
};

export default AdminSales;