import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

// Default categories structure
const defaultCategories = [
  { id: 'bills', name: 'Bills', amount: 0, progress: 0 },
  { id: 'baby', name: 'Baby', amount: 0, progress: 0 },
  { id: 'house', name: 'House', amount: 0, progress: 0 },
  { id: 'entertainment', name: 'Entertainment', amount: 0, progress: 0 },
  { id: 'food', name: 'Food', amount: 0, progress: 0 },
  { id: 'transport', name: 'Transport', amount: 0, progress: 0 },
  { id: 'slava', name: 'Slava', amount: 0, progress: 0 }
];

const categoryMapping = {
  'Bills': 'bills',
  'Baby': 'baby',
  'House': 'house',
  'Entertainment': 'entertainment',
  'Food': 'food',
  'Transport': 'transport',
  'Slava': 'slava',
  'Utilities': 'bills',
  'Food & Dining': 'food',
  'Transportation': 'transport'
};

const getTransactionDate = (transaction) => new Date(transaction.dateISO || transaction.date);

const getDateInputValue = (date) => date.toISOString().split('T')[0];

const getTransactionTimestamp = (transactionData) => {
  if (transactionData.dateISO) {
    return transactionData.dateISO;
  }

  if (transactionData.rawDate) {
    const todayInputValue = getDateInputValue(new Date());

    return transactionData.rawDate === todayInputValue
      ? new Date().toISOString()
      : new Date(transactionData.rawDate).toISOString();
  }

  return transactionData.date === 'Today' || transactionData.date === 'Yesterday'
    ? new Date().toISOString()
    : new Date(transactionData.date).toISOString();
};

