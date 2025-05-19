import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Printer, Download, Barcode, RefreshCw, Eye } from 'lucide-react';
import BarcodeDisplay from './BarcodeDisplay';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  barcode?: string;
  sku?: string;
  inStock: boolean;
  quantity: number;
  storeQuantity?: number;
  inStoreAvailable?: boolean;
  images: string[];
}

const BarcodeManager: React.FC = () => {
  const { toast } = useToast();
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false);
  
  // Fetch products
  const { data: products, isLoading, isError, error } = useQuery<Product[], Error>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      return res.json();
    }
  });
  
  // Generate barcode for a specific product
  const generateBarcodeMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest('POST', `/api/products/${productId}/generate-barcode`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to generate barcode');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Barcode generated',
        description: 'Product barcode generated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to generate barcode',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  // Generate barcodes for all products that don't have one
  const generateAllBarcodesMutation = useMutation({
    mutationFn: async () => {
      setIsGeneratingAll(true);
      const res = await apiRequest('POST', '/api/products/generate-all-barcodes');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to generate barcodes');
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Barcodes generated',
        description: `Successfully generated barcodes for ${data.updatedCount} products.`,
      });
      setIsGeneratingAll(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to generate barcodes',
        description: error.message,
        variant: 'destructive',
      });
      setIsGeneratingAll(false);
    }
  });
  
  // Calculate counts
  const productsWithBarcode = products?.filter(p => p.barcode)?.length || 0;
  const productsWithoutBarcode = products?.filter(p => !p.barcode)?.length || 0;
  const totalProducts = products?.length || 0;
  
  // Handle view barcode
  const handleViewBarcode = (product: Product) => {
    setSelectedProduct(product);
    setBarcodeDialogOpen(true);
  };
  
  // Handle generate all barcodes
  const handleGenerateAllBarcodes = () => {
    if (productsWithoutBarcode === 0) {
      toast({
        title: 'No action needed',
        description: 'All products already have barcodes.',
      });
      return;
    }
    
    generateAllBarcodesMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Products</CardTitle>
          <CardDescription>
            There was a problem loading the inventory data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error?.message}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/products'] })}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Inventory Barcode Management</span>
            <Button 
              onClick={handleGenerateAllBarcodes} 
              disabled={isGeneratingAll || productsWithoutBarcode === 0}
              className="bg-primary"
            >
              {isGeneratingAll ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Barcode className="mr-2 h-4 w-4" />
                  Generate All Missing Barcodes
                </>
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Manage product barcodes for inventory scanning and in-store processing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">With Barcode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{productsWithBarcode}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Missing Barcode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{productsWithoutBarcode}</div>
              </CardContent>
            </Card>
          </div>
          
          <Table>
            <TableCaption>Inventory items and their barcodes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md overflow-hidden mr-3">
                        <img
                          src={product.images[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    {product.discountPrice ? (
                      <div>
                        <span className="text-primary font-medium">{formatPrice(product.discountPrice)}</span>
                        <span className="text-muted-foreground line-through text-xs ml-2">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      formatPrice(product.price)
                    )}
                  </TableCell>
                  <TableCell>
                    {product.barcode ? (
                      <Badge variant="outline" className="font-mono">
                        {product.barcode}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        No Barcode
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {product.inStock ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {typeof product.storeQuantity === 'number' ? `${product.storeQuantity} in store` : product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {product.barcode ? (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewBarcode(product)}
                            title="View Barcode"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={generateBarcodeMutation.isPending}
                          onClick={() => generateBarcodeMutation.mutate(product.id)}
                          title="Generate Barcode"
                        >
                          <Barcode className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {products?.length} products
          </div>
          <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/products'] })}>
            Refresh Data
          </Button>
        </CardFooter>
      </Card>
      
      {/* Barcode Dialog */}
      <Dialog open={barcodeDialogOpen} onOpenChange={setBarcodeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Product Barcode</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name} ({selectedProduct?.brand})
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center p-4">
            {selectedProduct?.barcode ? (
              <BarcodeDisplay
                value={selectedProduct.barcode}
                displayValue={true}
                height={80}
                width={2}
                productName={selectedProduct.name}
                productId={selectedProduct.id}
              />
            ) : (
              <div className="text-center p-4">
                <Barcode className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No barcode available for this product</p>
                <Button 
                  className="mt-4"
                  onClick={() => {
                    generateBarcodeMutation.mutate(selectedProduct!.id);
                    setBarcodeDialogOpen(false);
                  }}
                  disabled={generateBarcodeMutation.isPending}
                >
                  {generateBarcodeMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Barcode'
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BarcodeManager;