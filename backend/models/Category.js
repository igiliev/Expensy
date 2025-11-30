const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [30, 'Category name must be less than 30 characters']
  },
  icon: {
    type: String,
    required: [true, 'Category icon is required'],
    default: '📁'
  },
  color: {
    type: String,
    default: '#00D9FF',
    match: [
      /^#[0-9A-F]{6}$/i,
      'Color must be a valid hex color code'
    ]
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'],
    default: 'expense'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate categories per user
categorySchema.index({ name: 1, user: 1 }, { unique: true });

// Static method to get default categories
categorySchema.statics.getDefaultCategories = function() {
  return [
    { name: 'Income', icon: '💰', color: '#10B981', type: 'income', isDefault: true },
    { name: 'Food & Dining', icon: '🍔', color: '#F97316', type: 'expense', isDefault: true },
    { name: 'Transportation', icon: '🚕', color: '#A855F7', type: 'expense', isDefault: true },
    { name: 'Entertainment', icon: '🎬', color: '#EC4899', type: 'expense', isDefault: true },
    { name: 'Utilities', icon: '💡', color: '#3B82F6', type: 'expense', isDefault: true },
    { name: 'Shopping', icon: '🛍️', color: '#00D9FF', type: 'expense', isDefault: true },
    { name: 'Healthcare', icon: '🏥', color: '#EF4444', type: 'expense', isDefault: true },
    { name: 'Education', icon: '📚', color: '#8B5CF6', type: 'expense', isDefault: true }
  ];
};

module.exports = mongoose.model('Category', categorySchema);
