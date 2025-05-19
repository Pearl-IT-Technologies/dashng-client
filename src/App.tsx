//@ts-nocheck

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Helmet } from "react-helmet";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { InventoryProvider } from "@/hooks/use-inventory";
import { GuestCartProvider } from "@/hooks/use-guest-cart";
import { WelcomeAnimationProvider } from "@/hooks/use-welcome-animation";
import { useAnimatedToast } from "@/hooks/use-animated-toast";
import { ProtectedRoute } from "@/lib/protected-route";
import { ThemeProvider } from "@/lib/theme-provider";
import WelcomeAnimation from "@/components/auth/WelcomeAnimation";
import ScrollToTop from "@/components/ui/ScrollToTop";
import RealTimeUpdates from "@/components/RealTimeUpdates";
import React, { lazy, Suspense } from "react";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProductsPage from "@/pages/products-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CartPage from "@/pages/cart-page";
import CheckoutPage from "@/pages/checkout-page";
import OrderTrackingPage from "@/pages/order-tracking-page";
import OrderSuccessPage from "@/pages/order-success-page";
import BrandsPage from "@/pages/brands-page";

// Info pages
import AboutPage from "@/pages/info/about";
import ContactPage from "@/pages/info/contact";
import FAQsPage from "@/pages/info/faqs";
import ShippingReturnsPage from "@/pages/info/shipping-returns";
import OrderTrackingInfoPage from "@/pages/info/order-tracking";
import PaymentMethodsPage from "@/pages/info/payment-methods";
import CareersPage from "@/pages/info/careers";
import PrivacyPolicyPage from "@/pages/info/privacy-policy";
import TermsPage from "@/pages/info/terms";
import SustainabilityPage from "@/pages/info/sustainability";
import AdminDashboard from "@/pages/dashboard/admin-dashboard";
import AdminProducts from "@/pages/dashboard/admin-products";
import AdminProductForm from "@/pages/dashboard/admin-product-form";
import AdminOrders from "@/pages/dashboard/admin-orders";
import AdminCustomers from "@/pages/dashboard/admin-customers";
import AdminPromotions from "@/pages/dashboard/admin-promotions";
import AdminReports from "@/pages/dashboard/admin-reports";
import AdminInventory from "@/pages/dashboard/admin-inventory";
import AdminPersonnel from "@/pages/dashboard/admin-personnel";
import AdminImages from "@/pages/dashboard/admin-images";
import AdminSuperDashboard from "./pages/dashboard/admin-super-dashboard"; 
import AdminActivityLogsPage from "./pages/dashboard/admin-activity-logs";
import AdminPerformancePage from "./pages/dashboard/admin-performance";
import AdminActivityMasterPage from "./pages/dashboard/admin-activity-master";
import AdminSettings from "@/pages/dashboard/admin-settings";
import StorekeeperSettings from "@/pages/dashboard/storekeeper-settings";
import StaffDashboard from "@/pages/dashboard/staff-dashboard";
import UserDashboard from "@/pages/dashboard/user-dashboard";
import UserProfile from "@/pages/user-profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Product Routes */}
      <Route path="/products" component={ProductsPage} />
      <Route path="/products/:id" component={ProductDetailPage} />
      <Route path="/product/:id" component={ProductDetailPage} />
      
      {/* Category Routes */}
      <Route path="/women" component={ProductsPage} />
      <Route path="/women/clothing" component={ProductsPage} />
      <Route path="/women/bags" component={ProductsPage} />
      <Route path="/women/jewelry" component={ProductsPage} />
      <Route path="/women/accessories" component={ProductsPage} />
      <Route path="/men" component={ProductsPage} />
      <Route path="/men/clothing" component={ProductsPage} />
      <Route path="/men/bags" component={ProductsPage} />
      <Route path="/men/jewelry" component={ProductsPage} />
      <Route path="/men/accessories" component={ProductsPage} />
      
      {/* Special Collections */}
      <Route path="/new-arrivals" component={ProductsPage} />
      <Route path="/sale" component={ProductsPage} />
      <Route path="/brands" component={BrandsPage} />
      <Route path="/brands/:brand" component={ProductsPage} />
      
      {/* Shopping Cart */}
      <Route path="/cart" component={CartPage} />
      <Route path="/wishlist" component={CartPage} />
      
      {/* Order Management */}
      <Route path="/order-tracking" component={OrderTrackingPage} />
      <Route path="/order-success" component={OrderSuccessPage} />
      <Route path="/orders" component={OrderTrackingPage} />
      
      {/* Information Pages */}
      <Route path="/info/about" component={AboutPage} />
      <Route path="/info/contact" component={ContactPage} />
      <Route path="/info/faqs" component={FAQsPage} />
      <Route path="/info/shipping-returns" component={ShippingReturnsPage} />
      <Route path="/info/order-tracking" component={OrderTrackingInfoPage} />
      <Route path="/info/payment-methods" component={PaymentMethodsPage} />
      <Route path="/info/careers" component={CareersPage} />
      <Route path="/info/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/info/terms" component={TermsPage} />
      <Route path="/info/sustainability" component={SustainabilityPage} />
      
      {/* Protected Routes - User/Customer Dashboard */}
      <ProtectedRoute path="/checkout" component={CheckoutPage} />
      <ProtectedRoute path="/user-dashboard" component={UserDashboard} />
      <ProtectedRoute path="/user-orders" component={UserDashboard} />
      <ProtectedRoute path="/user-profile" component={UserDashboard} />
      <ProtectedRoute path="/user-wishlist" component={UserDashboard} />
      <ProtectedRoute path="/user-addresses" component={UserDashboard} />
      <ProtectedRoute path="/user-payment-methods" component={UserDashboard} />
      <ProtectedRoute path="/user-notifications" component={UserDashboard} />
      <ProtectedRoute path="/user-settings" component={UserDashboard} />
      <ProtectedRoute path="/profile" component={UserProfile} />
      
      {/* Backward compatibility routes */}
      <ProtectedRoute path="/account" component={UserDashboard} />
      <ProtectedRoute path="/account/orders" component={UserDashboard} />

      {/* Protected Routes - Admin Dashboard */}
      <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly={true} />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} adminOnly={true} />
      
      {/* Admin Products Management */}
      <ProtectedRoute path="/admin/products" component={AdminProducts} adminOnly={true} />
      <ProtectedRoute path="/admin/products/new" component={AdminProductForm} adminOnly={true} />
      <ProtectedRoute path="/admin/products/edit/:id" component={AdminProductForm} adminOnly={true} />
      
      {/* Admin Orders Management */}
      <ProtectedRoute path="/admin/orders" component={AdminOrders} adminOnly={true} />
      <ProtectedRoute path="/admin/orders/new" component={AdminOrders} adminOnly={true} />
      <ProtectedRoute path="/admin/orders/:id" component={AdminOrders} adminOnly={true} />
      
      {/* Admin Customers Management */}
      <ProtectedRoute path="/admin/customers" component={AdminCustomers} adminOnly={true} />
      <ProtectedRoute path="/admin/customers/:id" component={AdminCustomers} adminOnly={true} />
      
      {/* Admin Promotions Management */}
      <ProtectedRoute path="/admin/promotions" component={AdminPromotions} adminOnly={true} />
      <ProtectedRoute path="/admin/promotions/new" component={AdminPromotions} adminOnly={true} />
      <ProtectedRoute path="/admin/promotions/:id" component={AdminPromotions} adminOnly={true} />
      
      {/* Admin Reports */}
      <ProtectedRoute path="/admin/reports" component={AdminReports} adminOnly={true} />
      <ProtectedRoute path="/admin/reports/:type" component={AdminReports} adminOnly={true} />
      
      {/* Admin Inventory Management */}
      <ProtectedRoute path="/admin/inventory" component={AdminInventory} adminOnly={true} />
      <ProtectedRoute path="/admin/inventory/scan" component={AdminInventory} adminOnly={true} />
      
      {/* Admin Sales Management */}
      <Route path="/admin/sales">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          {React.createElement(lazy(() => import("@/pages/dashboard/admin-sales")))}
        </Suspense>
      </Route>
      
      {/* Admin Image Management */}
      <ProtectedRoute path="/admin/images" component={AdminImages} adminOnly={true} />
      
      {/* Admin Personnel Management - Only for Master Admins */}
      <ProtectedRoute path="/admin/personnel" component={AdminPersonnel} adminOnly={true} masterAdminOnly={true} />
      <ProtectedRoute path="/admin/activity-logs" component={AdminActivityMasterPage} adminOnly={true} masterAdminOnly={true} />

      {/* Super Admin Routes */}
      <ProtectedRoute path="/admin/super" component={AdminSuperDashboard} adminOnly={true} superAdminOnly={true} />
      <ProtectedRoute path="/admin/super/activity-logs" component={AdminActivityLogsPage} adminOnly={true} superAdminOnly={true} />
      <ProtectedRoute path="/admin/super/performance" component={AdminPerformancePage} adminOnly={true} superAdminOnly={true} />
      
      {/* Admin Settings Page - For all admin roles */}
      <ProtectedRoute path="/admin/settings" component={AdminSettings} adminOnly={true} />
      
      {/* Storekeeper Settings Page */}
      <ProtectedRoute path="/admin/storekeeper/settings" component={StorekeeperSettings} adminOnly={true} />
      
      {/* Store Personnel Dashboard */}
      <ProtectedRoute path="/admin/staff" component={StaffDashboard} adminOnly={true} />
      <ProtectedRoute path="/admin/staff/dashboard" component={StaffDashboard} adminOnly={true} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function MainAppContent() {
  const { user } = useAuth();
  const { AnimatedToastContainer } = useAnimatedToast();
  
  return (
    <>
      <ScrollToTop />
      <Helmet
        titleTemplate="%s | DASH - Luxury Fashion"
        defaultTitle="DASH - Luxury Fashion"
      >
        <meta
          name="description"
          content="DASH is a luxury fashion destination offering the finest curated selection of men's and women's clothing, accessories, and jewelry from world-renowned designers."
        />
      </Helmet>
      <Router />
      <Toaster />
      <AnimatedToastContainer />
      <WelcomeAnimation user={user} />
      <RealTimeUpdates />
    </>
  );
}

function App() {
  return (
      <AuthProvider>
        <ThemeProvider>
          <InventoryProvider>
            <GuestCartProvider>
                <MainAppContent />
            </GuestCartProvider>
          </InventoryProvider>
        </ThemeProvider>
      </AuthProvider>
  );
}

export default App;
