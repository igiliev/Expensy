import React from 'react';

function EmptyState({ onAddTransaction }) {
  return (
    <div className="empty-state-container">
      {/* Hero Section */}
      <div className="empty-hero">
        <div className="empty-hero-icon">💰</div>
        <h1 className="empty-hero-title">
          Track Your <span>Spending</span> Effortlessly
        </h1>
        <p className="empty-hero-subtitle">
          Take control of your finances. Log expenses, set budgets, and watch your money grow smarter.
        </p>
        <button className="empty-btn-cta" onClick={onAddTransaction}>
          <span>➕</span> Add Your First Transaction
        </button>
      </div>

      {/* Quick Start Section */}
      <div className="empty-quick-start">
        <h2 className="empty-quick-start-title">Get Started in 3 Steps</h2>
        <p className="empty-quick-start-subtitle">It takes less than a minute to start tracking</p>
        <div className="empty-steps">
          <div className="empty-step">
            <div className="empty-step-number">1</div>
            <h3 className="empty-step-title">Log a Transaction</h3>
            <p className="empty-step-description">
              Click the button above to record an expense or income.
            </p>
          </div>
          <div className="empty-step">
            <div className="empty-step-number">2</div>
            <h3 className="empty-step-title">Categorize & Track</h3>
            <p className="empty-step-description">
              Organize transactions by category to see where your money goes.
            </p>
          </div>
          <div className="empty-step">
            <div className="empty-step-number">3</div>
            <h3 className="empty-step-title">Analyze & Improve</h3>
            <p className="empty-step-description">
              View insights and adjust your spending habits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmptyState;

