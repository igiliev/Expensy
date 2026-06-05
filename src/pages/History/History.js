import React, { useRef } from 'react';
import Header from '../../components/Header/Header';
import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import { useExpense } from '../../contexts/ExpenseContext';
import { useAuth } from '../../contexts/AuthContext';
import styles from './History.module.scss';

function History() {
  const modalRef = useRef();
  const { expenseData, loading } = useExpense();
  const { initializing } = useAuth();
  const isLoading = initializing || loading;

  const handleAddTransaction = () => {
    if (modalRef.current) {
      modalRef.current.openModal();
    }
  };

  return (
    <div>
      <Header onAddTransaction={handleAddTransaction} />
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your history...</p>
        </div>
      ) : (
        <div className="container">
          <div className={styles.pageTitle}>
            <h1 className={styles.pageTitleHeading}>History</h1>
            <p className={styles.pageTitleSubtitle}>Transactions from previous months</p>
          </div>

          <RecentTransactions
            title="History"
            transactions={expenseData.historyTransactions}
            emptyTitle="No history yet"
            emptySubtitle="Transactions older than the current month will appear here"
            paginate
            pageSize={10}
          />
        </div>
      )}
      <AddTransactionModal ref={modalRef} />
    </div>
  );
}

export default History;
