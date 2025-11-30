const express = require('express');
const { body, validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/expenses
// @desc    Get all expenses for a user with filtering and pagination
// @access  Private
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { user: req.user._id };

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    // Type filter
    if (req.query.type && ['income', 'expense'].includes(req.query.type)) {
      filter.type = req.query.type;
    }

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Search filter
    if (req.query.search) {
      filter.description = { $regex: req.query.search, $options: 'i' };
    }

    const expenses = await Expense.find(filter)
      .populate('category', 'name icon color type')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments(filter);

    res.json({
      success: true,
      data: {
        expenses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting expenses'
    });
  }
});

// @route   GET /api/expenses/:id
// @desc    Get single expense
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('category', 'name icon color type');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: { expense }
    });
  } catch (error) {
    console.error('Get expense error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error getting expense'
    });
  }
});

// @route   POST /api/expenses
// @desc    Create new expense
// @access  Private
router.post('/', [
  body('amount', 'Amount is required and must be positive').isFloat({ min: 0.01 }),
  body('description', 'Description is required').not().isEmpty().trim().isLength({ max: 200 }),
  body('category', 'Category is required').not().isEmpty(),
  body('type', 'Type must be income or expense').isIn(['income', 'expense']),
  body('date', 'Date is required').isISO8601()
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

    const { amount, description, category, type, date, tags, notes } = req.body;

    // Verify category exists and belongs to user
    const categoryExists = await Category.findOne({
      _id: category,
      user: req.user._id
    });

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    // Verify category type matches expense type
    if (categoryExists.type !== type) {
      return res.status(400).json({
        success: false,
        message: `Category type (${categoryExists.type}) does not match expense type (${type})`
      });
    }

    const expense = await Expense.create({
      amount,
      description,
      category,
      type,
      date,
      user: req.user._id,
      tags: tags || [],
      notes
    });

    await expense.populate('category', 'name icon color type');

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { expense }
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating expense'
    });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', [
  body('amount').optional().isFloat({ min: 0.01 }),
  body('description').optional().not().isEmpty().trim().isLength({ max: 200 }),
  body('category').optional().not().isEmpty(),
  body('type').optional().isIn(['income', 'expense']),
  body('date').optional().isISO8601()
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

    // If category is being updated, verify it exists and belongs to user
    if (updates.category) {
      const categoryExists = await Category.findOne({
        _id: updates.category,
        user: req.user._id
      });

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }

      // If type is also being updated, verify category type matches
      if (updates.type && categoryExists.type !== updates.type) {
        return res.status(400).json({
          success: false,
          message: `Category type (${categoryExists.type}) does not match expense type (${updates.type})`
        });
      }
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    ).populate('category', 'name icon color type');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: { expense }
    });
  } catch (error) {
    console.error('Update expense error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating expense'
    });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error deleting expense'
    });
  }
});

// @route   GET /api/expenses/stats/summary
// @desc    Get expense statistics summary
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const monthlySummary = await Expense.getMonthlySummary(req.user._id, currentYear, currentMonth);

    // Get category breakdown for current month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 1);

    const categoryBreakdown = await Expense.getExpensesByCategory(
      req.user._id,
      startOfMonth,
      endOfMonth
    );

    // Calculate totals
    const totalIncome = monthlySummary.income.total;
    const totalExpenses = monthlySummary.expense.total;
    const netBalance = totalIncome - totalExpenses;

    res.json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpenses,
          netBalance,
          incomeCount: monthlySummary.income.count,
          expenseCount: monthlySummary.expense.count
        },
        categoryBreakdown,
        period: {
          month: currentMonth,
          year: currentYear
        }
      }
    });
  } catch (error) {
    console.error('Get stats summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting statistics'
    });
  }
});

module.exports = router;
