// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/order";
import Product from "@/models/product";
import { orderSchemaBackEnd } from "@/schemas/orderSchema";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
    let session: mongoose.ClientSession | null = null;

    try {
        await dbConnect();

        const body = await request.json();

        // 3. Validate with Zod schema
        const validation = orderSchemaBackEnd.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validation.error },
                { status: 400 }
            );
        }

        const validatedData = validation.data;

        // Start a MongoDB transaction session
        session = await mongoose.startSession();
        session.startTransaction();

        // 4. Check product availability and update stock
        const productUpdates = [];
        for (const item of validatedData.orderItems) {
            const product = await Product.findById(item.product).session(session);
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return NextResponse.json(
                    { error: `Product with ID ${item.product} not found` },
                    { status: 404 }
                );
            }
            if (product.quantity < item.quantity) {
                await session.abortTransaction();
                session.endSession();
                return NextResponse.json(
                    { error: `Insufficient stock for product: ${product.name}` },
                    { status: 400 }
                );
            }
            product.quantity -= item.quantity;
            await product.save({ session });
            productUpdates.push(product);
        }

        // 5. Create order default COD
        const orderData = {
            ...validatedData,
            paymentMethod: "cash_on_delivery", // enforce
        };
        const order = await Order.create([orderData], { session });
        const createdOrder = order[0];

        // 6. Commit transaction
        await session.commitTransaction();
        session.endSession();

        return NextResponse.json(
            { message: "Order created successfully", order: createdOrder },
            { status: 201 }
        );
    } catch (error: any) {
        // Rollback transaction if it was started and not committed
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        console.error("Order creation error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}