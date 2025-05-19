// @ts-nocheck
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
  ArrowUpRight, 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Heart, 
  Star, 
  Zap,
  Calendar
} from "lucide-react";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { formatPrice } from "@/lib/utils";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface PersonalizedInsightsWidgetProps {
  userId: number;
}

const PersonalizedInsightsWidget: React.FC<PersonalizedInsightsWidgetProps> = ({ userId }) => {
  const [_, setLocation] = useLocation();

  // Fetch personalized insights
  const { data: insights, isLoading: isInsightsLoading } = useQuery({
    queryKey: ['/api/user/insights', userId],
    enabled: !!userId,
  });

  // Fetch personalized recommendations
  const { data: recommendations, isLoading: isRecommendationsLoading } = useQuery({
    queryKey: ['/api/recommendations', { userId }],
    enabled: !!userId,
  });

  // Fetch user activity stats
  const { data: activityStats, isLoading: isActivityLoading } = useQuery({
    queryKey: ['/api/user/activity', userId],
    enabled: !!userId,
  });

  const purchaseHistoryData = {
    labels: insights?.categoryBreakdown?.map(item => item.category) || [],
    datasets: [
      {
        label: 'Purchase Frequency',
        data: insights?.categoryBreakdown?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(212, 175, 55, 0.6)',  // Gold
          'rgba(102, 103, 171, 0.6)', // Blue-purple
          'rgba(85, 166, 48, 0.6)',   // Green
          'rgba(173, 73, 74, 0.6)',   // Red
          'rgba(109, 158, 235, 0.6)',  // Light blue
        ],
        borderColor: [
          'rgba(212, 175, 55, 1)',
          'rgba(102, 103, 171, 1)',
          'rgba(85, 166, 48, 1)',
          'rgba(173, 73, 74, 1)',
          'rgba(109, 158, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlySpendingData = {
    labels: activityStats?.monthlySpendings?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Amount Spent',
        data: activityStats?.monthlySpendings?.map(item => item.amount) || [],
        backgroundColor: 'rgba(212, 175, 55, 0.6)',
        borderColor: 'rgba(212, 175, 55, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate days since last purchase
  const daysSinceLastPurchase = activityStats?.lastPurchaseDate 
    ? Math.floor((new Date().getTime() - new Date(activityStats.lastPurchaseDate).getTime()) / (1000 * 3600 * 24)) 
    : null;
    
  // Calculate loyalty level based on total spending or points
  const getLoyaltyLevel = () => {
    const totalSpent = activityStats?.totalSpent || 0;
    
    if (totalSpent > 500000) return { level: "Diamond", progress: 100 };
    if (totalSpent > 250000) return { level: "Platinum", progress: 85 };
    if (totalSpent > 100000) return { level: "Gold", progress: 60 };
    if (totalSpent > 50000) return { level: "Silver", progress: 40 };
    return { level: "Bronze", progress: 20 };
  };
  
  const loyaltyInfo = getLoyaltyLevel();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Personalized Insights</h2>
        <Button 
          variant="outline"
          className="text-sm gap-1"
          onClick={() => setLocation("/personalized-dashboard")}
        >
          <span>View All</span> 
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Insights Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {/* Widget 1: Purchase History Breakdown */}
          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Shopping Preferences</CardTitle>
                <CardDescription>Category breakdown of your purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {isInsightsLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <Skeleton className="h-40 w-40 rounded-full" />
                  </div>
                ) : insights?.categoryBreakdown && insights.categoryBreakdown.length > 0 ? (
                  <div className="h-48 flex justify-center">
                    <Doughnut data={purchaseHistoryData} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Make purchases to see your shopping preferences</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="link" 
                  className="w-full text-sm text-[#D4AF37]"
                  onClick={() => setLocation("/user-orders")}
                >
                  View Purchase History
                </Button>
              </CardFooter>
            </Card>
          </CarouselItem>

          {/* Widget 2: Spending Trends */}
          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Spending Trends</CardTitle>
                <CardDescription>Monthly spending analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {isActivityLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-48 w-full" />
                  </div>
                ) : activityStats?.monthlySpendings && activityStats.monthlySpendings.length > 0 ? (
                  <div className="h-48">
                    <Bar options={barOptions} data={monthlySpendingData} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <TrendingUp className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Not enough purchase data to show trends</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between text-xs text-gray-500">
                {activityStats?.totalSpent ? (
                  <>
                    <div>Total Spent: <span className="font-semibold">{formatPrice(activityStats.totalSpent)}</span></div>
                    <div>Avg Order: <span className="font-semibold">{formatPrice(activityStats.averageOrderValue || 0)}</span></div>
                  </>
                ) : (
                  <div className="w-full text-center">Make purchases to see spending analysis</div>
                )}
              </CardFooter>
            </Card>
          </CarouselItem>

          {/* Widget 3: Personal Stats & Badges */}
          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Stats & Achievements</CardTitle>
                <CardDescription>Your shopping milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isActivityLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Loyalty Status</span>
                        <Badge variant="outline" className="bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20">
                          {loyaltyInfo.level}
                        </Badge>
                      </div>
                      <Progress value={loyaltyInfo.progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {loyaltyInfo.level === "Diamond" 
                          ? "You've reached our highest tier!" 
                          : `${formatPrice(activityStats?.nextLoyaltyThreshold || 0)} more to reach next level`}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs">Orders</span>
                        <span className="font-semibold">{activityStats?.totalOrders || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs">Wishlisted</span>
                        <span className="font-semibold">{activityStats?.wishlistCount || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs">Reviews</span>
                        <span className="font-semibold">{activityStats?.reviewCount || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs">Last Purchase</span>
                        <span className="font-semibold">
                          {daysSinceLastPurchase !== null 
                            ? `${daysSinceLastPurchase} days ago` 
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="link" 
                  className="w-full text-sm text-[#D4AF37]"
                  onClick={() => setLocation("/loyalty-program")}
                >
                  View Loyalty Benefits
                </Button>
              </CardFooter>
            </Card>
          </CarouselItem>

          {/* Widget 4: Personalized Product Recommendations */}
          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recommended For You</CardTitle>
                <CardDescription>Based on your shopping history</CardDescription>
              </CardHeader>
              <CardContent>
                {isRecommendationsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex space-x-3">
                        <Skeleton className="h-14 w-14" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recommendations && recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.slice(0, 3).map((product: any) => (
                      <div 
                        key={product.id} 
                        className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors"
                        onClick={() => setLocation(`/product/${product.id}`)}
                      >
                        <div className="h-14 w-14 bg-gray-100 rounded overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium truncate">{product.name}</h4>
                          <div className="flex items-center text-sm mt-1">
                            <span className="font-medium text-[#D4AF37]">
                              {formatPrice(product.discountPrice || product.price)}
                            </span>
                            {product.discountPrice && (
                              <span className="ml-2 text-xs text-gray-500 line-through">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Zap className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Add items to your cart or wishlist to get personalized recommendations</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="link" 
                  className="w-full text-sm text-[#D4AF37]"
                  onClick={() => setLocation("/products?recommended=true")}
                >
                  View All Recommendations
                </Button>
              </CardFooter>
            </Card>
          </CarouselItem>

          {/* Widget 5: Upcoming Sales & Events */}
          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Sales & Events</CardTitle>
                <CardDescription>Sales calendar for your favorite items</CardDescription>
              </CardHeader>
              <CardContent>
                {isInsightsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex space-x-3">
                        <Skeleton className="h-10 w-10" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : insights?.upcomingEvents && insights.upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {insights.upcomingEvents.map((event: any, index: number) => (
                      <div key={index} className="flex space-x-3">
                        <div className="h-12 w-12 bg-gray-100 rounded-md flex flex-col items-center justify-center flex-shrink-0">
                          <Calendar className="h-6 w-6 text-[#D4AF37]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{event.name}</h4>
                          <p className="text-xs text-gray-500">{formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
                          <p className="text-xs mt-1">
                            {event.discountPercentage && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mr-2">
                                {event.discountPercentage}% OFF
                              </Badge>
                            )}
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Calendar className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">No upcoming sales events at the moment</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="link" 
                  className="w-full text-sm text-[#D4AF37]"
                  onClick={() => setLocation("/sales-calendar")}
                >
                  View Complete Calendar
                </Button>
              </CardFooter>
            </Card>
          </CarouselItem>

          {/* Widget 6: Wishlist Items on Sale */}
          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Wishlist Items on Sale</CardTitle>
                <CardDescription>Don't miss these discounts</CardDescription>
              </CardHeader>
              <CardContent>
                {isInsightsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex space-x-3">
                        <Skeleton className="h-14 w-14" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : insights?.wishlistItemsOnSale && insights.wishlistItemsOnSale.length > 0 ? (
                  <div className="space-y-3">
                    {insights.wishlistItemsOnSale.map((item: any) => (
                      <div 
                        key={item.id} 
                        className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition-colors"
                        onClick={() => setLocation(`/product/${item.id}`)}
                      >
                        <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden relative">
                          {item.images && item.images.length > 0 ? (
                            <img 
                              src={item.images[0]} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Heart className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl">
                            {item.discountPercentage}%
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <div className="flex items-center text-sm mt-1">
                            <span className="font-medium text-[#D4AF37]">
                              {formatPrice(item.discountPrice)}
                            </span>
                            <span className="ml-2 text-xs text-gray-500 line-through">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.daysRemaining > 0 
                              ? `Sale ends in ${item.daysRemaining} days` 
                              : "Sale ends today!"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Heart className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">No wishlist items are currently on sale</p>
                    <Button 
                      variant="link" 
                      className="mt-2 text-sm"
                      onClick={() => setLocation("/products")}
                    >
                      Browse Products
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="link" 
                  className="w-full text-sm text-[#D4AF37]"
                  onClick={() => setLocation("/user-wishlist")}
                >
                  View Your Wishlist
                </Button>
              </CardFooter>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <div className="flex items-center justify-center mt-4">
          <CarouselPrevious className="static transform-none mr-2" />
          <CarouselNext className="static transform-none" />
        </div>
      </Carousel>
    </div>
  );
};

export default PersonalizedInsightsWidget;