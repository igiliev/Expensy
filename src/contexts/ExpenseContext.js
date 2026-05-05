import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  { id: 'bills', name: 'Bills', icon: '📄', amount: 0, progress: 0 },
  { id: 'baby', name: 'Baby', icon: '👶', amount: 0, progress: 0 },
  { id: 'house', name: 'House', icon: '🏠', amount: 0, progress: 0 },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', amount: 0, progress: 0 },
  { id: 'food', name: 'Food', icon: '🍔', amount: 0, progress: 0 },
  { id: 'transport', name: 'Transport', icon: '🚗', amount: 0, progress: 0 }
];

export const ExpenseProvider = ({ children }) => {
  const { apiRequest, isAuthenticated } = useAuth();
  const [expenseData, setExpenseData] = useState({
    categories: defaultCategories,
    transactions: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      fetchExpenses();
    } else {
      // Reset data when user logs out
      setExpenseData({
        categories: defaultCategories,
        transactions: []
      });
    }
  }, [isAuthenticated, fetchExpenses]);

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

  // Calculate daily spending for the last 7 days
  const calculateDailySpending = () => {
    const days = [];
    const today = new Date();

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }

    return days.map(date => {
      const dayTransactions = expenseData.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.toDateString() === date.toDateString() && transaction.type === 'expense';
      });

      const dayTotal = dayTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

      return { day: dayLabel, amount: dayTotal };
    });
  };

  // Calculate yearly spending for the last 5 years
  const calculateYearlySpending = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    // Get last 5 years
    for (let i = 4; i >= 0; i--) {
      years.push(currentYear - i);
    }

    return years.map(year => {
      const yearTransactions = expenseData.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getFullYear() === year && transaction.type === 'expense';
      });

      const yearTotal = yearTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return { year: year.toString(), amount: yearTotal };
    });
  };

  // Calculate categories from transactions
  const calculateCategories = () => {
    const categoryTotals = {};

    // Initialize all categories with 0
    defaultCategories.forEach(cat => {
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
          'Utilities': 'bills',
          'Food & Dining': 'food',
          'Transportation': 'transport'
        };

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

  // Add a new transaction (now saves to API)
  const addTransaction = async (transactionData) => {
    try {
      setError(null);

      // Convert frontend transaction format to API format
      const apiData = {
        type: transactionData.type,
        amount: Math.abs(transactionData.amount), // API expects positive amount
        category: transactionData.category,
        description: transactionData.name || transactionData.description,
        date: transactionData.date === 'Today' || transactionData.date === 'Yesterday'
          ? new Date().toISOString()
          : new Date(transactionData.date).toISOString()
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
  };

  // Delete a transaction by ID
  const deleteTransaction = async (transactionId) => {
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
  };

  // Reset all data (for demo purposes - in real app might want to clear from API too)
  const resetAllData = () => {
    setExpenseData({
      categories: defaultCategories.map(cat => ({ ...cat, amount: 0, progress: 0 })),
      transactions: []
    });
  };

  const value = {
    expenseData: {
      ...expenseData,
      monthlySpending: calculateMonthlySpending(),
      dailySpending: calculateDailySpending(),
      yearlySpending: calculateYearlySpending(),
      categories: calculateCategories()
    },
    summary: calculateSummary(),
    loading,
    error,
    resetAllData,
    addTransaction,
    deleteTransaction,
    fetchExpenses
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
