import { useState } from "react";
import { Helmet } from "react-helmet";
import { ArrowLeft, Loader2, RefreshCw, Search, X } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CalendarIcon } from "lucide-react";

export default function AdminActivityMasterPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | null,
    to: Date | null
  }>({
    from: null,
    to: null
  });
  
  // Fetch all personnel for filter dropdown
  const { data: personnel, isLoading: isLoadingPersonnel } = useQuery({
    queryKey: ['/api/admin/store-personnel'],
    enabled: !!user && (user.isMasterAdmin || user.adminRole === 'master'),
  });
  
  // Fetch activity logs with filters
  const { data: activityLogs, isLoading, refetch } = useQuery({
    queryKey: [
      '/api/master-admin/activity-logs', 
      { 
        adminId: selectedAdmin,
        search,
        activityType: activityFilter,
        startDate: dateRange.from?.toISOString(),
        endDate: dateRange.to?.toISOString(),
        page
      }
    ],
    enabled: !!user && (user.isMasterAdmin || user.adminRole === 'master'),
  });
  
  // Extract unique activity types for filter dropdown
  const getActivityTypes = () => {
    if (!activityLogs || !Array.isArray(activityLogs)) return [];
    
    const types = new Set<string>();
    activityLogs.forEach((log: any) => {
      types.add(log.activityType);
    });
    
    return Array.from(types);
  };
  
  const activityTypes = getActivityTypes();
  
  // Format activity type for display
  const formatActivityType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedAdmin(null);
    setActivityFilter(null);
    setSearch("");
    setDateRange({ from: null, to: null });
    setPage(1);
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Activity logs have been refreshed",
    });
  };
  
  // Ensure user is a master admin
  if (!(user?.isMasterAdmin || user?.adminRole === 'master')) {
    return (
      <DashboardLayout>
        <div className="px-4 py-10 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-center mb-4">Access Denied</h2>
          <p className="text-center text-muted-foreground mb-6">
            You don't have permission to access the Admin Activity Logs page.
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
        <title>Admin Activity Logs | DASH</title>
      </Helmet>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-2" 
              onClick={() => setLocation("/admin/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Admin Activity Logs</h1>
              <p className="text-muted-foreground">Monitor all personnel activities</p>
            </div>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Filter activity logs by admin, type, or date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Admin</label>
                <Select 
                  value={selectedAdmin || ""} 
                  onValueChange={(value) => setSelectedAdmin(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Personnel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Personnel</SelectItem>
                    {!isLoadingPersonnel && Array.isArray(personnel) && personnel.map((admin: any) => (
                      <SelectItem key={admin.id} value={admin.id.toString()}>
                        {admin.adminName || admin.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Activity Type</label>
                <Select 
                  value={activityFilter || ""} 
                  onValueChange={(value) => setActivityFilter(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Activities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Activities</SelectItem>
                    {activityTypes.map((type: string) => (
                      <SelectItem key={type} value={type}>
                        {formatActivityType(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                            {format(dateRange.to, "MMM dd, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM dd, yyyy")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: dateRange.from || undefined,
                        to: dateRange.to || undefined,
                      }}
                      onSelect={(range) => 
                        setDateRange({
                          from: range?.from || null,
                          to: range?.to || null,
                        })
                      }
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setDateRange({ from: null, to: null })}
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search in logs..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setSearch("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Activity Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>
              Detailed record of all admin activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : activityLogs && Array.isArray(activityLogs) && activityLogs.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(activityLogs) && activityLogs.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.adminName}</TableCell>
                        <TableCell>{formatActivityType(log.activityType)}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.activityDetails ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="link" size="sm" className="h-auto p-0">
                                  View Details
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Activity Details</h4>
                                  <Separator />
                                  <div className="max-h-40 overflow-auto">
                                    <pre className="text-xs whitespace-pre-wrap break-all">
                                      {JSON.stringify(log.activityDetails, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            "No details available"
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.success ? "default" : "destructive"}>
                            {log.success ? "Success" : "Failed"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination */}
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm">
                    Page {page}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={!activityLogs || !Array.isArray(activityLogs) || activityLogs.length < 20}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No activity logs found matching your filters</p>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}