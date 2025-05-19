import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface UserSetting {
  id: number;
  userId: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  appNotifications: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
  promotionAlerts: boolean;
  theme: "light" | "dark" | "system";
  language: string;
  createdAt: string;
  updatedAt: string;
}

export type SettingsUpdateData = Partial<Omit<UserSetting, "id" | "userId" | "createdAt" | "updatedAt">>;

export function useUserSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch user settings
  const { data: settings, isLoading, error } = useQuery<UserSetting>({
    queryKey: ["/api/users/user-settings"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/users/user-settings");
      if (!response.ok) {
        throw new Error("Failed to fetch user settings");
      }
      return response.json();
    },
  });

  // Update user settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData: SettingsUpdateData) => {
      const response = await apiRequest("PATCH", "/api/users/user-settings", settingsData);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update settings");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/user-settings"] });
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettingsMutation,
  };
}