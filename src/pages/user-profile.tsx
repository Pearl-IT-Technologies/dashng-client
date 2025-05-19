// @ts-nocheck

import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import { User, UserCircle, AtSign, Phone, MapPin, Crown } from "lucide-react";

export default function UserProfile() {
  const { user, isLoading } = useAuth();
  const [_, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>You need to be logged in to view this page.</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Profile | DASH</title>
      </Helmet>

      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">User Profile</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" /> 
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mr-4">
                      {user.firstName?.[0] || user.username[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.username}
                      </h2>
                      <p className="text-gray-500 text-sm flex items-center">
                        <UserCircle className="h-4 w-4 mr-1" />
                        {user.username}
                        {user.isAdmin && (
                          <span className="ml-2 text-primary flex items-center">
                            <Crown className="h-3 w-3 mr-1" /> Administrator
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <AtSign className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p>{user.email}</p>
                      </div>
                    </div>

                    {user.phone && (
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p>{user.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {(user.address || user.city || user.state || user.country) && (
                    <div className="flex items-start mb-6">
                      <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p>
                          {[
                            user.address,
                            user.city,
                            user.state,
                            user.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.isAdmin && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium text-sm mb-2">Admin Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Sales Processed</p>
                          <p className="font-medium">{user.adminSalesCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Last Active</p>
                          <p className="font-medium">
                            {user.lastActive
                              ? new Date(user.lastActive).toLocaleDateString()
                              : "Never"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Return to Home
            </Button>
            <Button variant="outline" onClick={() => navigate(user.isAdmin ? "/admin/dashboard" : "/user/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}