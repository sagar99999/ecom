// /schemas/productSchema.ts
import { z } from "zod";

const CLOUDINARY_REGEX =
    /^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\/.+\.(jpg|jpeg|png|webp|gif)$/i;

export const ALLOWED_CATEGORIES = ["tops", "bottoms", "shoes"] as const;

//  Zod schema for the product
export const productSchemaBackEnd = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    price: z.number().min(1, "Price must be at least 1"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    category: z.enum(["tops", "shoes", "bottoms"], { message: "Category must be one of: tops, shoes, bottoms" }),
    description: z.string().min(14, "Description too short"),
});

export const productSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters" })
        .trim(),

    price: z
        .number({ message: "Price must be a number" })
        .positive({ message: "Price must be greater than 0" }),

    quantity: z
        .number({ message: "Quantity must be a number" })
        .min(0, { message: "Quantity cannot be negative" }),

    imageUrl: z
        .string({ message: "Image URL is required" })
        .regex(CLOUDINARY_REGEX, { message: "Image must be a valid Cloudinary URL" }),

    description: z
        .string()
        .min(10, { message: "Description must be at least 10 characters" }),

    category: z.enum(ALLOWED_CATEGORIES, { message: "Invalid category" }),
});


// TypeScript type inferred from schema
export type ProductType = z.infer<typeof productSchema>;
