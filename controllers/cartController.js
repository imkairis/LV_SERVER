const Cart = require('../models/Cart')
const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  try {
    const cart = await Cart.findOne({user: req.user.id}).populate('items.product')

    let totalPrice = 0;
    cart.items.forEach(item => {
      if (item.product && item.product.price) {
        totalPrice += item.quantity * item.product.price;
      }
    });

    cart.totalPrice = totalPrice

    res.status(200).json({data: cart})
  }
  catch(err) {
    console.error(err.message)
    res.status(500).json({error: err})
  }
}

exports.addNewProduct = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const p = await Product.findById(product);
    if (!p) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let qty = quantity < 1 ? 1 : quantity;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
          user: req.user.id,
          items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === product);

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += qty;

      if (cart.items[existingItemIndex].quantity > p.quantity) {
        cart.items[existingItemIndex].quantity = p.quantity;
      }
    } else {
      cart.items.push({ product: product, quantity: qty });
    }

    await cart.save();

    let totalPrice = 0;
    cart.items.forEach(item => {
      if (item.product && item.product.price) {
        totalPrice += item.quantity * item.product.price;
      }
    });

    cart.totalPrice = totalPrice;

    res.status(200).json({
      data: {
        cart
      }

    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === product);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    const p = await Product.findById(product);
    if (!p) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedQuantity = Math.min(Math.max(quantity, 1), p.quantity);
    cart.items[itemIndex].quantity = updatedQuantity;

    await cart.save();
    let totalPrice = 0;
    cart.items.forEach(item => {
      if (item.product && item.product.price) {
        totalPrice += item.quantity * item.product.price;
      }
    });

    res.status(200).json({ data: {
      ...cart,
      totalPrice,
    } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItemFromCart = async (req, res) => {
  try {
    const { product } = req.body; 
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    console.log(product)


    const itemIndex = cart?.items?.findIndex(item => item.product._id.toString() === product);
    
    console.log(itemIndex)
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();
    let totalPrice = 0;
    cart.items.forEach(item => {
      if (item.product && item.product.price) {
        totalPrice += item.quantity * item.product.price;
      }
    });

    res.status(200).json({ data: {
      ...cart,
      totalPrice
    } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];

    await cart.save();

    let totalPrice = 0;
    cart.items.forEach(item => {
      if (item.product && item.product.price) {
        totalPrice += item.quantity * item.product.price;
      }
    });

    res.status(200).json({ data: {
      ...cart,
      totalPrice
    } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

