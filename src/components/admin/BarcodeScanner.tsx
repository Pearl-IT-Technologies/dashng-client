import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Barcode, Loader2, Scan } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface ProductDisplay {
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
  images: string[];
}

const BarcodeScanner: React.FC = () => {
  const { toast } = useToast();
  const [barcode, setBarcode] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scannedProduct, setScannedProduct] = useState<ProductDisplay | null>(null);
  const [showNewSkuForm, setShowNewSkuForm] = useState<boolean>(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  
  // Scan a product by barcode or SKU
  const handleScan = async () => {
    if (!barcode.trim()) {
      toast({
        title: "No barcode entered",
        description: "Please enter a barcode or SKU to scan",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await apiRequest("GET", `/api/products/scan/${barcode.trim()}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          toast({
            title: "Product not found",
            description: "No product found with this barcode or SKU",
            variant: "destructive"
          });
          setScannedProduct(null);
        } else {
          throw new Error("Failed to scan product");
        }
      } else {
        const product = await res.json();
        setScannedProduct(product);
        
        toast({
          title: "Product scanned",
          description: `Found: ${product.name}`,
        });
      }
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "There was a problem scanning the product",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle key down event for barcode scanner
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleScan();
    }
  };
  
  // Focus on barcode input when component mounts
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scan className="mr-2 h-5 w-5" />
            Barcode Scanner
          </CardTitle>
          <CardDescription>
            Scan product barcodes to quickly look up inventory items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="barcode-input">Scan or Enter Barcode/SKU</Label>
              <div className="flex">
                <Input
                  id="barcode-input"
                  ref={barcodeInputRef}
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Scan or type barcode/SKU..."
                  className="flex-1"
                  autoFocus
                />
                <Button
                  onClick={handleScan}
                  disabled={isLoading || !barcode.trim()}
                  className="ml-2 bg-[#D4AF37] hover:bg-[#D4AF37]/90"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Barcode className="mr-2 h-4 w-4" />}
                  Scan
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {scannedProduct && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{scannedProduct.name}</CardTitle>
            <CardDescription>{scannedProduct.brand}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-32 w-32 rounded-md overflow-hidden">
                  <img 
                    src={scannedProduct.images[0] || '/default-product.jpg'} 
                    alt={scannedProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">
                    {scannedProduct.discountPrice 
                      ? (
                        <div className="flex flex-col">
                          <span className="text-primary">{formatPrice(scannedProduct.discountPrice)}</span>
                          <span className="text-muted-foreground line-through text-xs">
                            {formatPrice(scannedProduct.price)}
                          </span>
                        </div>
                      ) 
                      : formatPrice(scannedProduct.price)
                    }
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-muted-foreground">Barcode:</span>
                  <span className="font-mono text-xs">{scannedProduct.barcode || "—"}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="font-mono text-xs">{scannedProduct.sku || "—"}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-muted-foreground">Stock:</span>
                  <span>
                    {scannedProduct.inStock ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {scannedProduct.quantity} in stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        Out of Stock
                      </Badge>
                    )}
                  </span>
                </div>
                
                {typeof scannedProduct.storeQuantity === 'number' && (
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">In-store Stock:</span>
                    <span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {scannedProduct.storeQuantity} in store
                      </Badge>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-2">
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setScannedProduct(null)}
              >
                Clear
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default BarcodeScanner;