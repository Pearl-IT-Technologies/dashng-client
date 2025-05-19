import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { PlusCircle, UserPlus, Edit, Trash2, CheckCircle, XCircle, ArrowLeft, Circle, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { apiRequest } from "@/lib/queryClient";

// Schema for creating a new store personnel
const newPersonnelSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

type NewPersonnelFormValues = z.infer<typeof newPersonnelSchema>;

// Edit personnel form schema
const editPersonnelSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  adminRole: z.enum(["staff", "manager", "sales", "storekeeper"]).default("staff"),
});

type EditPersonnelFormValues = z.infer<typeof editPersonnelSchema>;

const AdminPersonnel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds
  
  // Form for creating a new store personnel
  const form = useForm<NewPersonnelFormValues>({
    resolver: zodResolver(newPersonnelSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });
  
  // Form for editing personnel
  const editForm = useForm<EditPersonnelFormValues>({
    resolver: zodResolver(editPersonnelSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      adminRole: "staff",
    },
  });

  // Query to fetch all admins/store personnel with auto-refresh
  const { data: personnel, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/store-personnel"],
    queryFn: async () => {
      const res = await fetch("/api/admin/store-personnel");
      if (!res.ok) throw new Error("Failed to fetch store personnel");
      return res.json();
    },
    refetchInterval: refreshInterval, // Auto-refresh for real-time status
  });
  
  // Effect to reset form when editing user changes
  useEffect(() => {
    if (selectedUser && isEditDialogOpen) {
      editForm.reset({
        username: selectedUser.username || "",
        email: selectedUser.email || "",
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        phone: selectedUser.phone || "",
        adminRole: selectedUser.adminRole || "staff",
      });
    }
  }, [selectedUser, isEditDialogOpen, editForm]);

  // Mutation to create a new store personnel
  const createMutation = useMutation({
    mutationFn: async (data: NewPersonnelFormValues) => {
      const res = await apiRequest("POST", "/api/admin/store-personnel", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Store personnel created successfully",
      });
      setIsCreateDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/store-personnel"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create store personnel",
        variant: "destructive",
      });
    },
  });
  
  // Mutation to update personnel
  const updateMutation = useMutation({
    mutationFn: async (data: EditPersonnelFormValues & { id: number }) => {
      const { id, ...rest } = data;
      const res = await apiRequest("PUT", `/api/admin/store-personnel/${id}`, rest);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Store personnel updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/store-personnel"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update store personnel",
        variant: "destructive",
      });
    },
  });
  
  // Mutation to deactivate/activate personnel
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/store-personnel/${id}/status`, { isActive: active });
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: `User ${variables.active ? 'activated' : 'deactivated'} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/store-personnel"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  });
  
  // Mutation to delete personnel
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/store-personnel/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Store personnel deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/store-personnel"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete store personnel",
        variant: "destructive",
      });
    }
  });

  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Personnel list has been refreshed",
      variant: "default",
    });
  };
  
  // Submit handler for creating a new store personnel
  const onSubmit = (data: NewPersonnelFormValues) => {
    createMutation.mutate(data);
  };
  
  // Submit handler for editing personnel
  const onEditSubmit = (data: EditPersonnelFormValues) => {
    if (!selectedUser) return;
    
    updateMutation.mutate({
      id: selectedUser.id,
      ...data
    });
  };
  
  // Handle status toggle
  const handleToggleStatus = (user: any) => {
    toggleActiveMutation.mutate({
      id: user.id,
      active: !user.isActive
    });
  };
  
  // Handle delete
  const handleDelete = () => {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser.id);
  };

  // Ensure user is a master admin
  if (!(user?.isMasterAdmin || user?.adminRole === 'master')) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">You do not have permission to access this page.</p>
        <Link href="/admin/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Store Personnel Management | DASH</title>
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Store Personnel Management</h1>
            <p className="text-gray-500 mt-1">
              Create and manage store personnel accounts
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Personnel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Store Personnel</CardTitle>
            <CardDescription>
              View and manage all store personnel accounts created by you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : personnel && personnel.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Sales Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personnel.map((person: any) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">{person.username}</TableCell>
                      <TableCell>
                        {person.firstName} {person.lastName}
                      </TableCell>
                      <TableCell>{person.email}</TableCell>
                      <TableCell>{person.adminRole || "staff"}</TableCell>
                      <TableCell>
                        {person.lastActive
                          ? new Date(person.lastActive).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>{person.adminSalesCount || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={person.isActive ? "default" : "secondary"} 
                            className={`${person.isActive ? "bg-green-500" : ""} mr-1`}
                          >
                            {person.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {person.lastLogin && new Date(person.lastLogin).getTime() > 
                           (new Date().getTime() - 15 * 60 * 1000) && (
                            <div className="flex items-center text-green-500 text-xs">
                              <Circle className="h-2 w-2 fill-current mr-1 animate-pulse" />
                              <span>Online</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedUser(person);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleStatus(person)}
                            className={!person.isActive ? "bg-green-50" : "bg-red-50"}
                          >
                            {person.isActive ? 
                              <XCircle className="h-4 w-4 text-red-500" /> : 
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            }
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => {
                              setSelectedUser(person);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <UserPlus className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium">No personnel found</h3>
                <p className="text-gray-500 mb-4">
                  You haven't created any store personnel accounts yet
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  Add Your First Personnel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Store Personnel Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Store Personnel</DialogTitle>
            <DialogDescription>
              Add a new store staff member with admin access
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username*</FormLabel>
                    <FormControl>
                      <Input placeholder="staffuser1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Used for login. Must be unique.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="staff@dashstore.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+234 800 000 0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password*</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      Minimum 6 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      Creating...
                    </>
                  ) : (
                    <>Create</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Store Personnel Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Store Personnel</DialogTitle>
            <DialogDescription>
              Update information for {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username*</FormLabel>
                    <FormControl>
                      <Input placeholder="staffuser1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="staff@dashstore.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+234 800 000 0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="adminRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="sales">Sales Personnel</SelectItem>
                        <SelectItem value="storekeeper">Store Keeper</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Staff have basic privileges, managers have more access, sales personnel can process in-store sales, and storekeepers manage inventory
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      Updating...
                    </>
                  ) : (
                    <>Update</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-500">Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.username}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-2">User details:</p>
            <div className="bg-gray-50 p-3 rounded-md">
              <p><span className="font-medium">Name:</span> {selectedUser?.firstName} {selectedUser?.lastName}</p>
              <p><span className="font-medium">Email:</span> {selectedUser?.email}</p>
              <p><span className="font-medium">Role:</span> {selectedUser?.adminRole || "staff"}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminPersonnel;