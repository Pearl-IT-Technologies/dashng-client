import { Helmet } from "react-helmet";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loader2, UserPlus, BarChart3, ClipboardList, Users, ArrowUpRight } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A77BF3'];

export default function AdminSuperDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  
  // Fetch top performing admins
  const { data: topAdmins, isLoading: isLoadingTopAdmins } = useQuery({
    queryKey: ['/api/super-admin/performance', { top: true, limit: 5 }],
    enabled: !!user?.isSuperAdmin,
  });
  
  // Fetch recent activity logs
  const { data: activityLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['/api/super-admin/activity-logs', { limit: 10 }],
    enabled: !!user?.isSuperAdmin,
  });
  
  // Fetch staff members
  const { data: staffMembers, isLoading: isLoadingStaffMembers } = useQuery({
    queryKey: ['/api/admin/store-personnel'],
    enabled: !!user?.isSuperAdmin,
  });
  
  // Activity types for pie chart
  const getActivityData = () => {
    if (!activityLogs) return [];
    
    const activityCounts: Record<string, number> = {};
    activityLogs.forEach((log: any) => {
      if (activityCounts[log.activityType]) {
        activityCounts[log.activityType]++;
      } else {
        activityCounts[log.activityType] = 1;
      }
    });
    
    return Object.entries(activityCounts).map(([name, value]) => ({ name, value }));
  };
  
  const activityData = getActivityData();

  if (!user?.isSuperAdmin) {
    return (
      <DashboardLayout>
        <div className="px-4 py-10 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-center mb-4">Access Denied</h2>
          <p className="text-center text-muted-foreground mb-6">
            You don't have permission to access the Super Admin dashboard.
          </p>
          <Button onClick={() => setLocation("/admin/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Super Admin Dashboard | DASH</title>
      </Helmet>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor admin activities and performance</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setLocation("/admin/super/activity-logs")}>
              <ClipboardList className="h-4 w-4 mr-2" />
              Activity Logs
            </Button>
            <Button onClick={() => setLocation("/admin/personnel")}>
              <UserPlus className="h-4 w-4 mr-2" />
              Manage Staff
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStaffMembers ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  staffMembers?.length || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Store personnel under your supervision
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Admin Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingLogs ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  activityLogs?.length || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Recent admin activities logged
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingTopAdmins ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  topAdmins && topAdmins.length > 0 ? topAdmins[0].adminName : "-"
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isLoadingTopAdmins ? "Loading..." : topAdmins && topAdmins.length > 0 ? 
                  `${topAdmins[0].salesCount} sales ($${topAdmins[0].salesTotal.toFixed(2)})` : 
                  "No data available"}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Performance</CardTitle>
                <CardDescription>
                  Sales performance of top performing admins
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTopAdmins ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : topAdmins && topAdmins.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topAdmins}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="adminName" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="salesCount" name="Sales Count" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="salesTotal" name="Sales Total ($)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No performance data available</p>
                  </div>
                )}
                <div className="mt-4 text-right">
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => setLocation("/admin/super/performance")}
                  >
                    View detailed performance
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Admin Activities</CardTitle>
                <CardDescription>
                  Latest actions performed by admins
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingLogs ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : activityLogs && activityLogs.length > 0 ? (
                  <div className="space-y-4">
                    {activityLogs.slice(0, 5).map((log: any) => (
                      <div key={log.id} className="flex justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium">{log.adminName}</p>
                          <p className="text-sm text-muted-foreground">
                            {log.activityType.replace(/_/g, ' ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={log.success ? "default" : "destructive"}>
                            {log.success ? "Success" : "Failed"}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No activity logs available</p>
                  </div>
                )}
                <div className="mt-4 text-right">
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => setLocation("/admin/super/activity-logs")}
                  >
                    View all activity logs
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
                <CardDescription>
                  Types of admin activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingLogs ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : activityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={activityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {activityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No activity data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Staff Members</CardTitle>
                <CardDescription>
                  Store personnel under your supervision
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStaffMembers ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : staffMembers && staffMembers.length > 0 ? (
                  <div className="space-y-3">
                    {staffMembers.slice(0, 5).map((admin: any) => (
                      <div key={admin.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                        <div>
                          <p className="font-medium">{admin.adminName || admin.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {admin.isActive ? "Active" : "Inactive"}
                            {admin.expiresAt && ` • Expires: ${new Date(admin.expiresAt).toLocaleDateString()}`}
                          </p>
                        </div>
                        <Badge variant={admin.isActive ? "default" : "secondary"}>
                          {admin.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No staff members available</p>
                    <Button className="mt-4" size="sm" onClick={() => setLocation("/admin/personnel")}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Staff Member
                    </Button>
                  </div>
                )}
                <div className="mt-4 text-right">
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => setLocation("/admin/personnel")}
                  >
                    Manage Staff
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}