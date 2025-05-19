import { z } from 'zod';
import { UseMutationResult } from '@tanstack/react-query';

// User schema - matches the schema in schema.ts
export const userSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['customer', 'sales', 'storekeeper', 'owner', 'super_admin']).default('customer'),
  isAdmin: z.boolean().optional().default(false),
  isSuperAdmin: z.boolean().optional().default(false),
  isOwner: z.boolean().optional().default(false),
  isStorekeeper: z.boolean().optional().default(false),
  isSales: z.boolean().optional().default(false),
  adminRole: z.string().optional(),
  profileImage: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register schema
export const registerSchema = userSchema.pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  phone: true,
});

// Types
export type User = z.infer<typeof userSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginFormValues>;
  registerMutation: UseMutationResult<User, Error, RegisterFormValues>;
  logoutMutation: UseMutationResult<boolean, Error, void>;
  refetchUser: () => Promise<any>;
}