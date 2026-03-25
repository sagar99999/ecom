import mongoose from "mongoose";

// Order item subdocument
const OrderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true, min: 0 },
});

// Customer address subdocument
const CustomerAddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
});

// Customer subdocument
const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: CustomerAddressSchema, required: true },
});

// Main Order schema
const OrderSchema = new mongoose.Schema({
    orderItems: { type: [OrderItemSchema], required: true },
    customer: { type: CustomerSchema, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["cash_on_delivery"],
        default: "cash_on_delivery",
    },
    notes: { type: String },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
}, {
    timestamps: true,
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);