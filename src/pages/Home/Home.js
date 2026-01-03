import React, { useRef } from 'react';
import Header from '../../components/Header/Header';
import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
import SpendingChart from '../../components/SpendingChart/SpendingChart';
import SummaryCards from '../../components/SummaryCards/SummaryCards';
import Categories from '../../components/Categories/Categories';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import AddTransactionModal from '../../components/AddTransactionModal/AddTransactionModal';

function Home() {
  const modalRef = useRef();

  const handleAddTransaction = () => {
    if (modalRef.current) {
      modalRef.current.openModal();
    }
  };

  return (
    <div>
      <Header onAddTransaction={handleAddTransaction} />
      <div className="container">
        {/* Page Title */}
        <div style={{marginBottom: '40px'}}>
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
            <div>
              <SummaryCards />
            </div>
            <div style={{marginTop: '24px'}}>
              <Categories />
            </div>
          </div>
        </div>
      </div>
      <AddTransactionModal ref={modalRef} />
    </div>
  );
}

export default Home;
