import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useExpense } from '../../contexts/ExpenseContext';
import { expenseTypeIcon as ExpenseIcon, incomeTypeIcon as IncomeIcon, renderCategoryIcon } from '../../utils/categoryIcons';
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
    { id: 'bills', name: 'Bills' },
    { id: 'baby', name: 'Baby' },
    { id: 'house', name: 'House' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'food', name: 'Food' },
    { id: 'transport', name: 'Transport' },
    { id: 'slava', name: 'Slava' }
  ];

  const incomeCategories = [
    { id: 'salary', name: 'Salary' },
    { id: 'other-income', name: 'Other' }
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
      iconBg: transactionType === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 217, 255, 0.1)',
      name: description,
      category: category.name,
      date: new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      rawDate: date,
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
      <dialog
        open={isOpen}
        className={`${styles.modalOverlay} ${isOpen ? styles.active : ''}`}
        id="addTransactionModal"
        aria-modal="true"
        aria-labelledby="add-transaction-title"
      >
        <article className={styles.modalContent}>
          <header className={styles.modalHeader}>
            <h2 id="add-transaction-title" className={styles.modalTitle}>Add Transaction</h2>
            <button className={styles.modalClose} onClick={closeModal}><span className={styles.modalCloseIcon}>&times;</span></button>
          </header>
          <section className={styles.modalBody}>
            {/* Transaction Type Selector */}
            <div className={styles.formGroup}>
              <div className={styles.transactionTypeTabs}>
                <button
                  className={`${styles.typeTab} ${transactionType === 'expense' ? styles.active : ''}`}
                  onClick={() => selectType('expense')}
                >
                  <ExpenseIcon aria-hidden="true" focusable="false" /> Expense
                </button>
                <button
                  className={`${styles.typeTab} ${transactionType === 'income' ? styles.active : ''}`}
                  onClick={() => selectType('income')}
                >
                  <IncomeIcon aria-hidden="true" focusable="false" /> Income
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="transaction-amount">Amount</label>
              <div className={styles.amountInputGroup}>
                <span className={styles.currencySymbol}>€</span>
                <input
                  id="transaction-amount"
                  ref={amountInputRef}
                  type="number"
                  className={`${styles.formInput} ${styles.amountInput}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
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
                    <span className={styles.categoryIconBtn}>
                      {renderCategoryIcon(category.name, category.id)}
                    </span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="transaction-description">Description</label>
              <input
                id="transaction-description"
                ref={descriptionInputRef}
                type="text"
                className={styles.formInput}
                placeholder="Add a note..."
              />
            </div>

            {/* Date */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="transaction-date">Date</label>
              <input
                id="transaction-date"
                type="date"
                className={styles.formInput}
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                required
              />
            </div>

            {/* Footer Buttons */}
            <footer className={styles.formFooter}>
              <button className={`${styles.btnModal} ${styles.btnModalSubmit}`} onClick={submitTransaction}>Add Transaction</button>
              <button className={`${styles.btnModal} ${styles.btnModalCancel}`} onClick={closeModal}>Cancel</button>
            </footer>
          </section>
        </article>
      </dialog>
    </>
  );
});

AddTransactionModal.displayName = 'AddTransactionModal';

export default AddTransactionModal;
