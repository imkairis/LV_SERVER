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
    status: {
        type: String,
        enum: ["Còn hàng", "Sắp hết hàng", "Hết hàng"],
        default: "Còn hàng",
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
}, {
    timestamps: true,
});
ProductSchema.pre("save", function (next) {
    if (this.quantity === 0) {
        this.status = "Hết hàng";
    } else if (this.quantity > 0 && this.quantity <= 10) {
        this.status = "Sắp hết hàng";
    } else {
        this.status = "Còn hàng";
    }
    next();
});

// ProductSchema.index({ name: "text" });

module.exports = mongoose.model("Product", ProductSchema);
