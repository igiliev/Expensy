import React from 'react';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './SummaryCards.module.scss';

function SummaryCards() {
  const { summary } = useExpense();

  return (
    <div className={styles.summaryStrip}>
      <div className={styles.summaryItem}>
        <div className={styles.summaryLabel}>Total Income</div>
        <div className={`${styles.summaryValue} ${styles.income}`}>{summary.totalIncome.toLocaleString()}€</div>
      </div>
      <div className={styles.summaryItem}>
        <div className={styles.summaryLabel}>Total Expenses</div>
        <div className={`${styles.summaryValue} ${styles.expense}`}>{summary.totalExpenses.toLocaleString()}€</div>
      </div>
      <div className={styles.summaryItem}>
        <div className={styles.summaryLabel}>Net Balance</div>
        <div className={`${styles.summaryValue} ${summary.netBalance >= 0 ? styles.balance : styles.expense}`}>
          {summary.netBalance >= 0 ? '+' : ''}{summary.netBalance.toLocaleString()}€
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
