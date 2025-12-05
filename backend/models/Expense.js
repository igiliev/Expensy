const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  icon: {
    type: String,
    default: function() {
      // Default icons based on category
      const iconMap = {
        'Bills': '📄',
        'Baby': '👶',
        'House': '🏠',
        'Entertainment': '🎬',
        'Food': '🍔',
        'Transport': '🚗',
        'Salary': '💰',
        'Other': '💵'
      };
      return iconMap[this.category] || '💰';
    }
  }
}, {
  timestamps: true
});

// Index for faster queries by user and date
expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);


