const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/categories
// @desc    Get all categories for a user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({
      user: req.user._id,
      isActive: true
    }).sort({ name: 1 });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting categories'
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    console.error('Get category error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error getting category'
    });
  }
});

// @route   POST /api/categories
// @desc    Create new category
// @access  Private
router.post('/', [
  body('name', 'Category name is required').not().isEmpty().trim().isLength({ max: 30 }),
  body('icon', 'Category icon is required').not().isEmpty(),
  body('color', 'Color must be a valid hex color').optional().matches(/^#[0-9A-F]{6}$/i),
  body('type', 'Type must be income or expense').isIn(['income', 'expense'])
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, icon, color = '#00D9FF', type } = req.body;

    // Check if category with same name already exists for this user
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      user: req.user._id,
      isActive: true
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create({
      name,
      icon,
      color,
      type,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating category'
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private
router.put('/:id', [
  body('name').optional().not().isEmpty().trim().isLength({ max: 30 }),
  body('icon').optional().not().isEmpty(),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i),
  body('type').optional().isIn(['income', 'expense'])
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updates = req.body;

    // If name is being updated, check for duplicates
    if (updates.name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${updates.name}$`, 'i') },
        user: req.user._id,
        isActive: true,
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, isActive: true },
      updates,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Update category error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating category'
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category (soft delete)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    // Check if category has associated expenses
    const expenseCount = await Expense.countDocuments({
      category: req.params.id,
      user: req.user._id
    });

    if (expenseCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category that has associated expenses'
      });
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error deleting category'
    });
  }
});

// @route   GET /api/categories/stats/usage
// @desc    Get category usage statistics
// @access  Private
router.get('/stats/usage', async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 1);

    const categoryStats = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth, $lt: endOfMonth },
          type: 'expense'
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $group: {
          _id: '$category',
          name: { $first: '$categoryInfo.name' },
          icon: { $first: '$categoryInfo.icon' },
          color: { $first: '$categoryInfo.color' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Calculate percentages
    const totalExpenses = categoryStats.reduce((sum, cat) => sum + cat.total, 0);
    const statsWithPercentage = categoryStats.map(cat => ({
      ...cat,
      percentage: totalExpenses > 0 ? Math.round((cat.total / totalExpenses) * 100) : 0
    }));

    res.json({
      success: true,
      data: {
        categoryStats: statsWithPercentage,
        totalExpenses,
        period: {
          month: currentMonth,
          year: currentYear
        }
      }
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting category statistics'
    });
  }
});

module.exports = router;
