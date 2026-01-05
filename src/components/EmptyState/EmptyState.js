import React from 'react';
import styles from './EmptyState.module.scss';

function EmptyState({ onAddTransaction }) {
  return (
    <div className={styles.emptyStateContainer}>
      {/* Hero Section */}
      <div className={styles.emptyHero}>
        <div className={styles.emptyHeroIcon}>💰</div>
        <h1 className={styles.emptyHeroTitle}>
          Track Your <span>Spending</span> Effortlessly
        </h1>
        <p className={styles.emptyHeroSubtitle}>
          Take control of your finances. Log expenses, set budgets, and watch your money grow smarter.
        </p>
        <button className={styles.emptyBtnCta} onClick={onAddTransaction}>
          <span>➕</span> Add Your First Transaction
        </button>
      </div>

      {/* Quick Start Section */}
      <div className={styles.emptyQuickStart}>
        <h2 className={styles.emptyQuickStartTitle}>Get Started in 3 Steps</h2>
        <p className={styles.emptyQuickStartSubtitle}>It takes less than a minute to start tracking</p>
        <div className={styles.emptySteps}>
          <div className={styles.emptyStep}>
            <div className={styles.emptyStepNumber}>1</div>
            <h3 className={styles.emptyStepTitle}>Log a Transaction</h3>
            <p className={styles.emptyStepDescription}>
              Click the button above to record an expense or income.
            </p>
          </div>
          <div className={styles.emptyStep}>
            <div className={styles.emptyStepNumber}>2</div>
            <h3 className={styles.emptyStepTitle}>Categorize & Track</h3>
            <p className={styles.emptyStepDescription}>
              Organize transactions by category to see where your money goes.
            </p>
          </div>
          <div className={styles.emptyStep}>
            <div className={styles.emptyStepNumber}>3</div>
            <h3 className={styles.emptyStepTitle}>Analyze & Improve</h3>
            <p className={styles.emptyStepDescription}>
              View insights and adjust your spending habits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmptyState;

