import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { XCircle, Plus, Search, AlertCircle, Camera, Barcode, Scan } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice, type Currency, currencySettings } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

// Form validation schema
const orderFormSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  customerPhone: z.string().min(5, "Customer phone is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentStatus: z.string().min(1, "Payment status is required"),
  currency: z.enum(["NGN", "USD", "GBP"] as const),
  items: z.array(
    z.object({
      productId: z.number(),
      productName: z.string(),
      price: z.number().min(0),
      quantity: z.number().min(1),
    })
  ).min(1, "At least one product is required"),
  totalAmount: z.number().min(0),
  amountPaid: z.number().min(0).optional(),
  discountAmount: z.number().min(0).optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface CreateInStoreOrderFormProps {
  onSuccess?: () => void;
}

export default function CreateInStoreOrderForm({ onSuccess }: CreateInStoreOrderFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isSearchingBarcode, setIsSearchingBarcode] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Set focus on barcode input when scanner dialog opens
  useEffect(() => {
    if (showBarcodeScanner && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [showBarcodeScanner]);

  // Set up form with default values
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      notes: "",
      paymentMethod: "cash",
      paymentStatus: "paid",
      currency: "NGN", // Default to Nigerian Naira
      items: [],
      totalAmount: 0,
      amountPaid: 0,
      discountAmount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Calculate total amount whenever items change
  useEffect(() => {
    const items = form.getValues("items");
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discountAmount = form.getValues("discountAmount") || 0;
    
    form.setValue("totalAmount", subtotal - discountAmount);
    
    // If payment status is "paid", set amountPaid equal to totalAmount
    if (form.getValues("paymentStatus") === "paid") {
      form.setValue("amountPaid", subtotal - discountAmount);
    }
  }, [form.watch("items"), form.watch("discountAmount")]);

  // Update amountPaid when payment status changes
  useEffect(() => {
    const paymentStatus = form.watch("paymentStatus");
    if (paymentStatus === "paid") {
      form.setValue("amountPaid", form.getValues("totalAmount"));
    } else if (paymentStatus === "pending") {
      form.setValue("amountPaid", 0);
    }
  }, [form.watch("paymentStatus")]);

  // Fetch products for search
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      return res.json();
    },
  });
  
  // Barcode scanning mutation
  const barcodeScanMutation = useMutation({
    mutationFn: async (barcode: string) => {
      setIsSearchingBarcode(true);
      const res = await apiRequest("GET", `/api/products/scan/${barcode}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Product not found");
      }
      return res.json();
    },
    onSuccess: (product) => {
      // Add the product found by barcode to the order
      handleAddProduct(product);
      setBarcodeInput("");
      setIsSearchingBarcode(false);
    },
    onError: (error) => {
      toast({
        title: "Barcode scan failed",
        description: error.message,
        variant: "destructive",
      });
      setIsSearchingBarcode(false);
    },
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/orders/in-store", orderData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create order");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Order created",
        description: "In-store order has been created successfully",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to create order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredProducts = searchQuery && products
    ? products.filter((product: any) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleAddProduct = (product: any) => {
    // Check if product is already added
    const existingProductIndex = form.getValues("items").findIndex(
      (item) => item.productId === product.id
    );

    if (existingProductIndex !== -1) {
      // Update quantity of existing product
      const items = form.getValues("items");
      items[existingProductIndex].quantity += 1;
      form.setValue("items", items);
    } else {
      // Add new product
      append({
        productId: product.id,
        productName: product.name,
        price: product.discountPrice || product.price,
        quantity: 1,
      });
    }
    
    setShowProductSearch(false);
    setShowBarcodeScanner(false);
  };
  
  // Handle barcode scan submission
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcodeInput.trim()) {
      barcodeScanMutation.mutate(barcodeInput.trim());
    }
  };

  const onSubmit = (data: OrderFormValues) => {
    // Prepare the order data
    const orderData = {
      ...data,
      isInStorePurchase: true,
      adminCreated: true,
      processingAdminId: user?.id,
      processingAdminName:user?.username,
      status: "completed", // In-store orders are completed immediately
      shippingAddress: "In-store purchase", // Add missing required field for in-store orders
      items: data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    createOrderMutation.mutate(orderData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes about the order" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="pos">POS</SelectItem>
                      <SelectItem value="transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paystack">Paystack</SelectItem>
                      <SelectItem value="flutterwave">Flutterwave</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partially Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("paymentStatus") === "partial" && (
              <FormField
                control={form.control}
                name="amountPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Paid</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="discountAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Amount (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Product Selection */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Order Items</h3>
            
            <div className="flex gap-2">
              {/* Barcode Scanner Dialog */}
              <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" className="flex items-center gap-2">
                    <Barcode className="h-4 w-4" />
                    Scan Barcode
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Scan Product Barcode</DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleBarcodeSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
                        <div className="text-center">
                          <Scan className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Scan the product barcode or enter the code manually
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <Input
                          ref={barcodeInputRef}
                          type="text"
                          placeholder="Enter barcode number"
                          value={barcodeInput}
                          onChange={(e) => setBarcodeInput(e.target.value)}
                          className="pr-10"
                          disabled={isSearchingBarcode}
                        />
                        {isSearchingBarcode && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowBarcodeScanner(false)}
                        disabled={isSearchingBarcode}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={!barcodeInput.trim() || isSearchingBarcode}>
                        {isSearchingBarcode ? "Searching..." : "Add Product"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              
              {/* Product Search Dialog */}
              <Dialog open={showProductSearch} onOpenChange={setShowProductSearch}>
                <DialogTrigger asChild>
                  <Button type="button" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogTitle>Add Products</DialogTitle>
                  
                  <div className="relative my-4">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products by name, category, or brand"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {isLoadingProducts ? (
                    <div className="h-60 flex items-center justify-center">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : searchQuery && filteredProducts.length === 0 ? (
                    <div className="h-60 flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>No products found matching "{searchQuery}"</p>
                    </div>
                  ) : searchQuery ? (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {filteredProducts.map((product: any) => (
                        <Card
                          key={product.id}
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => handleAddProduct(product)}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Badge variant="outline">{product.category}</Badge>
                                <span>{product.brand}</span>
                                {product.storeQuantity && product.storeQuantity <= 0 && (
                                  <Badge variant="destructive">Out of Stock</Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {product.discountPrice ? (
                                  <>
                                    <span className="text-primary">{formatPrice(product.discountPrice, form.watch("currency"))}</span>
                                    <span className="text-sm text-muted-foreground line-through ml-2">
                                      {formatPrice(product.price, form.watch("currency"))}
                                    </span>
                                  </>
                                ) : (
                                  formatPrice(product.price, form.watch("currency"))
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {typeof product.storeQuantity === 'number' && product.storeQuantity > 0 
                                  ? `${product.storeQuantity} in stock` 
                                  : 'Out of stock'
                                }
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="h-60 flex flex-col items-center justify-center text-muted-foreground">
                      <Search className="h-8 w-8 mb-2" />
                      <p>Search for products to add to the order</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {fields.length === 0 ? (
            <div className="border border-dashed rounded-md p-8 text-center">
              <p className="text-muted-foreground">No products added yet. Click "Add Product" to begin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4 border p-4 rounded-md">
                  <div className="flex-1">
                    <p className="font-medium">{field.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(field.price, form.watch("currency"))} per unit
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <Input
                      type="number"
                      className="w-20"
                      min={1}
                      {...form.register(`items.${index}.quantity` as const, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  
                  <div className="w-24 text-right font-medium">
                    {formatPrice(field.price * (form.watch(`items.${index}.quantity` as const) || 0), form.watch("currency"))}
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
              
              <div className="flex flex-col items-end gap-2 pt-4">
                <div className="flex justify-between w-full max-w-xs">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>
                    {formatPrice(
                      form.watch("items").reduce(
                        (total, item) => total + item.price * (item.quantity || 0), 
                        0
                      ),
                      form.watch("currency")
                    )}
                  </span>
                </div>
                
                {(form.watch("discountAmount") || 0) > 0 && (
                  <div className="flex justify-between w-full max-w-xs">
                    <span className="text-muted-foreground">Discount:</span>
                    <span>- {formatPrice(form.watch("discountAmount") || 0, form.watch("currency"))}</span>
                  </div>
                )}
                
                <div className="flex justify-between w-full max-w-xs font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(form.watch("totalAmount"), form.watch("currency"))}</span>
                </div>
                
                {form.watch("paymentStatus") === "partial" && (
                  <>
                    <div className="flex justify-between w-full max-w-xs">
                      <span className="text-muted-foreground">Amount Paid:</span>
                      <span>{formatPrice(form.watch("amountPaid") || 0, form.watch("currency"))}</span>
                    </div>
                    <div className="flex justify-between w-full max-w-xs">
                      <span className="text-muted-foreground">Balance:</span>
                      <span>
                        {formatPrice((form.watch("totalAmount") || 0) - (form.watch("amountPaid") || 0), form.watch("currency"))}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (onSuccess) onSuccess();
            }}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            disabled={fields.length === 0 || createOrderMutation.isPending}
            className="min-w-32"
          >
            {createOrderMutation.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                Processing...
              </>
            ) : (
              "Create Order"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}