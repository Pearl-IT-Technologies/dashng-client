import { z } from 'zod';

// Base Product Schema
export const productSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  salePrice: z.number().optional().nullable(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional().nullable(),
  colors: z.array(z.string()).optional().default([]),
  sizes: z.array(z.string()).optional().default([]),
  quantity: z.number().min(0, "Quantity cannot be negative").default(0),
  storeQuantity: z.number().min(0, "Store quantity cannot be negative").default(0),
  featured: z.boolean().optional().default(false),
  isTrending: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(true),
  tags: z.array(z.string()).optional().default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Schema for inserting a new product (omit generated fields)
export const insertProductSchema = productSchema.omit({
  id: true,
  _id: true,
  createdAt: true,
  updatedAt: true
});

// Type definitions
export const Product = productSchema.parse({});
export const InsertProduct = insertProductSchema.parse({});

// Other schemas
export const categorySchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
  slug: z.string().optional(),
  image: z.string().optional(),
  products: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const brandSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  description: z.string().optional(),
  logo: z.string().optional(),
  products: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const orderSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  user: z.string().optional(),
  products: z.array(
    z.object({
      product: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0),
      size: z.string().optional(),
      color: z.string().optional(),
    })
  ),
  totalAmount: z.number().min(0),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
  paymentStatus: z.enum(['unpaid', 'paid', 'refunded']).default('unpaid'),
  paymentMethod: z.string().optional(),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zipCode: z.string(),
  }),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

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
  isAdmin: z.boolean().optional(),
  isMasterAdmin: z.boolean().optional(),
  isSuperAdmin: z.boolean().optional(),
  adminRole: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});