const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description must be less than 200 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'],
    default: 'expense'
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag must be less than 20 characters']
  }],
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: function() { return this.isRecurring; }
    },
    endDate: {
      type: Date
    }
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }],
  notes: {
    type: String,
    maxlength: [500, 'Notes must be less than 500 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ user: 1, type: 1 });

// Virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function() {
  return this.type === 'expense' ? `-${this.amount}€` : `+${this.amount}€`;
});

// Method to get monthly summary
expenseSchema.statics.getMonthlySummary = async function(userId, year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const result = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  return result.reduce((acc, item) => {
    acc[item._id] = { total: item.total, count: item.count };
    return acc;
  }, { income: { total: 0, count: 0 }, expense: { total: 0, count: 0 } });
};

// Method to get expenses by category
expenseSchema.statics.getExpensesByCategory = async function(userId, startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lt: endDate },
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
};

module.exports = mongoose.model('Expense', expenseSchema);
