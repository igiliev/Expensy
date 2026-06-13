import React, { useRef } from 'react';
import Header from '../../components/Header/Header';
import SpendingChart from '../../components/SpendingChart/SpendingChart';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';
import { useAuth } from '../../contexts/AuthContext';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './SpendingOverview.module.scss';

function SpendingOverview() {
  const modalRef = useRef();
  const { initializing } = useAuth();
  const { loading } = useExpense();
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
          <p className="loading-text">Loading your spending overview...</p>
        </div>
      ) : (
        <div className="container">
          <div className={styles.pageTitle}>
            <h1 className={styles.pageTitleHeading}>Spending Overview</h1>
            <p className={styles.pageTitleSubtitle}>Track daily, monthly, and yearly spending trends</p>
          </div>
          <SpendingChart />
        </div>
      )}
      <AddTransactionModal ref={modalRef} />
    </div>
  );
}

export default SpendingOverview;
