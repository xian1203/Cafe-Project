const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// GET /api/orders - Get current user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/my - Get current user's orders (alias)
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST /api/orders - Place an order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const order = new Order({ ...req.body, user: req.user.id });
    await order.save();
    await order.populate('items.product');
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Failed to place order' });
  }
});

// PUT /api/orders/:id/cancel - Cancel an order
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if order can be cancelled (within 3 minutes of creation)
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = Date.now();
    const timeDifference = 180000 - (currentTime - orderTime); // 3 minutes

    if (timeDifference <= 0) {
      return res.status(400).json({ error: 'Order can no longer be cancelled' });
    }

    if (order.status !== 'processing') {
      return res.status(400).json({ error: 'Order cannot be cancelled in its current status' });
    }

    order.status = 'cancelled';
    await order.save();
    await order.populate('items.product');
    
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Failed to cancel order' });
  }
});

module.exports = router; 