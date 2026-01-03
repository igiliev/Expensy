import React from 'react';
import { useExpense } from '../../contexts/ExpenseContext';

function RecentTransactions() {
  const { expenseData, deleteTransaction } = useExpense();

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const result = await deleteTransaction(transactionId);
      if (!result.success) {
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  return (
    <div className="section transactions-section">
      <div className="section-title">Recent Transactions</div>
      <div className="transaction-list">
        {expenseData.transactions.length > 0 ? (
          expenseData.transactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-icon" style={{background: transaction.iconBg}}>
                {transaction.icon}
              </div>
              <div className="transaction-details">
                <div className="transaction-name">{transaction.name}</div>
                <div className="transaction-category">{transaction.category}</div>
              </div>
              <div className="transaction-date">{transaction.date}</div>
              <div className={`transaction-amount ${transaction.type}`}>
                {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()}€
              </div>
              <button
                className="transaction-delete-btn"
                onClick={() => handleDeleteTransaction(transaction.id)}
                title="Delete transaction"
              >
                <span className="transaction-delete-btn-icon">×</span>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions yet</p>
            <p className="text-sm mt-2">Add your first transaction to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentTransactions;
