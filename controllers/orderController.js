const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { getAllDocuments } = require('../utils/querryDocument');

exports.getAllByAdmin = async (req, res) => {
    const query = {
        user: req.query.search
            ? { $regex: req.query.search, $options: "i" }
            : null,
    };

    const defaultField = "createdAt";
    getAllDocuments(Order, query, defaultField, req, res);
};

exports.getAllBySelf = async (req, res) => {
  

  const query = { 
    user: req.user.id
  };

    const defaultField = "createdAt";
    getAllDocuments(Order, query, defaultField, req, res);
};

exports.createOne = async (req, res) => {
    try {
        const userId = req.user.id;
        // productOrder is arr id product ['abc', 'bcd']
        const {
            productOrder,
            address,
            deliveryStatus = "pending",
            payment = "cod",
            priceShipping = 0,
        } = req.body;
        let cart = await Cart.findOne({ user: userId }).populate(
            "items.product"
        );

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        const orderItems = [];
        cart.items = cart.items.filter(item => {
            if (!productOrder.includes(item.product._id.toString())) {
                return true;
            }
            orderItems.push({
                product: item.product._id,
                quantity: item.quantity,
                totalPrice: item.quantity * item.product.price,
            });
            return false;
        });

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

        await newOrder.save();

        await cart.save();

        res.status(201).json({ data: newOrder });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
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
