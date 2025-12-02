import React from 'react';
import Header from '../../components/Header/Header';
import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
import SpendingChart from '../../components/SpendingChart/SpendingChart';
import SummaryCards from '../../components/SummaryCards/SummaryCards';
import Categories from '../../components/Categories/Categories';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';

function Home() {
  return (
    <div>
      <Header />
      <div className="container">
        {/* Page Title */}
        <div style={{marginBottom: '8px'}}>
          <h1 style={{fontSize: '32px', fontWeight: '700'}}>Your Spending</h1>
          <p style={{color: '#8B93A8', marginTop: '8px', fontSize: '15px'}}>Track and manage your expenses efficiently</p>
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
            <SummaryCards />
            <div style={{marginTop: '24px'}}>
              <Categories />
            </div>
            <ActionButtons />
          </div>
        </div>
      </div>
      <AddTransactionModal />
    </div>
  );
}

export default Home;
