import React from 'react';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './RecentTransactions.module.scss';

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
    <div className={`section ${styles.transactionsSection}`}>
      <div className="section-title">Recent Transactions</div>
      <div className={styles.transactionList}>
        {expenseData.transactions.length > 0 ? (
          expenseData.transactions.map(transaction => (
            <div key={transaction.id} className={styles.transactionItem}>
              <div className={styles.transactionIcon} style={{background: transaction.iconBg}}>
                {transaction.icon}
              </div>
              <div className={styles.transactionDetails}>
                <div className={styles.transactionName}>{transaction.name}</div>
                <div className={styles.transactionCategory}>{transaction.category}</div>
              </div>
              <div className={styles.transactionDate}>{transaction.date}</div>
              <div className={`${styles.transactionAmount} ${styles[transaction.type]}`}>
                {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()}€
              </div>
              <button
                className={styles.transactionDeleteBtn}
                onClick={() => handleDeleteTransaction(transaction.id)}
                title="Delete transaction"
              >
                <span className={styles.transactionDeleteBtnIcon}>×</span>
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
