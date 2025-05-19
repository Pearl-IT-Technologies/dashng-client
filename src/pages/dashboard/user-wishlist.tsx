import { useWishlist } from "@/hooks/use-wishlist";
import { useLocation } from "wouter";
import { Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UserWishlist = () => {
  const { wishlistItems, isLoading, toggleWishlistItem } = useWishlist();
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-purple-500" />
            My Wishlist
          </CardTitle>
          <CardDescription>
            Items you've saved for later
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-md p-4 h-64">
                  <Skeleton className="h-32 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : wishlistItems && wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistItems.map((item: any) => (
                <div key={item.id} className="border rounded-md overflow-hidden flex flex-col h-full">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {item.product?.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Package className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-medium line-clamp-2 mb-1">
                      {item.product?.name || "Product Name"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1 line-clamp-1">
                      {item.product?.brand || "Brand"}
                    </p>
                    <p className="font-bold mb-3 mt-auto">
                      ₦{item.product?.price?.toLocaleString() || '0'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full"
                        onClick={() => setLocation(`/products/${item.product?.id}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="w-full bg-[#D4AF37] hover:bg-[#C09A27]"
                        onClick={() => toggleWishlistItem(item.productId, item.product?.name)}
                      >
                        <Heart className="mr-1 h-4 w-4 fill-current" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">
                Items added to your wishlist will appear here
              </p>
              <Button 
                onClick={() => setLocation("/products")}
                className="bg-[#D4AF37] hover:bg-[#C09A27]"
              >
                Browse Products
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserWishlist;