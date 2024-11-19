const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductType",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    cost: {
        type: Number,
        required: false,
    },
    stockQuantity: {
        type: Number,
        required: false,
        default: 1,
    },
    description: {
        type: String,
    },
    userManual: {
        type: String,
    },
    weight: {
        type: Number,
    },
    element: {
        type: String,
    },
    origin: {
        type: String,
    },
    dateOfManufacture: {
        type: Date,
    },
    expirationDate: {
        type: Date,
    },
    targetAudience: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TargetAudience",
    },
    ageGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AgeGroup",
    },
    images: [
        {
            type: String,
        },
    ],
});

ProductSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", ProductSchema);
