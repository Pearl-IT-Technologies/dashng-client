import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from './use-auth';

// Types
export type UserSettings = {
  _id: string;
  user: string;
  email: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  push: {
    orderUpdates: boolean;
    promotions: boolean;
    stockAlerts: boolean;
  };
  sms: {
    orderUpdates: boolean;
    promotions: boolean;
  };
  display: {
    darkMode: boolean;
    language: string;
    currency: string;
  };
  privacy: {
    shareDataWithPartners: boolean;
    allowLocationTracking: boolean;
  };
  lowStockAlerts?: boolean;
  stockUpdateNotifications?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserSettingsUpdate = Omit<UserSettings, '_id' | 'user' | 'createdAt' | 'updatedAt'>;

export const useUserSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user settings
  const {
    data: settings,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/users/settings'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: UserSettings }>('/users/settings');
      return response.data;
    },
    enabled: !!user, // Only fetch if user is authenticated
  });

  // Update user settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: UserSettingsUpdate) => {
      const response = await api.put<{ success: boolean; data: UserSettings }>('/users/settings', newSettings);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch settings query
      queryClient.invalidateQueries({ queryKey: ['/users/settings'] });
    }
  });

  // Simplify the mutation function for easier use
  const updateSettings = async (newSettings: UserSettingsUpdate) => {
    await updateSettingsMutation.mutateAsync(newSettings);
  };

  // Provide specific update functions for storekeeper settings
  const updateStorekeeperSettings = async ({ 
    lowStockAlerts, 
    stockUpdateNotifications 
  }: { 
    lowStockAlerts?: boolean; 
    stockUpdateNotifications?: boolean 
  }) => {
    if (!settings) return;
    
    const updatedSettings = {
      ...settings,
      lowStockAlerts: lowStockAlerts !== undefined ? lowStockAlerts : settings.lowStockAlerts,
      stockUpdateNotifications: stockUpdateNotifications !== undefined 
        ? stockUpdateNotifications 
        : settings.stockUpdateNotifications
    };
    
    await updateSettingsMutation.mutateAsync(updatedSettings);
  };

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    updateStorekeeperSettings,
    isUpdating: updateSettingsMutation.isPending,
    refetch
  };
};