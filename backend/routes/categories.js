const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const Category = require('../models/Category');

// POST /api/categories - Admin only: Add product category
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create category' });
  }
});

module.exports = router; 