import React from 'react';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './SummaryCards.module.scss';

function SummaryCards() {
  const { summary } = useExpense();
  const currency = '\u20ac';

  return (
    <section className={styles.summaryStrip} aria-label="Monthly financial summary">
      <article className={styles.summaryItem}>
        <p className={styles.summaryLabel}>Total Income</p>
        <p className={`${styles.summaryValue} ${styles.income}`}>
          {summary.totalIncome.toLocaleString()}{currency}
        </p>
      </article>
      <article className={styles.summaryItem}>
        <p className={styles.summaryLabel}>Total Expenses</p>
        <p className={`${styles.summaryValue} ${styles.expense}`}>
          {summary.totalExpenses.toLocaleString()}{currency}
        </p>
      </article>
      <article className={styles.summaryItem}>
        <p className={styles.summaryLabel}>Net Balance</p>
        <p className={`${styles.summaryValue} ${summary.netBalance >= 0 ? styles.balance : styles.expense}`}>
          {summary.netBalance >= 0 ? '+' : ''}{summary.netBalance.toLocaleString()}{currency}
        </p>
      </article>
    </section>
  );
}

export default SummaryCards;
