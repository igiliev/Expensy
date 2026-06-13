import React from 'react';
import { Landmark, TrendingDown, TrendingUp } from 'lucide-react';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './NetWorth.module.scss';

const getTransactionDate = (transaction) => new Date(transaction.dateISO || transaction.date);

const formatCurrency = (value) => `${value.toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}\u20ac`;

const getPercentChange = (current, previous) => {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
};

const formatPercentChange = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

function NetWorth() {
  const { expenseData } = useExpense();
  const transactions = expenseData.allTransactions || expenseData.transactions || [];
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthIndex = previousMonth.getMonth();
  const previousMonthYear = previousMonth.getFullYear();
  const currentMonthIndex = now.getMonth();
  const currentYear = now.getFullYear();

  const totals = transactions.reduce((acc, transaction) => {
    const amount = Math.abs(transaction.amount || 0);
    const isIncome = transaction.type === 'income';
    const transactionDate = getTransactionDate(transaction);
    const hasValidDate = !Number.isNaN(transactionDate.getTime());
    const isPreviousMonth = hasValidDate
      && transactionDate.getMonth() === previousMonthIndex
      && transactionDate.getFullYear() === previousMonthYear;
    const isCurrentMonth = hasValidDate
      && transactionDate.getMonth() === currentMonthIndex
      && transactionDate.getFullYear() === currentYear;

    if (hasValidDate) {
      const monthKey = `${transactionDate.getFullYear()}-${transactionDate.getMonth()}`;
      const monthTotals = acc.monthlyNetTotals[monthKey] || { income: 0, spending: 0 };

      if (isIncome) {
        monthTotals.income += amount;
        acc.totalIncome += amount;

        if (isCurrentMonth) {
          acc.currentMonthIncome += amount;
        }

        if (isPreviousMonth) {
          acc.previousMonthIncome += amount;
        }
      } else {
        monthTotals.spending += amount;
        acc.totalSpending += amount;

        if (isCurrentMonth) {
          acc.currentMonthExpenses += amount;
        }

        if (isPreviousMonth) {
          acc.previousMonthExpenses += amount;
        }
      }

      acc.monthlyNetTotals[monthKey] = monthTotals;
    }

    return acc;
  }, {
    monthlyNetTotals: {},
    currentMonthIncome: 0,
    currentMonthExpenses: 0,
    previousMonthIncome: 0,
    previousMonthExpenses: 0,
    totalIncome: 0,
    totalSpending: 0
  });

  const netWorth = Object.values(totals.monthlyNetTotals).reduce(
    (sum, monthTotals) => sum + monthTotals.income - monthTotals.spending,
    0
  );
  const currentMonthProfit = totals.currentMonthIncome - totals.currentMonthExpenses;
  const previousMonthProfit = totals.previousMonthIncome - totals.previousMonthExpenses;
  const incomeChange = getPercentChange(totals.currentMonthIncome, totals.previousMonthIncome);
  const expenseChange = getPercentChange(totals.currentMonthExpenses, totals.previousMonthExpenses);
  const growthRate = getPercentChange(currentMonthProfit, previousMonthProfit);
  const isProfitPositive = currentMonthProfit >= 0;

  return (
    <section className={styles.netWorthCard} aria-label="Net worth summary">
      <article className={`${styles.metricCard} ${styles.incomeCard}`}>
        <div>
          <span className={styles.metricLabel}>Total Income</span>
          <div className={`${styles.metricValue} ${styles.incomeValue}`}>
            {formatCurrency(totals.currentMonthIncome)}
          </div>
          <div className={`${styles.metricChange} ${styles.incomeTrend}`}>
            <TrendingUp aria-hidden="true" focusable="false" />
            {formatPercentChange(incomeChange)} vs last month
          </div>
        </div>
        <div className={styles.metricIcon}>
          <TrendingUp aria-hidden="true" focusable="false" />
        </div>
      </article>

      <article className={`${styles.metricCard} ${styles.expenseCard}`}>
        <div>
          <span className={styles.metricLabel}>Total Expenses</span>
          <div className={`${styles.metricValue} ${styles.expenseValue}`}>
            {formatCurrency(totals.currentMonthExpenses)}
          </div>
          <div className={`${styles.metricChange} ${styles.expenseTrend}`}>
            <TrendingDown aria-hidden="true" focusable="false" />
            {formatPercentChange(expenseChange)} vs last month
          </div>
        </div>
        <div className={`${styles.metricIcon} ${styles.expenseIcon}`}>
          <TrendingDown aria-hidden="true" focusable="false" />
        </div>
      </article>

      <article className={styles.netWorthStrip}>
        <div className={styles.netWorthSummary}>
          <div className={styles.netWorthIcon}>
            <Landmark aria-hidden="true" focusable="false" />
          </div>
          <div>
            <span className={styles.stripLabel}>Current Net Worth</span>
            <div className={styles.stripValue}>{formatCurrency(netWorth)}</div>
          </div>
        </div>

        <div className={styles.stripStats}>
          <div className={styles.stripStat}>
            <span className={styles.stripLabel}>Growth Rate</span>
            <strong className={growthRate >= 0 ? styles.positive : styles.negative}>
              {formatPercentChange(growthRate)} MoM
            </strong>
          </div>
          <div className={styles.stripStat}>
            <span className={styles.stripLabel}>MTD Profit</span>
            <strong className={isProfitPositive ? styles.positive : styles.negative}>
              {isProfitPositive ? '+' : ''}{formatCurrency(currentMonthProfit)}
            </strong>
          </div>
        </div>
      </article>
    </section>
  );
}

export default NetWorth;
