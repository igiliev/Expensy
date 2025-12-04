import React from 'react';
import { useExpense } from '../../contexts/ExpenseContext';

function ActionButtons() {
  const { resetAllData } = useExpense();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all expenses and income for the current month? This action cannot be undone.')) {
      resetAllData();
    }
  };

  return (
    <div className="section">
      <div className="action-buttons">
        <button className="btn btn-primary" onClick={() => document.querySelector('button.fixed').click()}>
          + Add Transaction
        </button>
        <button className="btn btn-secondary btn-full-width" onClick={handleReset}>
          Reset Month
        </button>
      </div>
    </div>
  );
}

export default ActionButtons;
