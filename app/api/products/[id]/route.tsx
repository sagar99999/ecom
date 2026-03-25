import { NextResponse } from "next/server";
import Product from "@/models/product";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import { imagekit } from "@/lib/imagekit";
import { productSchemaBackEnd } from "@/schemas/productSchema";
import { requireAdmin } from "@/middleware/auth";

// GET single product with id
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) return NextResponse.json({ message: "Missing ID" }, { status: 400 });

        await dbConnect();

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

// DELETE product with id
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    // require admin access
    try {
        await requireAdmin();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // delete logic
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ message: "Missing ID" }, { status: 400 });
        }

        await dbConnect();

        // Find the product
        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        if (product.fileId) {
            try {
                // Delete image from imagekit
                await imagekit.deleteFile(product.fileId)
            } catch (error: any) {
                console.error("Failed to delete image from ImageKit:", error.message);
            }
        }

        await Product.findByIdAndDelete(id);

        return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
    }
}

// PUT update product with id
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    // require admin access
    try {
        await requireAdmin();
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    // update logic
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        await dbConnect();

        const existingProduct = await Product.findById(id);

        if (!existingProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

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

        let imageUrl = existingProduct.imageUrl;

        //Handle optional image update
        if (image && image.name) {
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

            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Delete old image
            if (existingProduct.fileId) {
                try {
                    await imagekit.deleteFile(existingProduct.fileId);
                } catch (err: any) {
                    console.error("Failed to delete old image:", err.message);
                }
            }

            // Upload new image
            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: `${Date.now()}-${image.name}`,
                folder: "/products",
            });

            imageUrl = uploadResponse.url;
            existingProduct.fileId = uploadResponse.fileId;
        }

        // Update fields
        existingProduct.name = data.name;
        existingProduct.price = data.price;
        existingProduct.quantity = data.quantity;
        existingProduct.category = data.category;
        existingProduct.description = data.description;
        existingProduct.imageUrl = imageUrl;

        await existingProduct.save();

        const updatedProduct = existingProduct.toObject();
        updatedProduct._id = updatedProduct._id.toString();

        return NextResponse.json(
            {
                message: "Product updated successfully",
                product: updatedProduct,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}