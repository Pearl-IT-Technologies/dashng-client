// @ts-nocheck

import { createContext, ReactNode, useContext, useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/schema";

// Interface for inventory context
interface InventoryContextType {
  productStock: Record<number, number>;
  getStockLevel: (productId: number) => number;
  updateStockLevel: (productId: number, newQuantity: number) => void;
  stockStatus: (productId: number) => {
    label: string;
    color: string;
    icon?: string;
    className?: string;
  };
  isLoading: boolean;
  isConnected: boolean;
}

// Create the context
export const InventoryContext = createContext<InventoryContextType | null>(null);

// WebSocket message types
interface StockUpdateMessage {
  type: 'stock_update';
  productId: number;
  newQuantity: number;
  productName: string;
}

type WebSocketMessage = StockUpdateMessage;

// Provider component
export function InventoryProvider({ children }: { children: ReactNode }) {
  const [productStock, setProductStock] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Connect to WebSocket for real-time inventory updates
  useEffect(() => {
    const connectWebSocket = () => {
      // Close any existing connection
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      
      // Create WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('WebSocket connected for real-time inventory');
        setIsConnected(true);
        
        // Clear any reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected, will try to reconnect...');
        setIsConnected(false);
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
      
      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.type === 'stock_update') {
            // Update local stock
            setProductStock(prev => ({
              ...prev,
              [message.productId]: message.newQuantity
            }));
            
            // Update product in cache
            updateProductCache(message.productId, message.newQuantity);
            
            // Show notification for low stock
            if (message.newQuantity <= 5 && message.newQuantity > 0) {
              toast({
                title: "Low Stock Alert",
                description: `${message.productName} is running low! Only ${message.newQuantity} left.`,
                variant: "default"
              });
            } else if (message.newQuantity <= 0) {
              toast({
                title: "Out of Stock",
                description: `${message.productName} is now out of stock.`,
                variant: "destructive"
              });
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    };
    
    connectWebSocket();
    
    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [toast]);

  // Helper function to update product in cache
  const updateProductCache = (productId: number, newQuantity: number) => {
    // Update the product in the cache
    const productQueryKey = [`/api/products/${productId}`];
    const product = queryClient.getQueryData<Product>(productQueryKey);
    
    if (product) {
      queryClient.setQueryData(productQueryKey, {
        ...product,
        quantity: newQuantity,
        inStock: newQuantity > 0
      });
    }
    
    // Also update in product list caches
    const productsListData = queryClient.getQueriesData<Product[]>({
      queryKey: ["/api/products"],
    });
    
    productsListData.forEach(([queryKey, products]) => {
      if (products) {
        const updatedProducts = products.map(p => 
          p.id === productId 
            ? { ...p, quantity: newQuantity, inStock: newQuantity > 0 } 
            : p
        );
        queryClient.setQueryData(queryKey, updatedProducts);
      }
    });
  };

  // Initialize product stock from cache
  useEffect(() => {
    setIsLoading(true);
    
    // Get all products from the query cache
    const productsCache = queryClient.getQueriesData<Product[]>({
      queryKey: ["/api/products"],
    });

    if (productsCache && productsCache.length > 0) {
      const initialStock: Record<number, number> = {};
      
      // Loop through all products and store their quantities
      productsCache.forEach(([_, productsData]) => {
        if (productsData && Array.isArray(productsData)) {
          productsData.forEach(product => {
            if (product.id && product.quantity !== undefined) {
              initialStock[product.id] = product.quantity;
            }
          });
        }
      });
      
      setProductStock(initialStock);
      setIsLoading(false);
    } else {
      // If not in cache yet, fetch products
      fetch('/api/products')
        .then(res => res.json())
        .then((products: Product[]) => {
          const initialStock: Record<number, number> = {};
          
          products.forEach(product => {
            if (product.id && product.quantity !== undefined) {
              initialStock[product.id] = product.quantity;
            }
          });
          
          setProductStock(initialStock);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching products for inventory:', error);
          setIsLoading(false);
        });
    }
  }, [queryClient]);

  // Get the stock level for a product
  const getStockLevel = (productId: number): number => {
    return productStock[productId] || 0;
  };

  // Update the stock level for a product
  const updateStockLevel = (productId: number, newQuantity: number) => {
    setProductStock(prev => ({
      ...prev,
      [productId]: newQuantity
    }));

    // Update product in cache
    updateProductCache(productId, newQuantity);
    
    // Send update through WebSocket if connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const product = queryClient.getQueryData<Product>([`/api/products/${productId}`]);
      wsRef.current.send(JSON.stringify({
        type: 'client_stock_update',
        productId,
        newQuantity,
        productName: product?.name || 'Product'
      }));
    }
  };

  // Get a status label and color based on stock level
  const stockStatus = (productId: number) => {
    const stockLevel = getStockLevel(productId);
    
    if (stockLevel <= 0) {
      return { 
        label: "Out of Stock", 
        color: "text-red-600",
        icon: "x-circle",
        className: "text-red-600"
      };
    } else if (stockLevel <= 5) {
      return { 
        label: `Only ${stockLevel} left!`, 
        color: "text-red-600",
        icon: "alert-circle",
        className: "text-amber-600 animate-pulse"
      };
    } else if (stockLevel <= 10) {
      return { 
        label: `Low Stock: ${stockLevel} remaining`, 
        color: "text-orange-500",
        icon: "clock",
        className: "text-amber-600"
      };
    } else {
      return { 
        label: "In Stock", 
        color: "text-green-600",
        icon: "check-circle",
        className: "text-green-600"
      };
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        productStock,
        getStockLevel,
        updateStockLevel,
        stockStatus,
        isLoading,
        isConnected
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

// Hook for using the inventory context
export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}