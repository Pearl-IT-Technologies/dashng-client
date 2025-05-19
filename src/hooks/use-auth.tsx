import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/use-toast';
import { 
  AuthContextType, 
  User, 
  LoginFormValues, 
  RegisterFormValues,
} from '../types/auth';

// Create context - use proper typing
const AuthContext = createContext({} as AuthContextType);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query user data
  const { 
    data: user, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/users/profile'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/users/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    }
  });

  // Login mutation
  const loginMutation = useMutation<User, Error, LoginFormValues>({
    mutationFn: async (credentials: LoginFormValues) => {
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
      }
      return await response.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['/api/users/profile'], userData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    }
  });

  // Register mutation
  const registerMutation = useMutation<User, Error, RegisterFormValues>({
    mutationFn: async (userData: RegisterFormValues) => {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed. Please try again.');
      }
      return await response.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['/api/users/profile'], userData);
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
    }
  });

  // Logout mutation
  const logoutMutation = useMutation<boolean, Error, void>({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/logout');
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return true;
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/users/profile'], null);
      queryClient.invalidateQueries({ queryKey: ['/api/users/profile'] });
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
    }
  });

  // Create context value with the correct typing from AuthContextType
  const contextValue = {
    user,
    isLoading,
    error,
    loginMutation,
    registerMutation,
    logoutMutation,
    refetchUser: refetch
  };

  // Return the provider component
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context || Object.keys(context).length === 0) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export User type for compatibility with TypeScript
export const UserType = {
  _id: '',
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  role: 'customer',
  phone: '',
  profileImage: '',
  isAdmin: false,
  isSuperAdmin: false,
  isOwner: false,
  isStorekeeper: false,
  isSales: false,
  adminRole: '',
  id: '' // Alias for _id for compatibility
};