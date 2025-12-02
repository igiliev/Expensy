import React, { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  // Initial data structure
  const initialData = {

    // Categories with their amounts
    categories: [
      { id: 'bills', name: 'Bills', icon: '📄', amount: 850, progress: 68 },
      { id: 'baby', name: 'Baby', icon: '👶', amount: 320, progress: 45 },
      { id: 'house', name: 'House', icon: '🏠', amount: 650, progress: 55 },
      { id: 'entertainment', name: 'Entertainment', icon: '🎬', amount: 180, progress: 30 },
      { id: 'food', name: 'Food', icon: '🍔', amount: 420, progress: 75 },
      { id: 'transport', name: 'Transport', icon: '🚗', amount: 290, progress: 40 }
    ],

    // Recent transactions
    transactions: [
      {
        id: 1,
        icon: '🍔',
        iconBg: 'rgba(249, 115, 22, 0.15)',
        name: 'Restaurant Lunch',
        category: 'Food & Dining',
        date: 'Today',
        amount: -45,
        type: 'expense'
      },
      {
        id: 2,
        icon: '🎬',
        iconBg: 'rgba(168, 85, 247, 0.15)',
        name: 'Netflix Subscription',
        category: 'Entertainment',
        date: 'Yesterday',
        amount: -12.99,
        type: 'expense'
      },
      {
        id: 3,
        icon: '💡',
        iconBg: 'rgba(59, 130, 246, 0.15)',
        name: 'Electricity Bill',
        category: 'Utilities',
        date: '3 days ago',
        amount: -85,
        type: 'expense'
      },
      {
        id: 4,
        icon: '🚗',
        iconBg: 'rgba(168, 85, 247, 0.15)',
        name: 'Uber Trip',
        category: 'Transportation',
        date: '4 days ago',
        amount: -22.50,
        type: 'expense'
      },
      {
        id: 5,
        icon: '💰',
        iconBg: 'rgba(16, 185, 129, 0.15)',
        name: 'Salary Deposit',
        category: 'Income',
        date: '5 days ago',
        amount: 4300,
        type: 'income'
      }
    ]
  };

  const [expenseData, setExpenseData] = useState(initialData);

  // Calculate monthly spending from transactions
  const calculateMonthlySpending = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    return months.map(month => {
      const monthTransactions = expenseData.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionMonth = transactionDate.toLocaleString('en-US', { month: 'short' });
        const transactionYear = transactionDate.getFullYear();
        return transactionMonth === month && transactionYear === currentYear && transaction.type === 'expense';
      });

      const monthTotal = monthTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return { month, amount: monthTotal };
    });
  };

  // Calculate categories from transactions
  const calculateCategories = () => {
    const categoryTotals = {};

    // Initialize all categories with 0
    initialData.categories.forEach(cat => {
      categoryTotals[cat.id] = 0;
    });

    // Sum up expenses by category
    expenseData.transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        // Map transaction categories to our category IDs
        const categoryMapping = {
          'Bills': 'bills',
          'Baby': 'baby',
          'House': 'house',
          'Entertainment': 'entertainment',
          'Food': 'food',
          'Transport': 'transport',
          'Utilities': 'bills', // Map old categories
          'Food & Dining': 'food',
          'Transportation': 'transport'
        };

        const categoryId = categoryMapping[transaction.category] || 'bills'; // Default to bills
        if (categoryTotals[categoryId] !== undefined) {
          categoryTotals[categoryId] += Math.abs(transaction.amount);
        }
      });

    // Calculate progress (assuming a monthly budget of 1000 per category for demo)
    return initialData.categories.map(cat => ({
      ...cat,
      amount: categoryTotals[cat.id] || 0,
      progress: Math.min((categoryTotals[cat.id] || 0) / 1000 * 100, 100)
    }));
  };

  // Calculate summary values
  const calculateSummary = () => {
    const totalIncome = expenseData.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpenses = expenseData.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netBalance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, netBalance };
  };

  // Reset all data to zero
  const resetAllData = () => {
    setExpenseData({
      categories: initialData.categories.map(cat => ({ ...cat, amount: 0, progress: 0 })),
      transactions: []
    });
  };

  // Add a new transaction
  const addTransaction = (transaction) => {
    setExpenseData(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions]
    }));
  };

  const value = {
    expenseData: {
      ...expenseData,
      monthlySpending: calculateMonthlySpending(),
      categories: calculateCategories()
    },
    summary: calculateSummary(),
    resetAllData,
    addTransaction
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
