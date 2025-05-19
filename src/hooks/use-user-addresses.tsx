import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface UserAddress {
  id: number;
  userId: number;
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  addressType: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useUserAddresses() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch all addresses for the current user
  const { data: addresses = [], isLoading, error } = useQuery<UserAddress[]>({
    queryKey: ["/api/users/user-addresses"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/users/user-addresses");
      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }
      return response.json();
    },
  });

  // Create a new address
  const createAddressMutation = useMutation({
    mutationFn: async (addressData: Omit<UserAddress, "id" | "userId" | "createdAt" | "updatedAt">) => {
      const response = await apiRequest("POST", "/api/users/user-addresses", addressData);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create address");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/user-addresses"] });
      toast({
        title: "Address Added",
        description: "Your new address has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add address. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update an existing address
  const updateAddressMutation = useMutation({
    mutationFn: async (addressData: Partial<UserAddress> & { id: number }) => {
      const { id, ...data } = addressData;
      const response = await apiRequest("PATCH", `/api/users/user-addresses/${id}`, data);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update address");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/user-addresses"] });
      toast({
        title: "Address Updated",
        description: "Your address has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update address. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete an address
  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: number) => {
      const response = await apiRequest("DELETE", `/api/users/user-addresses/${addressId}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete address");
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/user-addresses"] });
      toast({
        title: "Address Deleted",
        description: "The address has been removed from your account.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set an address as default
  const setDefaultAddressMutation = useMutation({
    mutationFn: async (addressId: number) => {
      const response = await apiRequest("PATCH", `/api/users/user-addresses/${addressId}/default`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to set default address");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/user-addresses"] });
      toast({
        title: "Default Address Updated",
        description: "Your default address has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to set default address. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    addresses,
    isLoading,
    error,
    createAddressMutation,
    updateAddressMutation,
    deleteAddressMutation,
    setDefaultAddressMutation,
  };
}