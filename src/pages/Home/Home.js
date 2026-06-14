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
    <>
      <Header onAddTransaction={handleAddTransaction} />
      {isLoading ? (
        <main className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your expenses...</p>
        </main>
      ) : !hasTransactions ? (
        <EmptyState onAddTransaction={handleAddTransaction} />
      ) : (
        <main className="container">
          {/* Page Title */}
          <header className={styles.pageTitle}>
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
          </header>

          <section className={styles.overviewSection} aria-label="Financial overview metrics">
            <div className={styles.overviewRow}>
              <NetWorth />
              <aside className={styles.categoryChart} aria-label="Current month category spending">
                <BudgetChart />
              </aside>
            </div>
          </section>

          <section className={styles.recentTransactionsRow} aria-label="Recent transactions">
            <RecentTransactions scrollAfterItems={8} />
          </section>
        </main>
      )}
      <AddTransactionModal ref={modalRef} />
    </>
  );
}

export default Home;
