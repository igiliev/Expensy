import React, { useRef } from 'react';
import Header from '../../components/Header/Header';
import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
import SpendingChart from '../../components/SpendingChart/SpendingChart';
import BudgetChart from '../../components/BudgetChart/BudgetChart';
import SummaryCards from '../../components/SummaryCards/SummaryCards';
import Categories from '../../components/Categories/Categories';
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
            <h1 className={styles.pageTitleHeading}>My Spending</h1>
            <p className={styles.pageTitleSubtitle}>Track and manage my expenses efficiently</p>
          </div>

          {/* Financial Vital Signs Bar */}
          <SummaryCards />

          {/* Chart Section */}
          <div className={styles.chartSection}>
            <div className={styles.chartsRow}>
              <div className={styles.chartItem}>
                <SpendingChart />
              </div>
              <div className={styles.chartItem}>
                <BudgetChart />
              </div>
            </div>
          </div>

          {/* Categories and Transactions Side-by-Side */}
          <div className={styles.categoriesTransactionsRow}>
            <Categories />
            <RecentTransactions scrollAfterItems={8} />
          </div>
        </div>
      )}
      <AddTransactionModal ref={modalRef} />
    </div>
  );
}

export default Home;
