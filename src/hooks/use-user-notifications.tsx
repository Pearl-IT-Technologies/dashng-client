import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface UserNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'order' | 'shipping' | 'promotion' | 'alert' | 'other';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export function useUserNotifications() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch all notifications for the current user
  const { data: notifications = [], isLoading, error } = useQuery<UserNotification[]>({
    queryKey: ["/api/notifications/user-notifications"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/notifications/user-notifications");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      return response.json();
    },
  });

  // Calculate number of unread notifications
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // Mark a notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await apiRequest("PATCH", `/api/notifications/user-notifications/${notificationId}/read`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to mark notification as read");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/user-notifications"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update notification. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete a notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await apiRequest("DELETE", `/api/notifications/user-notifications/${notificationId}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete notification");
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/user-notifications"] });
      toast({
        title: "Notification Deleted",
        description: "The notification has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete notification. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/notifications/user-notifications/mark-all-read");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to mark all notifications as read");
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/user-notifications"] });
      toast({
        title: "All Notifications Read",
        description: "All notifications have been marked as read.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update notifications. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsReadMutation,
    deleteNotificationMutation,
    markAllAsReadMutation,
  };
}