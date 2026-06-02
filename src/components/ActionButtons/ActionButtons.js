import React from 'react';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './ActionButtons.module.scss';

function ActionButtons() {
  const { resetCurrentMonth } = useExpense();

  const handleReset = () => {
    if (window.confirm('Reset this month? Your previous transactions will be hidden from the dashboard, but kept for history.')) {
      resetCurrentMonth();
    }
  };

  return (
    <div className={styles.actionButtons}>
      <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnFullWidth}`} onClick={handleReset}>
        Reset month
      </button>
    </div>
  );
}

export default ActionButtons;
