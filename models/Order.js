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

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // JSON.stringify({name, address, phone})
        address: {
            type: String,
            required: true,
        },
        items: [orderItemSchema],
        deliveryStatus: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: 'DeliveryStatus',
            type: String,
            enum: ["pending", "shipping", "delivered", "failed"],
            required: true,
        },
        priceShipping: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        payment: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "Payment",
            type: String,
            enum: ["cod", "vnpay"],
            required: true,
        },
        paymentDate: {
            type: Date,
            default: null,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);
