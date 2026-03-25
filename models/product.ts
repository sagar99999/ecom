import mongoose from "mongoose";

// Product Schema
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    fileId: { type: String, required: true },
}, {
    timestamps: true,
})

export default mongoose.models.Product || mongoose.model("Product", ProductSchema)