import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useExpense } from '../../contexts/ExpenseContext';

const AddTransactionModal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [selectedCategory, setSelectedCategory] = useState('bills');
  const [currentDate, setCurrentDate] = useState('');
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

  // Expose openModal method to parent component
  useImperativeHandle(ref, () => ({
    openModal: () => {
      // Set current date when modal opens
      setCurrentDate(new Date().toISOString().split('T')[0]);
      setIsOpen(true);
    }
  }));

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
    setCurrentDate('');
  };

  const submitTransaction = async () => {
    const amountInput = document.querySelector('.amount-input');
    const descriptionInput = document.querySelector('input[type="text"]');

    const amount = parseFloat(amountInput?.value);
    const description = descriptionInput?.value || 'Transaction';
    const date = currentDate || new Date().toISOString().split('T')[0];

    if (!amount || amount <= 0) {
      // Could add visual feedback here instead of alert
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

    // Add transaction to context (now saves to API)
    const result = await addTransaction(transaction);

    if (result.success) {
      closeModal();
    } else {
      // Could show error state in the modal instead of alert
      console.error('Failed to add transaction:', result.error);
    }
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
              <input
                type="date"
                className="form-input"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
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
});

AddTransactionModal.displayName = 'AddTransactionModal';

export default AddTransactionModal;
