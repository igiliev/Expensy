const express = require('express');
const { body, validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to format expense for frontend
const formatExpenseForFrontend = (expense) => {
  return {
    id: expense._id,
    icon: expense.icon,
    iconBg: expense.type === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 217, 255, 0.1)',
    name: expense.description,
    category: expense.category,
    date: new Date(expense.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    amount: expense.type === 'income' ? expense.amount : -expense.amount,
    type: expense.type
  };
};

// @route   GET /api/expenses
// @desc    Get all expenses for authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get all expenses for the authenticated user, sorted by date (newest first)
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 })
      .lean();

    // Format expenses for frontend
    const formattedExpenses = expenses.map(formatExpenseForFrontend);

    res.json({
      success: true,
      data: formattedExpenses
    });

  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expenses'
    });
  }
});

// @route   POST /api/expenses
// @desc    Add a new expense for authenticated user
// @access  Private
router.post('/', auth, [
  // Validation middleware
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('description')
    .notEmpty()
    .trim()
    .withMessage('Description is required'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
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

    const { type, amount, category, description, date } = req.body;

    // Create new expense
    const expense = new Expense({
      user: req.user._id,
      type,
      amount,
      category,
      description,
      date: date ? new Date(date) : new Date()
    });

    await expense.save();

    // Format the saved expense for frontend response
    const formattedExpense = formatExpenseForFrontend(expense);

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: formattedExpense
    });

  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding expense'
    });
  }
});

module.exports = router;



