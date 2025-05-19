import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface UserPaymentMethod {
  id: number;
  userId: number;
  methodType: string;
  cardNumber?: string;
  cardType?: string;
  cardExpiry?: string;
  cardholderName?: string;
  billingAddress?: string;
  nickname?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useUserPaymentMethods() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch all payment methods for the current user
  const { data: paymentMethods = [], isLoading, error } = useQuery<UserPaymentMethod[]>({
    queryKey: ["/api/user-payment-methods"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/user-payment-methods");
      if (!response.ok) {
        throw new Error("Failed to fetch payment methods");
      }
      return response.json();
    },
  });

  // Create a new payment method
  const createPaymentMethodMutation = useMutation({
    mutationFn: async (paymentMethodData: Omit<UserPaymentMethod, "id" | "userId" | "createdAt" | "updatedAt">) => {
      const response = await apiRequest("POST", "/api/user-payment-methods", paymentMethodData);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create payment method");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-payment-methods"] });
      toast({
        title: "Payment Method Added",
        description: "Your new payment method has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add payment method. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update an existing payment method
  const updatePaymentMethodMutation = useMutation({
    mutationFn: async (paymentMethodData: Partial<UserPaymentMethod> & { id: number }) => {
      const { id, ...data } = paymentMethodData;
      const response = await apiRequest("PATCH", `/api/user-payment-methods/${id}`, data);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update payment method");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-payment-methods"] });
      toast({
        title: "Payment Method Updated",
        description: "Your payment method has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment method. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete a payment method
  const deletePaymentMethodMutation = useMutation({
    mutationFn: async (paymentMethodId: number) => {
      const response = await apiRequest("DELETE", `/api/user-payment-methods/${paymentMethodId}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete payment method");
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-payment-methods"] });
      toast({
        title: "Payment Method Deleted",
        description: "The payment method has been removed from your account.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete payment method. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set a payment method as default
  const setDefaultPaymentMethodMutation = useMutation({
    mutationFn: async (paymentMethodId: number) => {
      const response = await apiRequest("PATCH", `/api/user-payment-methods/${paymentMethodId}/default`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to set default payment method");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-payment-methods"] });
      toast({
        title: "Default Payment Method Updated",
        description: "Your default payment method has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to set default payment method. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    paymentMethods,
    isLoading,
    error,
    createPaymentMethodMutation,
    updatePaymentMethodMutation,
    deletePaymentMethodMutation,
    setDefaultPaymentMethodMutation,
  };
}