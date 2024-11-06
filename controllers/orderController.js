const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { getAllDocuments } = require('../utils/querryDocument');

exports.getAllByAdmin = async (req, res) => {
  const query = { 
    user: req.query.search ? { $regex: req.query.search, $options: 'i' } : null
  };

  const defaultField = 'createdAt';
  getAllDocuments(Order, query, defaultField, req, res,);
}

exports.getAllBySelf = async (req, res) => {
  const query = { 
    user: req.user.toString()
  };

  const defaultField = 'createdAt';
  getAllDocuments(Order, query, defaultField, req, res,);
}

exports.createOne = async (req, res) => {
  try {
    const userId = req.user.id;
    // arr id product ['abc', 'bcd']
    const { productOrder, address, delivery, deliveryStatus, payment, paymentStatus } = req.body;
    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderItems = [];
    cart.items.forEach(item => {
        if (!productOrder.includes(item.product._id)) {
            return;
        }
        orderItems.push({
            product: item.product._id,
            quantity: item.quantity,
            totalPrice: item.quantity * item.product.price,
        });
    });

    const totalPrice = orderItems.reduce((total, item) => total + item.totalPrice, 0);

    const newOrder = new Order({
      user: userId,
      address: address,  
      items: orderItems,
      delivery: req.body.delivery,  
      deliveryStatus: req.body.deliveryStatus, 
      payment: req.body.payment,  
      paymentStatus: req.body.paymentStatus, 
      totalPrice: totalPrice,
    });

    await newOrder.save();

    cart.items = cart.items.filter(i => !productOrder.includes(i));
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
      return res.status(404).json({ error: 'Order not found' });
    }

    order.deliveryStatus = deliveryStatus;

    await order.save();

    res.status(200).json({ data: order });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};
