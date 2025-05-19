import { useState } from "react";
import { UserNotification } from "@/hooks/use-user-notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AlertCircle, 
  Bell, 
  Check, 
  ExternalLink, 
  Package, 
  ShoppingBag, 
  Tag, 
  Trash2 
} from "lucide-react";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface NotificationItemProps {
  notification: UserNotification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Format the date to be relative (e.g., "2 hours ago")
  const formattedDate = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  // Get the appropriate icon based on notification type
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "order":
        return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case "shipping":
        return <Package className="h-5 w-5 text-green-500" />;
      case "promotion":
        return <Tag className="h-5 w-5 text-purple-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Handle click on notification
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }

    // Navigate to related page if there's an action URL
    if (notification.actionUrl) {
      setLocation(notification.actionUrl);
    }
  };

  return (
    <Card 
      className={`mb-3 transition-all duration-200 ${
        notification.isRead ? "bg-white" : "bg-blue-50"
      } ${isHovered ? "shadow-md" : "shadow-sm"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="mr-3 mt-1">{getNotificationIcon()}</div>
          
          <div className="flex-grow" onClick={handleClick}>
            <div className="flex items-center justify-between">
              <h3 className={`font-medium ${notification.isRead ? "" : "font-semibold"}`}>
                {notification.title}
              </h3>
              <span className="text-xs text-gray-500 ml-2">{formattedDate}</span>
            </div>
            
            <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
            
            {notification.actionUrl && (
              <div className="mt-2">
                <Button variant="link" className="h-auto p-0 text-sm text-[#D4AF37]">
                  View details
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="ml-2 flex flex-col space-y-2">
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onMarkAsRead(notification.id)}
                title="Mark as read"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500"
              onClick={() => onDelete(notification.id)}
              title="Delete notification"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}