export const ExpenseProvider = ({ children }) => {
  const { apiRequest, isAuthenticated, user } = useAuth();
  const [expenseData, setExpenseData] = useState({
    categories: defaultCategories,
    transactions: []
  });
  const [activeMonthStart, setActiveMonthStart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getActiveMonthStorageKey = useCallback(() => {
    const userKey = user?.id || user?._id || user?.email || 'guest';
    return `expensy-active-month-start:${userKey}`;
  }, [user]);

  // Fetch expenses from API
  const fetchExpenses = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest('/api/expenses');
      setExpenseData(prev => ({
        ...prev,
        transactions: response.data || []
      }));
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [apiRequest, isAuthenticated]);

  // Load expenses when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setActiveMonthStart(localStorage.getItem(getActiveMonthStorageKey()));
      fetchExpenses();
    } else {
      // Reset data when user logs out
      setExpenseData({
        categories: defaultCategories,
        transactions: []
      });
      setActiveMonthStart(null);
    }
  }, [isAuthenticated, fetchExpenses, getActiveMonthStorageKey]);

  const today = new Date();
  const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
  const currentMonthStart = useMemo(() => {
    const [year, month] = currentMonthKey.split('-').map(Number);
    return new Date(year, month, 1);
  }, [currentMonthKey]);

  const transactionGroups = useMemo(() => {
    const groups = {
      currentMonthTransactions: [],
      historyTransactions: [],
      activeTransactions: []
    };
    const resetDate = activeMonthStart ? new Date(activeMonthStart) : null;
    const hasValidResetDate = resetDate && !Number.isNaN(resetDate.getTime());

    expenseData.transactions.forEach(transaction => {
      const transactionDate = getTransactionDate(transaction);
      const hasValidTransactionDate = !Number.isNaN(transactionDate.getTime());

      if (!hasValidTransactionDate) {
        groups.currentMonthTransactions.push(transaction);
        groups.activeTransactions.push(transaction);
        return;
      }

      if (transactionDate < currentMonthStart) {
        groups.historyTransactions.push(transaction);
        return;
      }

      groups.currentMonthTransactions.push(transaction);

      if (!activeMonthStart || !hasValidResetDate || transactionDate >= resetDate) {
        groups.activeTransactions.push(transaction);
      }
    });

    return groups;
  }, [activeMonthStart, expenseData.transactions, currentMonthStart]);

  const {
    currentMonthTransactions,
    historyTransactions,
    activeTransactions
  } = transactionGroups;

  // Calculate monthly spending from transactions
  const monthlySpending = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    return months.map(month => {
      const monthTransactions = activeTransactions.filter(transaction => {
        const transactionDate = getTransactionDate(transaction);
        const transactionMonth = transactionDate.toLocaleString('en-US', { month: 'short' });
        const transactionYear = transactionDate.getFullYear();
        return transactionMonth === month && transactionYear === currentYear && transaction.type === 'expense';
      });

      const monthTotal = monthTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return { month, amount: monthTotal };
    });
  }, [activeTransactions]);

  // Calculate daily spending for the last 7 days
  const dailySpending = useMemo(() => {
    const days = [];
    const today = new Date();

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }

    return days.map(date => {
      const dayTransactions = activeTransactions.filter(transaction => {
        const transactionDate = getTransactionDate(transaction);
        return transactionDate.toDateString() === date.toDateString() && transaction.type === 'expense';
      });

      const dayTotal = dayTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

      return { day: dayLabel, amount: dayTotal };
    });
  }, [activeTransactions]);

  // Calculate yearly spending for the last 5 years
  const yearlySpending = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];

    // Get last 5 years
    for (let i = 4; i >= 0; i--) {
      years.push(currentYear - i);
    }

    return years.map(year => {
      const yearTransactions = activeTransactions.filter(transaction => {
        const transactionDate = getTransactionDate(transaction);
        return transactionDate.getFullYear() === year && transaction.type === 'expense';
      });

      const yearTotal = yearTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return { year: year.toString(), amount: yearTotal };
    });
  }, [activeTransactions]);

  // Calculate categories from transactions
  const categories = useMemo(() => {
    const categoryTotals = {};

    // Initialize all categories with 0
    defaultCategories.forEach(cat => {
      categoryTotals[cat.id] = 0;
    });

    // Sum up expenses by category
    activeTransactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const categoryId = categoryMapping[transaction.category] || 'bills';
        if (categoryTotals[categoryId] !== undefined) {
          categoryTotals[categoryId] += Math.abs(transaction.amount);
        }
      });

    // Calculate progress (assuming a monthly budget of 1000 per category)
    return defaultCategories.map(cat => ({
      ...cat,
      amount: categoryTotals[cat.id] || 0,
      progress: Math.min((categoryTotals[cat.id] || 0) / 1000 * 100, 100)
    }));
  }, [activeTransactions]);

  // Calculate summary values
  const summary = useMemo(() => {
    const totalIncome = activeTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpenses = activeTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netBalance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, netBalance };
  }, [activeTransactions]);

  // Add a new transaction (now saves to API)
  const addTransaction = useCallback(async (transactionData) => {
    try {
      setError(null);

      // Convert frontend transaction format to API format
      const apiData = {
        type: transactionData.type,
        amount: Math.abs(transactionData.amount), // API expects positive amount
        category: transactionData.category,
        description: transactionData.name || transactionData.description,
        date: getTransactionTimestamp(transactionData)
      };

      // Save to API
      const response = await apiRequest('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(apiData)
      });

      // Add the returned transaction to local state
      setExpenseData(prev => ({
        ...prev,
        transactions: [response.data, ...prev.transactions]
      }));

      return { success: true };
    } catch (error) {
      console.error('Failed to add transaction:', error);
      setError('Failed to add transaction');
      return { success: false, error: error.message };
    }
  }, [apiRequest]);

  // Delete a transaction by ID
  const deleteTransaction = useCallback(async (transactionId) => {
    try {
      setError(null);

      // Delete from API
      await apiRequest(`/api/expenses/${transactionId}`, {
        method: 'DELETE'
      });

      // Remove from local state
      setExpenseData(prev => ({
        ...prev,
        transactions: prev.transactions.filter(t => t.id !== transactionId)
      }));

      return { success: true };
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      setError('Failed to delete transaction');
      return { success: false, error: error.message };
    }
  }, [apiRequest]);

  const resetCurrentMonth = useCallback(() => {
    const nextActiveMonthStart = new Date().toISOString();

    localStorage.setItem(getActiveMonthStorageKey(), nextActiveMonthStart);
    setActiveMonthStart(nextActiveMonthStart);
  }, [getActiveMonthStorageKey]);

  const value = useMemo(() => ({
    expenseData: {
      ...expenseData,
      allTransactions: expenseData.transactions,
      transactions: activeTransactions,
      currentMonthTransactions,
      historyTransactions,
      monthlySpending,
      dailySpending,
      yearlySpending,
      categories
    },
    summary,
    loading,
    error,
    resetCurrentMonth,
    addTransaction,
    deleteTransaction,
    fetchExpenses
  }), [
    expenseData,
    activeTransactions,
    currentMonthTransactions,
    historyTransactions,
    monthlySpending,
    dailySpending,
    yearlySpending,
    categories,
    summary,
    loading,
    error,
    resetCurrentMonth,
    addTransaction,
    deleteTransaction,
    fetchExpenses
  ]);

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
