import React from 'react';
import { useExpense } from '../../contexts/ExpenseContext';

function SummaryCards() {
  const { summary } = useExpense();

  return (
    <div className="section">
      <div className="section-title">This Month</div>
      <div className="summary-card">
        <div className="summary-item">
          <div className="summary-label">Total Income</div>
          <div className="summary-value income">{summary.totalIncome.toLocaleString()}€</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Total Expenses</div>
          <div className="summary-value expense">{summary.totalExpenses.toLocaleString()}€</div>
        </div>
      </div>
      <div style={{marginTop: '16px'}}>
        <div className="summary-item">
          <div className="summary-label">Net Balance</div>
          <div className={`summary-value ${summary.netBalance >= 0 ? 'balance' : 'expense'}`}>
            {summary.netBalance >= 0 ? '+' : ''}{summary.netBalance.toLocaleString()}€
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
