import { NextRequest, NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";
import Product from "@/models/product";
import dbConnect from "@/lib/dbConnect";
import { productSchemaBackEnd } from "@/schemas/productSchema";
import { requireAdmin } from "@/middleware/auth";

// POST create new product
export async function POST(req: NextRequest) {

    // require admin access
    try {
        await requireAdmin();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle product creation with image upload
    try {

        await dbConnect();

        const formData = await req.formData();

        // Extract form data
        const rawData = {
            name: formData.get("name"),
            price: Number(formData.get("price")),
            quantity: Number(formData.get("quantity")),
            category: formData.get("category"),
            description: formData.get("description"),
        };

        const image = formData.get("image") as File | null;

        // Validate input fields with Zod
        const result = productSchemaBackEnd.safeParse(rawData);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.flatten() },
                { status: 400 }
            );
        }

        const data = result.data;

        // Validate image manually
        if (!image) {
            return NextResponse.json(
                { error: "Image is required" },
                { status: 400 }
            );
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(image.type)) {
            return NextResponse.json(
                { error: "Invalid image type" },
                { status: 400 }
            );
        }

        if (image.size > 4 * 1024 * 1024) {
            return NextResponse.json(
                { error: "Image too large" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload image to ImageKit
        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: `${Date.now()}-${image.name}`,
            folder: "/products",
        });

        // Save to MongoDB
        const product = await Product.create({
            ...data,
            imageUrl: uploadResponse.url,
            fileId: uploadResponse.fileId,
        });

        return NextResponse.json(
            {
                message: "Product created successfully",
                product,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}