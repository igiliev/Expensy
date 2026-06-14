import React, { useRef } from 'react';
import Header from '../../components/Header/Header';
import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
import BudgetChart from '../../components/BudgetChart/BudgetChart';
import NetWorth from '../../components/NetWorth/NetWorth';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import EmptyState from '../../components/EmptyState/EmptyState';
import { useExpense } from '../../contexts/ExpenseContext';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Home.module.scss';

function Home() {
  const modalRef = useRef();
  const { expenseData, loading } = useExpense();
  const { initializing } = useAuth();
  const hasTransactions = expenseData.allTransactions
    ? expenseData.allTransactions.length > 0
    : expenseData.transactions && expenseData.transactions.length > 0;
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
          <p className="loading-text">Loading your expenses...</p>
        </div>
      ) : !hasTransactions ? (
        <EmptyState onAddTransaction={handleAddTransaction} />
      ) : (
        <div className="container">
          {/* Page Title */}
          <div className={styles.pageTitle}>
            <div className={styles.pageTitleInner}>
              <h1 className={styles.pageTitleHeading}>Financial Overview</h1>
              <p className={styles.pageTitleSubtitle}>
                Your performance is up 12.4% this month. Manage your transactions and track wealth growth effortlessly.
              </p>
            </div>
            <div className={styles.timePeriodCard} aria-label="Current time period">
              <span className={styles.timePeriodLabel}>Time Period</span>
              <span className={styles.timePeriodValue}>This Month</span>
            </div>
          </div>

          <div className={styles.overviewSection}>
            <div className={styles.overviewRow}>
              <NetWorth />
              <div className={styles.categoryChart}>
                <BudgetChart />
              </div>
            </div>
          </div>

          <div className={styles.recentTransactionsRow}>
            <RecentTransactions scrollAfterItems={8} />
          </div>
        </div>
      )}
      <AddTransactionModal ref={modalRef} />
    </div>
  );
}

export default Home;
