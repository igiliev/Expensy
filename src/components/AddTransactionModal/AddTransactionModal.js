import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './AddTransactionModal.module.scss';

const AddTransactionModal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [selectedCategory, setSelectedCategory] = useState('bills');
  const [currentDate, setCurrentDate] = useState('');
  const { addTransaction } = useExpense();
  const amountInputRef = React.useRef(null);
  const descriptionInputRef = React.useRef(null);

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
    if (amountInputRef.current) amountInputRef.current.value = '';
    if (descriptionInputRef.current) descriptionInputRef.current.value = '';
  };

  const submitTransaction = async () => {
    const amount = parseFloat(amountInputRef.current?.value);
    const description = descriptionInputRef.current?.value || 'Transaction';
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
      // Check if click is on the modal overlay (not on modal content)
      const modalOverlay = document.getElementById('addTransactionModal');
      if (modalOverlay && e.target === modalOverlay) {
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
      <div className={`${styles.modalOverlay} ${isOpen ? styles.active : ''}`} id="addTransactionModal">
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Add Transaction</h2>
            <button className={styles.modalClose} onClick={closeModal}><span className={styles.modalCloseIcon}>&times;</span></button>
          </div>
          <div className={styles.modalBody}>
            {/* Transaction Type Selector */}
            <div className={styles.formGroup}>
              <div className={styles.transactionTypeTabs}>
                <button
                  className={`${styles.typeTab} ${transactionType === 'expense' ? styles.active : ''}`}
                  onClick={() => selectType('expense')}
                >
                  <span>💰</span> Expense
                </button>
                <button
                  className={`${styles.typeTab} ${transactionType === 'income' ? styles.active : ''}`}
                  onClick={() => selectType('income')}
                >
                  <span>💵</span> Income
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Amount</label>
              <div className={styles.amountInputGroup}>
                <span className={styles.currencySymbol}>€</span>
                <input
                  ref={amountInputRef}
                  type="number"
                  className={`${styles.formInput} ${styles.amountInput}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className={styles.formGroup} id="categoryGroup">
              <label className={styles.formLabel}>Category</label>
              <div className={styles.categoryGrid}>
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`${styles.categoryBtn} ${selectedCategory === category.id ? styles.active : ''}`}
                    onClick={() => selectCategory(category.id)}
                  >
                    <span className={styles.categoryIconBtn}>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description</label>
              <input ref={descriptionInputRef} type="text" className={styles.formInput} placeholder="Add a note..." />
            </div>

            {/* Date */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Date</label>
              <input
                type="date"
                className={styles.formInput}
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
            </div>

            {/* Footer Buttons */}
            <div className={styles.formFooter}>
              <button className={`${styles.btnModal} ${styles.btnModalSubmit}`} onClick={submitTransaction}>Add Transaction</button>
              <button className={`${styles.btnModal} ${styles.btnModalCancel}`} onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

AddTransactionModal.displayName = 'AddTransactionModal';

export default AddTransactionModal;
