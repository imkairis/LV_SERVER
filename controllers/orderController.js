const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const { getAllDocuments } = require("../utils/querryDocument");

exports.getAllByAdmin = async (req, res) => {
    const query = {};
    // const populate = ["user", "items.product"];
    const populate = [
        {
            path: "user",
            select: "name email fullname",
        },
        {
            path: "items.product",
            select: "name price",
        },
    ];
    if (req.query.search) {
        query = {
            ...query,
            $text: { $search: new RegExp(req.query.search, "i") },
        };
    }

    const defaultField = "createdAt";
    getAllDocuments(Order, query, defaultField, req, res, populate);
};

exports.getById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const user = await User.findById(req.user.id);

        const populate = ["items.product", "user"];
        const order = await Order.findById(orderId).populate(populate);

        console.log(`
            user: ${user._id.toString()}
            isAdmin: ${user.isAdmin}
            order_user: ${order.user._id.toString()}    
            condition: ${
                !user.isAdmin || order.user._id.toString() !== req.user.id
            }
        `);

        if (!user.isAdmin) {
            if (order.user._id.toString() !== req.user.id) {
                return res.status(403).json({ error: "Permission denied" });
            }
        }

        return res.status(200).json({ data: order });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllBySelf = async (req, res) => {
    const query = {
        user: req.user.id,
    };

    const defaultField = "createdAt";
    getAllDocuments(Order, query, defaultField, req, res);
};

exports.createOne = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user.id;
        const {
            productOrder, // Array of product IDs ['abc', 'bcd']
            address,
            deliveryStatus = "pending",
            payment = "cod",
            priceShipping = 0,
        } = req.body;

        let cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        const orderItems = [];
        cart.items = cart.items.filter(item => {
            if (!productOrder.includes(item.product._id.toString())) {
                return true; // Keep items not in productOrder
            }

            // Check stock availability
            if (item.product.quantity < item.quantity) {
                throw new Error(
                    `Not enough stock for product: ${item.product.name}`
                );
            }

            orderItems.push({
                product: item.product._id,
                quantity: item.quantity,
                totalPrice: item.quantity * item.product.price,
            });

            return false; // Remove the item from the cart
        });

        // Bulk update product quantities
        const bulkOperations = orderItems.map(orderItem => ({
            updateOne: {
                filter: { _id: orderItem.product, quantity: { $gte: orderItem.quantity } },
                update: { $inc: { quantity: -orderItem.quantity } },
            },
        }));

        const bulkResult = await Product.bulkWrite(bulkOperations, { session });
        if (bulkResult.modifiedCount !== orderItems.length) {
            throw new Error("Some products could not be updated due to insufficient stock.");
        }

        const totalPrice =
            orderItems.reduce((total, item) => total + item.totalPrice, 0) +
            priceShipping;

        const newOrder = new Order({
            user: userId,
            address: address,
            items: orderItems,
            deliveryStatus: deliveryStatus,
            payment: payment,
            totalPrice: totalPrice,
            priceShipping: priceShipping,
        });

        await newOrder.save({ session });
        await cart.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ data: newOrder });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        console.error(err.message);

        // Handle specific errors for better user experience
        if (err.message.includes("Not enough stock")) {
            return res.status(400).json({ error: err.message });
        }

        res.status(500).json({ error: "An unexpected error occurred" });
    }
};


exports.updateDeliveryStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { deliveryStatus } = req.body;

        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.deliveryStatus = deliveryStatus;

        await order.save();

        res.status(200).json({ data: order });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};
