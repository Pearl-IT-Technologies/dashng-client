import { z } from 'zod';


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
  // Extended fields for ProductForm
  subcategory: z.string().optional(),
  discountPrice: z.number().optional().nullable(),
  discountPercentage: z.number().optional().nullable(),
  discountEndDate: z.date().optional().nullable(),
  brandType: z.string().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  inStock: z.boolean().optional().default(true),
  isNewArrival: z.boolean().optional(),
  barcode: z.string().optional(),
  sku: z.string().optional(),
  inStoreAvailable: z.boolean().optional().default(true),
  specifications: z.any().optional()
});
// Schema for inserting a new product (omit generated fields)
export const insertProductSchema = productSchema.omit({
  id: true,
  _id: true,
  createdAt: true,
  updatedAt: true
});
// Type definitions
export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
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
export type Category = z.infer<typeof categorySchema>;
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
export type Brand = z.infer<typeof brandSchema>;
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
export type Order = z.infer<typeof orderSchema>;
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
export type User = z.infer<typeof userSchema>;
// CartItem schema
export const cartItemSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  user: z.string().optional(),
  product: z.string(),
  quantity: z.number().min(1),
  size: z.string().optional(),
  color: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const insertCartItemSchema = cartItemSchema.omit({
  id: true,
  _id: true,
  createdAt: true,
  updatedAt: true
});
export type CartItem = z.infer<typeof cartItemSchema>;
// WishlistItem schema
export const wishlistItemSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  user: z.string(),
  product: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const insertWishlistItemSchema = wishlistItemSchema.omit({
  id: true,
  _id: true,
  createdAt: true,
  updatedAt: true
});
export type WishlistItem = z.infer<typeof wishlistItemSchema>;
// OrderItem schema
export const orderItemSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  order: z.string(),
  product: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
  size: z.string().optional(),
  color: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const insertOrderItemSchema = orderItemSchema.omit({
  id: true,
  _id: true,
  createdAt: true,
  updatedAt: true
});
export type OrderItem = z.infer<typeof orderItemSchema>;
// Coupon schema
export const couponSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  code: z.string().min(3),
  discount: z.number().min(0).max(100),
  isPercentage: z.boolean().default(true),
  maxUses: z.number().optional(),
  usedCount: z.number().default(0),
  validFrom: z.date(),
  validTo: z.date(),
  minPurchase: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const insertCouponSchema = couponSchema.omit({
  id: true,
  _id: true,
  usedCount: true,
  createdAt: true,
  updatedAt: true
});
export type Coupon = z.infer<typeof couponSchema>;
// UserAddress schema
export const userAddressSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  user: z.string(),
  type: z.enum(['billing', 'shipping']).default('shipping'),
  isDefault: z.boolean().default(false),
  name: z.string().optional(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
  phone: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const insertUserAddressSchema = userAddressSchema.omit({
  id: true,
  _id: true,
  createdAt: true,
  updatedAt: true
});
export type UserAddress = z.infer<typeof userAddressSchema>;
// UserPaymentMethod schema
export const userPaymentMethodSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  user: z.string(),
  type: z.enum(['card', 'bank', 'paypal']).default('card'),
  isDefault: z.boolean().default(false),
  name: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  cardType: z.string().optional(),
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  routingNumber: z.string().optional(),
  paypalEmail: z.string().email().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const insertUserPaymentMethodSchema = userPaymentMethodSchema.omit({
  id: true,
  _id: true,
  createdAt: true,
  updatedAt: true
});
export type UserPaymentMethod = z.infer<typeof userPaymentMethodSchema>;
// UserNotification schema
export const userNotificationSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  user: z.string(),
  type: z.enum(['order', 'system', 'promotion', 'stock']).default('system'),
  title: z.string(),
  message: z.string(),
  read: z.boolean().default(false),
  link: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const insertUserNotificationSchema = userNotificationSchema.omit({
  id: true,
  _id: true,
  read: true,
  createdAt: true,
  updatedAt: true
});
export type UserNotification = z.infer<typeof userNotificationSchema>;
// UserSetting schema
export const userSettingSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  user: z.string(),
  emailNotifications: z.boolean().default(true),
  orderUpdates: z.boolean().default(true),
  promotions: z.boolean().default(true),
  newsletter: z.boolean().default(false),
  language: z.string().default('en'),
  currency: z.string().default('USD'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const insertUserSettingSchema = userSettingSchema.omit({
  id: true,
  _id: true,
  createdAt: true,
  updatedAt: true
});
export type UserSetting = z.infer<typeof userSettingSchema>;
// TempAccessToken schema for passwordless login, etc.
export const tempAccessTokenSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  token: z.string(),
  email: z.string().email(),
  type: z.enum(['passwordReset', 'emailVerification', 'invitation']).default('passwordReset'),
  expires: z.date(),
  used: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const insertTempAccessTokenSchema = tempAccessTokenSchema.omit({
  id: true,
  _id: true,
  used: true,
  createdAt: true,
  updatedAt: true
});
export type TempAccessToken = z.infer<typeof tempAccessTokenSchema>;