import React, { useRef } from 'react';
import Header from '../../components/Header/Header';
import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
import SpendingChart from '../../components/SpendingChart/SpendingChart';
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
  const hasTransactions = expenseData.transactions && expenseData.transactions.length > 0;
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
            <h1 className={styles.pageTitleHeading}>Your Spending</h1>
            <p className={styles.pageTitleSubtitle}>Track and manage my expenses efficiently</p>
          </div>

          {/* Main Layout */}
          <div className="layout">
            {/* Left Column */}
            <div>
              <SpendingChart />
              <RecentTransactions />
            </div>

            {/* Right Column */}
            <div className="right-column">
              <div>
                <SummaryCards />
              </div>
              <div style={{marginTop: '24px'}}>
                <Categories />
              </div>
            </div>
          </div>
        </div>
      )}
      <AddTransactionModal ref={modalRef} />
    </div>
  );
}

export default Home;
