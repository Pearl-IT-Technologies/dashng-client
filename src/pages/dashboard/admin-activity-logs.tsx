// @ts-nocheck

import { Helmet } from "react-helmet";
import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Loader2, Calendar as CalendarIcon, Search, ArrowLeft, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminActivityLogsPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
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
  
  // Fetch all admins for filter dropdown
  const { data: admins, isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['/api/super-admin/admins'],
    enabled: !!user?.isSuperAdmin,
  });
  
  // Fetch activity logs with filters
  const { data: activityLogs, isLoading } = useQuery({
    queryKey: [
      '/api/super-admin/activity-logs', 
      { 
        adminId: selectedAdmin,
        search,
        activityType: activityFilter,
        startDate: dateRange.from?.toISOString(),
        endDate: dateRange.to?.toISOString(),
        page
      }
    ],
    enabled: !!user?.isSuperAdmin,
  });
  
  // Extract unique activity types for filter dropdown
  const getActivityTypes = () => {
    if (!activityLogs) return [];
    
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
  
  if (!user?.isSuperAdmin) {
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
              onClick={() => setLocation("/admin/super")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Admin Activity Logs</h1>
              <p className="text-muted-foreground">Monitor all admin activities</p>
            </div>
          </div>
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
                    <SelectValue placeholder="All Admins" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Admins</SelectItem>
                    {admins?.map((admin: any) => (
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
                    {activityTypes.map((type) => (
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
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Select date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from || new Date()}
                      selected={{
                        from: dateRange.from || undefined,
                        to: dateRange.to || undefined,
                      }}
                      onSelect={(range) => 
                        setDateRange({ 
                          from: range?.from || null, 
                          to: range?.to || null 
                        })
                      }
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activity details"
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>
              Detailed history of admin activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : activityLogs && activityLogs.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admin</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.adminName}</TableCell>
                          <TableCell>{formatActivityType(log.activityType)}</TableCell>
                          <TableCell>
                            {log.activityDetails ? (
                              <div className="max-w-xs overflow-hidden text-ellipsis">
                                {Object.entries(log.activityDetails).map(([key, value]: [string, any]) => (
                                  <div key={key} className="text-xs">
                                    <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value.toString()}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={log.success ? "default" : "destructive"}>
                              {log.success ? "Success" : "Failed"}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.ipAddress || "-"}</TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing page {page} of logs
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={activityLogs.length < 20} // Assuming page size is 20
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="font-medium text-lg mb-2">No Activity Logs Found</h3>
                <p className="text-muted-foreground mb-6">
                  {Object.values({ selectedAdmin, activityFilter, search, from: dateRange.from, to: dateRange.to }).some(val => val) 
                    ? "No logs match your current filters. Try adjusting your search criteria."
                    : "There are no admin activity logs recorded yet."}
                </p>
                {Object.values({ selectedAdmin, activityFilter, search, from: dateRange.from, to: dateRange.to }).some(val => val) && (
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}