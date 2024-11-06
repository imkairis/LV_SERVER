const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    items: [orderItemSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery",
        required: true,
    },
    deliveryStatus: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'DeliveryStatus',
        type: String,
        enum: ["pending", "shipping", "delivered", "failed"],
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
    },
    paymentStatus: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "PaymentStatus",
        type: String,
        enum: ["pending", "paid", "failed"],
        required: true,
    },
    paymentDate: {
        type: Date,
        default: null,
        required: false,
    },
});

module.exports = mongoose.model("Order", orderSchema);
