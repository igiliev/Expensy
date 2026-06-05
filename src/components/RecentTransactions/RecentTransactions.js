import React, { useEffect, useMemo, useState } from 'react';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './RecentTransactions.module.scss';

const TRANSACTION_ITEM_HEIGHT = 80;
const TRANSACTION_LIST_GAP = 12;

function RecentTransactions({
  title = 'Recent Transactions',
  transactions,
  emptyTitle = 'No transactions yet',
  emptySubtitle = 'Add your first transaction to get started',
  paginate = false,
  pageSize = 10,
  scrollAfterItems
}) {
  const { expenseData, deleteTransaction } = useExpense();
  const transactionsToRender = transactions || expenseData.transactions;
  const [currentPage, setCurrentPage] = useState(1);
  const shouldLimitScroll = !paginate
    && scrollAfterItems
    && transactionsToRender.length > scrollAfterItems;

  const totalPages = paginate
    ? Math.max(1, Math.ceil(transactionsToRender.length / pageSize))
    : 1;

  useEffect(() => {
    setCurrentPage(page => Math.min(page, totalPages));
  }, [totalPages]);

  const visibleTransactions = useMemo(() => {
    if (!paginate) {
      return transactionsToRender;
    }

    const startIndex = (currentPage - 1) * pageSize;
    return transactionsToRender.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, paginate, transactionsToRender]);

  const paginationItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) {
      pages.push('start-ellipsis');
    }

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    if (endPage < totalPages - 1) {
      pages.push('end-ellipsis');
    }

    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  const pageStart = transactionsToRender.length === 0
    ? 0
    : (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, transactionsToRender.length);
  const transactionListStyle = shouldLimitScroll
    ? {
        maxHeight: `${(scrollAfterItems * TRANSACTION_ITEM_HEIGHT) + ((scrollAfterItems - 1) * TRANSACTION_LIST_GAP)}px`
      }
    : undefined;

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const result = await deleteTransaction(transactionId);
      if (!result.success) {
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  return (
    <div className={`section ${styles.transactionsSection}`}>
      <div className={styles.sectionHeader}>
        <div className="section-title">{title}</div>
        {paginate && transactionsToRender.length > 0 && (
          <div className={styles.pageSummary}>
            Showing {pageStart}-{pageEnd} of {transactionsToRender.length}
          </div>
        )}
      </div>
      <div
        className={`${styles.transactionList} ${shouldLimitScroll ? styles.scrollableList : ''}`}
        style={transactionListStyle}
      >
        {transactionsToRender.length > 0 ? (
          visibleTransactions.map(transaction => (
            <div key={transaction.id} className={styles.transactionItem}>
              <div className={styles.transactionIcon} style={{background: transaction.iconBg}}>
                {transaction.icon}
              </div>
              <div className={styles.transactionDetails}>
                <span>{transaction.name}</span>
                <span>{transaction.category}</span>
                <span>{transaction.date}</span>
              </div>
              <div className={`${styles.transactionAmount} ${transaction.type === 'income' || transaction.amount > 0 ? styles.income : styles.expense}`}>
                <span>{transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()}€</span>
              </div>
              <button
                className={styles.transactionDeleteBtn}
                onClick={() => handleDeleteTransaction(transaction.id)}
                title="Delete transaction"
              >
                <span className={styles.transactionDeleteBtnIcon}>×</span>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>{emptyTitle}</p>
            <p className="text-sm mt-2">{emptySubtitle}</p>
          </div>
        )}
      </div>
      {paginate && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationButton}
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className={styles.paginationPages}>
            {paginationItems.map(item => {
              if (typeof item === 'string') {
                return (
                  <span key={item} className={styles.paginationEllipsis}>
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={item}
                  className={`${styles.paginationPage} ${currentPage === item ? styles.active : ''}`}
                  onClick={() => setCurrentPage(item)}
                  aria-current={currentPage === item ? 'page' : undefined}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <button
            className={styles.paginationButton}
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default RecentTransactions;
