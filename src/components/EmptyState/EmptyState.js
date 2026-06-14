import React from 'react';
import { Coins, Plus } from 'lucide-react';
import styles from './EmptyState.module.scss';

function EmptyState({ onAddTransaction }) {
  return (
    <main className={styles.emptyStateContainer}>
      {/* Hero Section */}
      <section className={styles.emptyHero}>
        <div className={styles.emptyHeroIcon}>
          <Coins aria-hidden="true" focusable="false" />
        </div>
        <h1 className={styles.emptyHeroTitle}>
          Track Your <span>Spending</span> Effortlessly
        </h1>
        <p className={styles.emptyHeroSubtitle}>
          Take control of your finances. Log expenses, set budgets, and watch your money grow smarter.
        </p>
        <button className={styles.emptyBtnCta} onClick={onAddTransaction}>
          <Plus aria-hidden="true" focusable="false" /> Add Your First Transaction
        </button>
      </section>

      {/* Quick Start Section */}
      <section className={styles.emptyQuickStart}>
        <h2 className={styles.emptyQuickStartTitle}>Get Started in 3 Steps</h2>
        <p className={styles.emptyQuickStartSubtitle}>It takes less than a minute to start tracking</p>
        <ol className={styles.emptySteps}>
          <li className={styles.emptyStep}>
            <div className={styles.emptyStepNumber}>1</div>
            <h3 className={styles.emptyStepTitle}>Log a Transaction</h3>
            <p className={styles.emptyStepDescription}>
              Click the button above to record an expense or income.
            </p>
          </li>
          <li className={styles.emptyStep}>
            <div className={styles.emptyStepNumber}>2</div>
            <h3 className={styles.emptyStepTitle}>Categorize & Track</h3>
            <p className={styles.emptyStepDescription}>
              Organize transactions by category to see where your money goes.
            </p>
          </li>
          <li className={styles.emptyStep}>
            <div className={styles.emptyStepNumber}>3</div>
            <h3 className={styles.emptyStepTitle}>Analyze & Improve</h3>
            <p className={styles.emptyStepDescription}>
              View insights and adjust your spending habits.
            </p>
          </li>
        </ol>
      </section>
    </main>
  );
}

export default EmptyState;

