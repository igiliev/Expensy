import React from 'react';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './RecentTransactions.module.scss';

function RecentTransactions({
  title = 'Recent Transactions',
  transactions,
  emptyTitle = 'No transactions yet',
  emptySubtitle = 'Add your first transaction to get started'
}) {
  const { expenseData, deleteTransaction } = useExpense();
  const transactionsToRender = transactions || expenseData.transactions;

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
      <div className="section-title">{title}</div>
      <div className={styles.transactionList}>
        {transactionsToRender.length > 0 ? (
          transactionsToRender.map(transaction => (
            <div key={transaction.id} className={styles.transactionItem}>
              <div className={styles.transactionIcon} style={{background: transaction.iconBg}}>
                {transaction.icon}
              </div>
              <div className={styles.transactionDetails}>
                <span>{transaction.name}</span>
                <span>{transaction.category}</span>
                <span>{transaction.date}</span>
              </div>
              <div className={`${styles.transactionAmount} ${transaction.type === 'income' || transaction.amount > 0 ? styles.income : styles.expense}`}>
                <span>{transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()}€</span>
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
            <p>{emptyTitle}</p>
            <p className="text-sm mt-2">{emptySubtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentTransactions;
