import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Calendar
} from "lucide-react";

interface ShipmentEvent {
  status: string;
  description: string;
  location?: string;
  timestamp: string;
}

interface ShipmentTrackerProps {
  trackingNumber: string;
  courierName?: string;
  courierTrackingUrl?: string;
}

const ShipmentTracker = ({
  trackingNumber,
  courierName,
  courierTrackingUrl,
}: ShipmentTrackerProps) => {
  const { toast } = useToast();
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch shipment data
  const {
    data: shipment,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/shipments", trackingNumber],
    queryFn: async () => {
      if (!trackingNumber) return null;

      try {
        const res = await fetch(`/api/shipments/${trackingNumber}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(
              "Shipment not found. Please check the tracking number and try again."
            );
          }
          throw new Error("Failed to fetch shipment data");
        }
        return await res.json();
      } catch (error) {
        throw error;
      }
    },
    enabled: !!trackingNumber,
  });

  // Determine the current status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Processing
          </Badge>
        );
      case "in_transit":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            In Transit
          </Badge>
        );
      case "out_for_delivery":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Out for Delivery
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Delivered
          </Badge>
        );
      case "failed_delivery":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Failed Delivery
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipment Tracking</CardTitle>
          <CardDescription>
            Loading tracking information...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipment Tracking</CardTitle>
          <CardDescription>
            Tracking number: {trackingNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md bg-red-50">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">Error retrieving shipment information</p>
            </div>
            <p className="mt-2 text-sm text-red-600">
              {error instanceof Error ? error.message : "Unknown error occurred"}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-4"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!shipment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipment Tracking</CardTitle>
          <CardDescription>
            Tracking number: {trackingNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md bg-yellow-50">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">No tracking information available</p>
            </div>
            <p className="mt-2 text-sm text-yellow-600">
              The tracking information for this shipment is not available yet.
              Please check back later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Shipment Tracking</CardTitle>
            <CardDescription>
              {courierName || "Courier"} | Tracking #: {trackingNumber}
            </CardDescription>
          </div>
          {getStatusBadge(shipment.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-[#D4AF37]" />
                <p className="font-medium">
                  {shipment.estimatedDelivery
                    ? format(new Date(shipment.estimatedDelivery), "MMM d, yyyy")
                    : "Not available"}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Current Location</p>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#D4AF37]" />
                <p className="font-medium">
                  {shipment.currentLocation || "Updating..."}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tracking progress */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Tracking Progress</h3>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200" />
              
              {/* Events */}
              <div className="space-y-6">
                {(shipment.events || []).slice(0, 3).map((event: ShipmentEvent, index: number) => (
                  <div key={index} className="relative flex gap-4">
                    <div className="absolute left-0 mt-1 w-5 h-5 rounded-full bg-white border-2 border-[#D4AF37]" />
                    <div className="flex flex-col pl-8">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{event.status}</p>
                        <Badge variant="outline" className="ml-2">
                          {format(new Date(event.timestamp), "MMM d, h:mm a")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {(shipment.events || []).length > 3 && (
              <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Full Tracking History
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Tracking History</DialogTitle>
                    <DialogDescription>
                      {courierName || "Courier"} | Tracking #: {trackingNumber}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-[60vh] overflow-y-auto">
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200" />
                      
                      {/* Events */}
                      <div className="space-y-6">
                        {(shipment.events || []).map((event: ShipmentEvent, index: number) => (
                          <div key={index} className="relative flex gap-4">
                            <div className="absolute left-0 mt-1 w-5 h-5 rounded-full bg-white border-2 border-[#D4AF37]" />
                            <div className="flex flex-col pl-8">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{event.status}</p>
                                <Badge variant="outline" className="ml-2">
                                  {format(new Date(event.timestamp), "MMM d, h:mm a")}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {event.description}
                              </p>
                              {event.location && (
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* External tracking link */}
          {courierTrackingUrl && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(courierTrackingUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Track on {courierName || "Courier"} Website
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentTracker;