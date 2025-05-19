import { Helmet } from "react-helmet";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useUserSettings } from "@/hooks/use-user-settings";
import { SettingsForm } from "@/components/user/SettingsForm";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const { settings, isLoading, updateSettingsMutation } = useUserSettings();
  
  // Handle settings form submit
  const handleSubmit = (data: any) => {
    updateSettingsMutation.mutate(data, {
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
  
  const getBackPath = () => {
    if (user?.adminRole === 'storekeeper') {
      return '/admin/staff';
    } else if (user?.adminRole === 'sales') {
      return '/admin/staff';
    } else if (user?.adminRole === 'super') {
      return '/admin/super';
    } else {
      return '/admin/dashboard';
    }
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
            onClick={() => setLocation(getBackPath())}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
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
                    {user?.isSuperAdmin 
                      ? "Super Admin" 
                      : user?.isMasterAdmin 
                      ? "Master Admin" 
                      : user?.adminRole === 'storekeeper'
                      ? "Store Keeper"
                      : user?.adminRole === 'sales'
                      ? "Sales Personnel"
                      : "Administrator"}
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