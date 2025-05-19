import { Helmet } from "react-helmet";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useUserSettings, SettingsUpdateData } from "@/hooks/use-user-settings";
import { SettingsForm } from "@/components/user/SettingsForm";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function StorekeeperSettings() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const { settings, isLoading, updateSettingsMutation } = useUserSettings();
  
  // Handle settings form submit
  const handleSubmit = (data: SettingsUpdateData) => {
    // Make sure to include any storekeeper-specific settings
    const updatedData: SettingsUpdateData = {
      ...data
    };
    
    updateSettingsMutation.mutate(updatedData, {
      onSuccess: () => {
        toast({
          title: "Settings updated",
          description: "Your account settings have been saved successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update settings. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Account Settings | DASH</title>
      </Helmet>
      
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => setLocation("/admin/staff")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Storekeeper Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and notification settings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                View and update your account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Username</label>
                    <div className="mt-1 p-2 border rounded bg-muted/50">
                      {user?.username || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <div className="mt-1 p-2 border rounded bg-muted/50">
                      {user?.email || "N/A"}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <div className="mt-1 p-2 border rounded bg-muted/50">
                      {user?.firstName || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <div className="mt-1 p-2 border rounded bg-muted/50">
                      {user?.lastName || "N/A"}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <div className="mt-1 p-2 border rounded bg-muted/50">
                    Storekeeper
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Inventory Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Settings</CardTitle>
              <CardDescription>
                Configure your inventory management preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border rounded p-3">
                  <div>
                    <h3 className="font-medium">Low Stock Alerts</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications when products are running low</p>
                  </div>
                  <div className="flex items-center">
                    <Switch 
                      checked={Boolean(settings?.lowStockAlerts)}
                      onCheckedChange={(checked) => {
                        const updateData: SettingsUpdateData = {
                          lowStockAlerts: checked
                        };
                        updateSettingsMutation.mutate(updateData);
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between border rounded p-3">
                  <div>
                    <h3 className="font-medium">Stock Update Notifications</h3>
                    <p className="text-sm text-muted-foreground">Get notified of inventory changes in real-time</p>
                  </div>
                  <div className="flex items-center">
                    <Switch 
                      checked={Boolean(settings?.stockUpdateNotifications)}
                      onCheckedChange={(checked) => {
                        const updateData: SettingsUpdateData = {
                          stockUpdateNotifications: checked
                        };
                        updateSettingsMutation.mutate(updateData);
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Control how you receive notifications and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <SettingsForm
                  settings={settings}
                  onSubmit={handleSubmit}
                  isSubmitting={updateSettingsMutation.isPending}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}