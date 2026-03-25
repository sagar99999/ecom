// schemas/orderSchema.ts
import { z } from "zod";

// Allowed values for order status
export const ALLOWED_ORDER_STATUS = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

// Allowed values for payment status
export const ALLOWED_PAYMENT_STATUS = ["pending", "paid", "failed"] as const;

// Zod schema for a single order item
const orderItemSchema = z.object({
    product: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid product ID format" }),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    priceAtPurchase: z.number().positive("Price must be greater than 0"),
});

// Zod schema for customer address
const customerAddressSchema = z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
});

// Zod schema for customer information
const customerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    address: customerAddressSchema,
});

// Main order schema (backend validation)
export const orderSchemaBackEnd = z.object({
    orderItems: z.array(orderItemSchema).nonempty("Order must contain at least one item"),
    customer: customerSchema,
    totalAmount: z.number().positive("Total amount must be greater than 0"),
    paymentMethod: z.enum(["cash_on_delivery"], { message: "Only cash on delivery is supported" }),
    notes: z.string().optional(),
    status: z.enum(ALLOWED_ORDER_STATUS).optional().default("pending"),
    paymentStatus: z.enum(ALLOWED_PAYMENT_STATUS).optional().default("pending"),
});

// Frontend-friendly version (if needed, e.g., for form validation)
export const orderSchema = z.object({
    orderItems: z.array(orderItemSchema).nonempty("Order must contain at least one item"),
    customer: customerSchema,
    totalAmount: z.number().positive("Total amount must be greater than 0"),
    paymentMethod: z.enum(["cash_on_delivery"]),
    notes: z.string().optional(),
});

// TypeScript type inferred from the backend schema
export type OrderType = z.infer<typeof orderSchemaBackEnd>;