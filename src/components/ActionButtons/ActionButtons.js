import React from 'react';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './ActionButtons.module.scss';

function ActionButtons() {
  const { resetAllData } = useExpense();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all expenses and income for the current month? This action cannot be undone.')) {
      resetAllData();
    }
  };

  return (
    <div className={styles.actionButtons}>
      <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnFullWidth}`} onClick={handleReset}>
        Reset Month
      </button>
    </div>
  );
}

export default ActionButtons;
