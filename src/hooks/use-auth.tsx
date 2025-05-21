import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import React, { createContext, useContext, useState } from "react";
import { useToast } from "../hooks/use-toast";
import { AuthContextType, LoginFormValues, RegisterFormValues } from "../types/auth";

// Create context - use proper typing
const AuthContext = createContext({} as AuthContextType);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const [token, setToken] = useState<string | null>(() => {
		// Initialize from localStorage if available
		return localStorage.getItem("authToken");
	});

	// Create a function to set token both in state and localStorage
	const setAuthToken = (newToken: string | null) => {
		setToken(newToken);
		if (newToken) {
			localStorage.setItem("authToken", newToken);
		} else {
			localStorage.removeItem("authToken");
		}
	};

	// Query user data
	const {
		data: user,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["/api/users/profile"],
		queryFn: async () => {
			try {
				const response = await apiRequest("GET", "/api/users/profile");
				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}
				return await response.json();
			} catch (error) {
				console.error("Error fetching user:", error);
				return null;
			}
		},
	});

	// Login mutation
	const loginMutation = useMutation({
		mutationFn: async (credentials: LoginFormValues) => {
			const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
			const response = await apiRequest("POST", "/api/auth/login", credentials, headers);
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Login failed. Please check your credentials.");
			}
			return await response.json();
		},
		onSuccess: (data) => {
			setAuthToken(data.token);
			queryClient.setQueryData(["/api/users/profile"], data.user);
			toast({
				title: "Login successful",
				description: `Welcome back, ${data.user.username}!`,
			});
		},
		onError: (error) => {
			toast({
				title: "Login failed",
				description: error.message || "Please check your credentials and try again",
				variant: "destructive",
			});
		},
	});

	// Register mutation
	const registerMutation = useMutation({
		mutationFn: async (userData: RegisterFormValues) => {
			const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
			const response = await apiRequest("POST", "/api/auth/register", userData, headers);
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || "Registration failed. Please try again.");
			}
			return await response.json();
		},
		onSuccess: (data) => {
			setAuthToken(data.token);
			queryClient.setQueryData(["/api/users/profile"], data.user);
			toast({
				title: "Account created",
				description: "Welcome to DASH! Your account has been created successfully.",
			});
		},
		onError: (error) => {
			toast({
				title: "Registration failed",
				description: error.message || "Please check your information and try again",
				variant: "destructive",
			});
		},
	});

	// Logout mutation
	const logoutMutation = useMutation<boolean, Error, void>({
		mutationFn: async () => {
			const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
			const response = await apiRequest("POST", "/api/auth/logout", undefined, headers);
			if (!response.ok) {
				throw new Error("Logout failed");
			}
			return true;
		},
		onSuccess: () => {
			setAuthToken(null);
			queryClient.setQueryData(["/api/users/profile"], null);
			queryClient.invalidateQueries({ queryKey: ["/api/users/profile"] });
			toast({
				title: "Logged out",
				description: "You have been successfully logged out.",
			});
		},
		onError: (error) => {
			toast({
				title: "Logout failed",
				description: error.message || "An error occurred during logout",
				variant: "destructive",
			});
		},
	});

	// Create context value with the correct typing from AuthContextType
	const contextValue = {
		user,
		isLoading,
		error,
		token,
		loginMutation,
		registerMutation,
		logoutMutation,
		refetchUser: refetch,
	};

	// Return the provider component
	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);

	if (!context || Object.keys(context).length === 0) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};
