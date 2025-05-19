import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import UserWishlist from "./user-wishlist";
import UserOrders from "./user-orders";
import DashboardHome from "@/components/dashboard/DashboardHome";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CreditCard,
  MapPin,
  User,
  Bell,
  Settings,
  Home,
  ShoppingBag,
  LogOut,
  Heart,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";
import { useUserAddresses, UserAddress } from "@/hooks/use-user-addresses";
import { useUserPaymentMethods, UserPaymentMethod } from "@/hooks/use-user-payment-methods";
import { useUserNotifications } from "@/hooks/use-user-notifications";
import { useUserSettings } from "@/hooks/use-user-settings";
import { useWishlist } from "@/hooks/use-wishlist";
import { AddressCard } from "@/components/user/AddressCard";
import { AddressForm } from "@/components/user/AddressForm";
import { PaymentMethodCard } from "@/components/user/PaymentMethodCard";
import { PaymentMethodForm } from "@/components/user/PaymentMethodForm";
import { NotificationItem } from "@/components/user/NotificationItem";
import { SettingsForm } from "@/components/user/SettingsForm";

const UserDashboard = () => {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();

  const navItems = [
    {
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      href: "/user-dashboard",
      onClick: () => setLocation("/user-dashboard"),
    },
    {
      label: "Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      href: "/user-orders",
      onClick: () => setLocation("/user-orders"),
    },
    {
      label: "Profile",
      icon: <User className="h-5 w-5" />,
      href: "/user-profile",
      onClick: () => setLocation("/user-profile"),
    },
    {
      label: "Wishlist",
      icon: <Heart className="h-5 w-5" />,
      href: "/user-wishlist",
      onClick: () => setLocation("/user-wishlist"),
    },
    {
      label: "Addresses",
      icon: <MapPin className="h-5 w-5" />,
      href: "/user-addresses",
      onClick: () => setLocation("/user-addresses"),
    },
    {
      label: "Payment Methods",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/user-payment-methods",
      onClick: () => setLocation("/user-payment-methods"),
    },
    {
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      href: "/user-notifications",
      onClick: () => setLocation("/user-notifications"),
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/user-settings",
      onClick: () => setLocation("/user-settings"),
    },
  ];

  const isActiveLink = (path: string) => {
    return location === path;
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      });
      // Redirect to home page after logout
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Link href="/auth">
          <Button>Please login to view your account</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Account | DASH</title>
      </Helmet>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-[#D4AF37] text-white">
                        {user.firstName ? user.firstName[0] : user.username[0]}
                        {user.lastName ? user.lastName[0] : ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold">
                        {user.firstName
                          ? `${user.firstName} ${user.lastName || ""}`
                          : user.username}
                      </h2>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <nav className="mt-4 space-y-1">
                    {navItems.map((item) => (
                      <Button
                        key={item.href}
                        variant={isActiveLink(item.href) ? "secondary" : "ghost"}
                        className={`w-full justify-start ${
                          isActiveLink(item.href)
                            ? "bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20"
                            : ""
                        }`}
                        onClick={item.onClick}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                      </Button>
                    ))}
                    <Separator className="my-2" />
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Logout
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Dashboard Page */}
              {(location === "/user-dashboard" || location === "/") && <DashboardHome user={user} />}
              
              {/* Wishlist Page */}
              {location === "/user-wishlist" && <UserWishlist />}
              
              {/* Orders Page */}
              {location === "/user-orders" && <UserOrders />}
              
              {/* Addresses Section */}
              {location === "/user-addresses" && <UserAddressesSection />}
              
              {/* Payment Methods Section */}
              {location === "/user-payment-methods" && <UserPaymentMethodsSection />}
              
              {/* Notifications Section */}
              {location === "/user-notifications" && <UserNotificationsSection />}
              
              {/* Settings Section */}
              {location === "/user-settings" && <UserSettingsSection />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// User Addresses Section Component
const UserAddressesSection = () => {
  const { addresses, isLoading, createAddressMutation, updateAddressMutation, deleteAddressMutation, setDefaultAddressMutation } = useUserAddresses();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  const handleAddNewClick = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: UserAddress) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: number) => {
    deleteAddressMutation.mutate(id);
  };

  const handleSetDefaultAddress = (id: number) => {
    setDefaultAddressMutation.mutate(id);
  };

  const handleSubmitAddress = (data: Partial<UserAddress>) => {
    if (editingAddress) {
      updateAddressMutation.mutate({ id: editingAddress.id, ...data });
    } else {
      createAddressMutation.mutate(data as any);
    }
    setShowAddressForm(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>My Addresses</CardTitle>
              <CardDescription>Manage your delivery addresses</CardDescription>
            </div>
            <Button 
              onClick={handleAddNewClick}
              className="bg-[#D4AF37] hover:bg-[#C09C1F]"
            >
              Add New Address
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={() => handleEditAddress(address)}
                  onDelete={() => handleDeleteAddress(address.id)}
                  onSetDefault={() => handleSetDefaultAddress(address.id)}
                  isDefault={address.isDefault}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <MapPin className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-500">You haven't added any addresses yet.</p>
            </div>
          )}

          {showAddressForm ? (
            <AddressForm
              onSubmit={handleSubmitAddress}
              onCancel={() => setShowAddressForm(false)}
              initialData={editingAddress || undefined}
              isSubmitting={false}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

// User Payment Methods Section Component
const UserPaymentMethodsSection = () => {
  const { paymentMethods, isLoading, createPaymentMethodMutation, updatePaymentMethodMutation, deletePaymentMethodMutation, setDefaultPaymentMethodMutation } = useUserPaymentMethods();
  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<UserPaymentMethod | null>(null);

  const handleAddNewClick = () => {
    setEditingPaymentMethod(null);
    setShowPaymentMethodForm(true);
  };

  const handleEditPaymentMethod = (method: UserPaymentMethod) => {
    setEditingPaymentMethod(method);
    setShowPaymentMethodForm(true);
  };

  const handleDeletePaymentMethod = (id: number) => {
    deletePaymentMethodMutation.mutate(id);
  };

  const handleSetDefaultPaymentMethod = (id: number) => {
    setDefaultPaymentMethodMutation.mutate(id);
  };

  const handleSubmitPaymentMethod = (data: Partial<UserPaymentMethod>) => {
    if (editingPaymentMethod) {
      updatePaymentMethodMutation.mutate({ id: editingPaymentMethod.id, ...data });
    } else {
      createPaymentMethodMutation.mutate(data as any);
    }
    setShowPaymentMethodForm(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </div>
            <Button 
              onClick={handleAddNewClick}
              className="bg-[#D4AF37] hover:bg-[#C09C1F]"
            >
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  paymentMethod={method}
                  onEdit={() => handleEditPaymentMethod(method)}
                  onDelete={() => handleDeletePaymentMethod(method.id)}
                  onSetDefault={() => handleSetDefaultPaymentMethod(method.id)}
                  isDefault={method.isDefault}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-500">You haven't added any payment methods yet.</p>
            </div>
          )}

          {showPaymentMethodForm ? (
            <PaymentMethodForm
              onSubmit={handleSubmitPaymentMethod}
              onCancel={() => setShowPaymentMethodForm(false)}
              initialData={editingPaymentMethod || undefined}
              isSubmitting={false}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

// User Notifications Section Component
const UserNotificationsSection = () => {
  const { notifications, isLoading, markAsReadMutation, deleteNotificationMutation } = useUserNotifications();

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    deleteNotificationMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Your recent notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border-b pb-4">
                  <div className="flex justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-full max-w-md bg-gray-200 rounded"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2 ml-4">
                      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => handleMarkAsRead(notification.id)}
                  onDelete={() => handleDelete(notification.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Bell className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-500">You don't have any notifications yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// User Settings Section Component
const UserSettingsSection = () => {
  const { settings, isLoading, updateSettingsMutation } = useUserSettings();

  const handleSubmit = (data: any) => {
    updateSettingsMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-10 w-full max-w-md bg-gray-200 rounded"></div>
              <div className="h-10 w-full max-w-md bg-gray-200 rounded"></div>
              <div className="h-10 w-full max-w-md bg-gray-200 rounded"></div>
            </div>
          ) : (
            <SettingsForm
              settings={settings}
              onSubmit={handleSubmit}
              isSubmitting={false}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;