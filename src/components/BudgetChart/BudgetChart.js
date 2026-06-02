import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './BudgetChart.module.scss';

function BudgetChart() {
  const chartRef = useRef(null);
  const { expenseData, summary } = useExpense();

  // Category colors
  const categoryColors = {
    bills: '#FF6B35',
    baby: '#FF8FAD',
    house: '#FFD700',
    entertainment: '#00D9FF',
    food: '#10B981',
    transport: '#6366F1'
  };

  // Calculate category totals for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const categoryTotals = {};
  
  expenseData.transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.dateISO || transaction.date);
    if (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear &&
      transaction.type === 'expense'
    ) {
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
      categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + Math.abs(transaction.amount);
    }
  });

  // Prepare chart data
  const chartData = Object.entries(categoryTotals)
    .filter(([_, amount]) => amount > 0)
    .map(([categoryId, amount]) => {
      const category = expenseData.categories.find(cat => cat.id === categoryId);
      return {
        name: `${category?.name || categoryId} ${(amount / summary.totalExpenses * 100).toFixed(1)}%`,
        y: amount,
        color: categoryColors[categoryId]
      };
    });

  const options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: 320,
      reflow: true,
      style: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif'
      }
    },
    title: {
      text: null
    },
    tooltip: {
      pointFormat: '<b>{point.y.toLocaleString()}€</b><br/>{point.percentage:.1f}%'
    },
    plotOptions: {
      pie: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>',
          style: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '12px'
          }
        },
        states: {
          hover: {
            enabled: true
          }
        }
      }
    },
    series: [{
      name: 'Monthly Spending',
      data: chartData.length > 0 ? chartData : [
        {
          name: 'No spending data',
          y: 100,
          color: 'rgba(139, 147, 168, 0.15)'
        }
      ]
    }],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 640
          },
          chartOptions: {
            plotOptions: {
              pie: {
                size: '95%'
              }
            }
          }
        }
      ]
    },
    credits: {
      enabled: false
    }
  };

  return (
    <div className={styles.budgetChart}>
      <div className="section-title">
        <span>Spending by Category</span>
      </div>

      {/* Chart Card */}
      <div className={styles.chartCard}>
        <div className={styles.chartContainer}>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartRef}
          />
        </div>
        <div className={styles.budgetDetails}>
          {Object.entries(categoryTotals)
            .filter(([_, amount]) => amount > 0)
            .map(([categoryId, amount]) => {
              const category = expenseData.categories.find(cat => cat.id === categoryId);
              const percentage = (amount / summary.totalExpenses * 100).toFixed(1);
              return (
                <div key={categoryId} className={styles.budgetDetailItem}>
                  <div className={styles.categoryLegend}>
                    <div
                      className={styles.colorDot}
                      style={{ backgroundColor: categoryColors[categoryId] }}
                    />
                    <div className={styles.categoryName}>{category?.name}</div>
                  </div>
                  <div className={styles.categoryAmount}>
                    <span className={styles.budgetDetailValue}>{amount.toLocaleString()}€ - </span>
                    <span className={styles.percentageLabel}>{percentage}%</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default BudgetChart;
