import React, { useState, useEffect } from 'react';
import { useExpense } from '../../contexts/ExpenseContext';

function AddTransactionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [selectedCategory, setSelectedCategory] = useState('bills');
  const { addTransaction } = useExpense();

  const expenseCategories = [
    { id: 'bills', icon: '📄', name: 'Bills' },
    { id: 'baby', icon: '👶', name: 'Baby' },
    { id: 'house', icon: '🏠', name: 'House' },
    { id: 'entertainment', icon: '🎬', name: 'Entertainment' },
    { id: 'food', icon: '🍔', name: 'Food' },
    { id: 'transport', icon: '🚗', name: 'Transport' }
  ];

  const incomeCategories = [
    { id: 'salary', icon: '💰', name: 'Salary' },
    { id: 'other-income', icon: '💵', name: 'Other' }
  ];

  // Use different categories based on transaction type
  const categories = transactionType === 'income' ? incomeCategories : expenseCategories;

  const selectType = (type) => {
    setTransactionType(type);
    // Reset to appropriate first category based on type
    setSelectedCategory(type === 'income' ? 'salary' : 'bills');
  };

  const selectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Reset form
    setTransactionType('expense');
    setSelectedCategory('bills');
  };

  const submitTransaction = () => {
    const amountInput = document.querySelector('.amount-input');
    const descriptionInput = document.querySelector('input[type="text"]');
    const dateInput = document.querySelector('input[type="date"]');

    const amount = parseFloat(amountInput?.value);
    const description = descriptionInput?.value || 'Transaction';
    const date = dateInput?.value || new Date().toISOString().split('T')[0];

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Find the selected category
    const category = categories.find(cat => cat.id === selectedCategory);

    // Create transaction object
    const transaction = {
      id: Date.now(), // Simple ID generation
      icon: category.icon,
      iconBg: transactionType === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 217, 255, 0.1)',
      name: description,
      category: category.name,
      date: new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      amount: transactionType === 'income' ? amount : -amount,
      type: transactionType
    };

    // Add transaction to context
    addTransaction(transaction);

    alert('Transaction added successfully!');
    closeModal();
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-400 to-cyan-600 text-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 z-40"
      >
        <span className="text-2xl font-bold">+</span>
      </button>

      {/* Modal Overlay */}
      <div className={`modal-overlay ${isOpen ? 'active' : ''}`} id="addTransactionModal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Add Transaction</h2>
            <button className="modal-close" onClick={closeModal}>&times;</button>
          </div>
          <div className="modal-body">
            {/* Transaction Type Selector */}
            <div className="form-group">
              <div className="transaction-type-tabs">
                <button
                  className={`type-tab ${transactionType === 'expense' ? 'active' : ''}`}
                  onClick={() => selectType('expense')}
                >
                  <span>💰</span> Expense
                </button>
                <button
                  className={`type-tab ${transactionType === 'income' ? 'active' : ''}`}
                  onClick={() => selectType('income')}
                >
                  <span>💵</span> Income
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="form-group">
              <label className="form-label">Amount</label>
              <div className="amount-input-group">
                <span className="currency-symbol">€</span>
                <input
                  type="number"
                  className="form-input amount-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="form-group" id="categoryGroup">
              <label className="form-label">Category</label>
              <div className="category-grid">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => selectCategory(category.id)}
                  >
                    <span className="category-icon-btn">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <input type="text" className="form-input" placeholder="Add a note..." />
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" />
            </div>

            {/* Footer Buttons */}
            <div className="form-footer">
              <button className="btn-modal btn-modal-submit" onClick={submitTransaction}>Add Transaction</button>
              <button className="btn-modal btn-modal-cancel" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTransactionModal;
