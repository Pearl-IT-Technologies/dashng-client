import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export interface ProductTrend {
  productId: number;
  name: string;
  brand: string;
  category: string;
  currentStock: number;
  salesVelocity: number; // Units sold per day
  daysUntilStockout: number;
  restockRecommendation: number;
  confidence: number; // 0-1 score of prediction confidence
  trend: 'rising' | 'stable' | 'declining';
  seasonalImpact: number; // -1 to 1 (negative means seasonal decline, positive means seasonal boost)
}

export interface RestockPlan {
  totalItems: number;
  totalEstimatedCost: number;
  recommendations: ProductTrend[];
}

export interface TrendQueryOptions {
  categoryFilter?: string;
  daysToPredict?: number;
  minConfidence?: number;
  includeProducts?: number[];
  excludeProducts?: number[];
  enabled?: boolean;
}

/**
 * Hook to fetch inventory trends
 */
export function useInventoryTrends(options: TrendQueryOptions = {}) {
  const { 
    categoryFilter,
    daysToPredict,
    minConfidence,
    includeProducts,
    excludeProducts,
    enabled = true
  } = options;
  
  // Build query parameters
  const queryParams = new URLSearchParams();
  if (categoryFilter) queryParams.append('category', categoryFilter);
  if (daysToPredict) queryParams.append('days', daysToPredict.toString());
  if (minConfidence) queryParams.append('minConfidence', minConfidence.toString());
  if (includeProducts && includeProducts.length > 0) {
    queryParams.append('includeProducts', JSON.stringify(includeProducts));
  }
  if (excludeProducts && excludeProducts.length > 0) {
    queryParams.append('excludeProducts', JSON.stringify(excludeProducts));
  }
  
  const queryString = queryParams.toString();
  const endpoint = `/api/products/inventory/trends${queryString ? `?${queryString}` : ''}`;
  
  return useQuery<ProductTrend[], Error>({
    queryKey: ['/api/products/inventory/trends', categoryFilter, daysToPredict, minConfidence],
    queryFn: async () => {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory trends');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
}

/**
 * Hook to fetch inventory alerts (products needing attention)
 */
export function useInventoryAlerts() {
  return useQuery<ProductTrend[], Error>({
    queryKey: ['/api/products/inventory/alerts'],
    queryFn: async () => {
      const response = await fetch('/api/products/inventory/alerts');
      if (!response.ok) {
        throw new Error('Failed to fetch inventory alerts');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

/**
 * Hook to fetch restock plan
 */
export function useRestockPlan() {
  return useQuery<RestockPlan, Error>({
    queryKey: ['/api/products/inventory/restock-plan'],
    queryFn: async () => {
      const response = await fetch('/api/products/inventory/restock-plan');
      if (!response.ok) {
        throw new Error('Failed to fetch restock plan');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

/**
 * Force refresh all inventory trend data
 */
export function refreshInventoryTrendData() {
  queryClient.invalidateQueries({ queryKey: ['/api/products/inventory/trends'] });
  queryClient.invalidateQueries({ queryKey: ['/api/products/inventory/alerts'] });
  queryClient.invalidateQueries({ queryKey: ['/api/products/inventory/restock-plan'] });
}