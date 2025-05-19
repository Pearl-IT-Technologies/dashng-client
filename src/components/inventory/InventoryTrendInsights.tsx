import React, { useState } from 'react';
import { useInventoryTrends, useInventoryAlerts, useRestockPlan, type ProductTrend } from '@/hooks/use-inventory-trends';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Loader2, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, RefreshCw, Calendar, Image as ImageIcon } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-feedback';
import { format, addDays } from 'date-fns';

interface InventoryTrendInsightsProps {
  className?: string;
  onSelectProduct?: (productId: number) => void;
}

export const InventoryTrendInsights: React.FC<InventoryTrendInsightsProps> = ({ 
  className,
  onSelectProduct
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [timeRange, setTimeRange] = useState<number>(30); // Default to 30 days
  
  // Fetch inventory trend data
  const { 
    data: trendData, 
    isLoading: isTrendsLoading, 
    isError: isTrendsError,
    refetch: refetchTrends
  } = useInventoryTrends({
    categoryFilter,
    daysToPredict: timeRange
  });
  
  // Fetch inventory alerts (products needing attention)
  const {
    data: alertsData,
    isLoading: isAlertsLoading,
    isError: isAlertsError,
    refetch: refetchAlerts
  } = useInventoryAlerts();
  
  // Fetch restock plan
  const {
    data: restockPlan,
    isLoading: isRestockLoading,
    isError: isRestockError,
    refetch: refetchRestockPlan
  } = useRestockPlan();
  
  // Handle refresh of all data
  const handleRefresh = () => {
    refetchTrends();
    refetchAlerts();
    refetchRestockPlan();
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
  
  // Calculate trend summary statistics
  const getTrendSummary = () => {
    if (!trendData) return { rising: 0, stable: 0, declining: 0, total: 0 };
    
    return {
      rising: trendData.filter(item => item.trend === 'rising').length,
      stable: trendData.filter(item => item.trend === 'stable').length,
      declining: trendData.filter(item => item.trend === 'declining').length,
      total: trendData.length
    };
  };
  
  const summary = getTrendSummary();
  
  // Get trend icon based on trend direction
  const getTrendIcon = (trend: 'rising' | 'stable' | 'declining') => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Get confidence level color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-blue-500';
    return 'bg-yellow-500';
  };
  
  // Render days until stockout with appropriate colors
  const renderDaysUntilStockout = (days: number) => {
    if (days <= 7) {
      return <span className="text-red-500 font-medium">{days} days</span>;
    } else if (days <= 14) {
      return <span className="text-yellow-500 font-medium">{days} days</span>;
    } else if (days <= 30) {
      return <span className="text-blue-500 font-medium">{days} days</span>;
    } else {
      return <span className="text-green-500 font-medium">{days} days</span>;
    }
  };
  
  // Calculate the date when stockout is predicted
  const getStockoutDate = (daysUntilStockout: number) => {
    const date = addDays(new Date(), daysUntilStockout);
    return format(date, 'MMM d, yyyy');
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Smart Inventory Trend Predictor</CardTitle>
            <CardDescription>
              AI-powered insights to optimize your inventory management
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="trends" className="w-full">
        <div className="px-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts
              {alertsData && alertsData.length > 0 && (
                <Badge variant="destructive" className="ml-2">{alertsData.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="restock">Restock Plan</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Trend Analysis Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="flex justify-between items-center px-6">
            <div className="flex items-center gap-2">
              <Select value={categoryFilter || 'all'} onValueChange={(value) => setCategoryFilter(value === 'all' ? undefined : value)}>
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
              
              <Select value={timeRange.toString()} onValueChange={(value) => setTimeRange(parseInt(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Prediction Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Next 7 days</SelectItem>
                  <SelectItem value="14">Next 14 days</SelectItem>
                  <SelectItem value="30">Next 30 days</SelectItem>
                  <SelectItem value="60">Next 60 days</SelectItem>
                  <SelectItem value="90">Next 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Rising: {summary.rising}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Stable: {summary.stable}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Declining: {summary.declining}</span>
              </div>
            </div>
          </div>
          
          <CardContent className="p-0">
            {isTrendsLoading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : isTrendsError ? (
              <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <p className="text-lg font-medium">Failed to load trend data</p>
                <Button variant="outline" onClick={handleRefresh}>Try Again</Button>
              </div>
            ) : trendData && trendData.length > 0 ? (
              <div className="overflow-auto max-h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background border-b">
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Sales Velocity</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Days Until Stockout</TableHead>
                      <TableHead>Restock Recommendation</TableHead>
                      <TableHead>Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trendData.map((item) => (
                      <TableRow key={item.productId} className="cursor-pointer hover:bg-muted/50" onClick={() => onSelectProduct?.(item.productId)}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-md border bg-muted relative overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50">
                                <ImageIcon className="h-5 w-5" />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.brand}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.currentStock}
                          <div className="text-xs text-muted-foreground">{item.currentStock <= 5 ? 'Low Stock' : 'In Stock'}</div>
                        </TableCell>
                        <TableCell>
                          {item.salesVelocity} units/day
                          {item.seasonalImpact !== 0 && (
                            <div className="text-xs text-muted-foreground">
                              {item.seasonalImpact > 0 ? (
                                <span className="text-green-500">+{(item.seasonalImpact * 100).toFixed(0)}% seasonal boost</span>
                              ) : (
                                <span className="text-red-500">{(item.seasonalImpact * 100).toFixed(0)}% seasonal decline</span>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(item.trend)}
                            <span className="capitalize">{item.trend}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {renderDaysUntilStockout(item.daysUntilStockout)}
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{getStockoutDate(item.daysUntilStockout)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.restockRecommendation > 0 ? (
                            <span className="font-medium">{item.restockRecommendation} units</span>
                          ) : (
                            <span className="text-green-500">No restock needed</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={item.confidence * 100} 
                              className={`h-2 w-16 ${getConfidenceColor(item.confidence)}`} 
                            />
                            <span>{Math.round(item.confidence * 100)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-[300px]">
                <p className="text-lg font-medium text-muted-foreground">No trend data available</p>
                <p className="text-sm text-muted-foreground mt-1">Try changing the category filter</p>
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <CardContent className="p-0">
            {isAlertsLoading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : isAlertsError ? (
              <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <p className="text-lg font-medium">Failed to load alerts</p>
                <Button variant="outline" onClick={handleRefresh}>Try Again</Button>
              </div>
            ) : alertsData && alertsData.length > 0 ? (
              <div className="space-y-4 p-6">
                <h3 className="text-lg font-medium">Products Requiring Attention</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {alertsData.map((alert) => (
                    <AnimatedCard 
                      key={alert.productId}
                      className="overflow-hidden cursor-pointer hover:border-primary/50"
                      onClick={() => onSelectProduct?.(alert.productId)}
                    >
                      <div className={`h-1 w-full ${alert.daysUntilStockout <= 7 ? 'bg-red-500' : alert.daysUntilStockout <= 14 ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-md border bg-muted relative overflow-hidden flex-shrink-0">
                              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50">
                                <ImageIcon className="h-6 w-6" />
                              </div>
                            </div>
                            <div>
                              <h4 className="text-base font-medium">{alert.name}</h4>
                              <p className="text-sm text-muted-foreground">{alert.brand} • {alert.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(alert.trend)}
                            <Badge variant={alert.daysUntilStockout <= 7 ? 'destructive' : 'outline'}>
                              {alert.daysUntilStockout} days left
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Current Stock</p>
                            <p className="font-medium">{alert.currentStock} units</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Sales Velocity</p>
                            <p className="font-medium">{alert.salesVelocity} units/day</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Predicted Stockout</p>
                            <p className="font-medium">{getStockoutDate(alert.daysUntilStockout)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Recommended Restock</p>
                            <p className="font-medium text-primary">{alert.restockRecommendation} units</p>
                          </div>
                        </div>
                      </CardContent>
                    </AnimatedCard>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-[300px]">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-lg font-medium mt-4">No urgent inventory alerts</p>
                <p className="text-sm text-muted-foreground mt-1">All products are within safe stock levels</p>
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        {/* Restock Plan Tab */}
        <TabsContent value="restock">
          <CardContent className="p-6">
            {isRestockLoading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : isRestockError ? (
              <div className="flex flex-col justify-center items-center h-[300px] gap-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <p className="text-lg font-medium">Failed to load restock plan</p>
                <Button variant="outline" onClick={handleRefresh}>Try Again</Button>
              </div>
            ) : restockPlan ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatedCard>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Items to Restock</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{restockPlan.totalItems}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {restockPlan.recommendations.length} different products
                      </p>
                    </CardContent>
                  </AnimatedCard>
                  
                  <AnimatedCard>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Estimated Cost</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{formatCurrency(restockPlan.totalEstimatedCost)}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on wholesale prices
                      </p>
                    </CardContent>
                  </AnimatedCard>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Recommended Products to Restock</h3>
                  
                  {restockPlan.recommendations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Current Stock</TableHead>
                          <TableHead>Trend</TableHead>
                          <TableHead>Restock Amount</TableHead>
                          <TableHead>Confidence</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {restockPlan.recommendations.map((item) => (
                          <TableRow 
                            key={item.productId}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => onSelectProduct?.(item.productId)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-md border bg-muted relative overflow-hidden">
                                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50">
                                    <ImageIcon className="h-5 w-5" />
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-sm text-muted-foreground">{item.brand}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{item.currentStock}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getTrendIcon(item.trend)}
                                <span className="capitalize">{item.trend}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{item.restockRecommendation} units</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={item.confidence * 100} 
                                  className={`h-2 w-16 ${getConfidenceColor(item.confidence)}`} 
                                />
                                <span>{Math.round(item.confidence * 100)}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-col justify-center items-center h-[200px] border rounded-md">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <p className="text-lg font-medium mt-2">No restock needed</p>
                      <p className="text-sm text-muted-foreground mt-1">All products have sufficient inventory</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-[300px]">
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium mt-4">No restock plan available</p>
                <Button variant="outline" onClick={handleRefresh} className="mt-4">Generate Restock Plan</Button>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t p-6">
        <div className="text-sm text-muted-foreground">
          Predictions based on last 90 days of sales data
        </div>
        <div className="text-sm flex items-center gap-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Updated {format(new Date(), 'MMM d, yyyy')}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InventoryTrendInsights;