import React, { useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './SpendingChart.module.scss';

function SpendingChart() {
  const chartRef = useRef(null);
  const { expenseData, summary } = useExpense();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const monthlyData = expenseData.monthlySpending;
  const dailyData = expenseData.dailySpending || [];
  const yearlyData = expenseData.yearlySpending || [];

  // Get data and chart config based on selected period
  const getChartData = () => {
    switch (selectedPeriod) {
      case 'daily':
        return {
          data: dailyData,
          categories: dailyData.map(item => item.day),
          title: 'Daily Spending',
          xAxisTitle: 'Last 7 Days',
          tooltipFormatter: function() { return `<b>${this.x}</b><br/>Expenses: €${this.y}`; }
        };
      case 'yearly':
        return {
          data: yearlyData,
          categories: yearlyData.map(item => item.year),
          title: 'Yearly Spending',
          xAxisTitle: 'Years',
          tooltipFormatter: function() { return `<b>${this.x}</b><br/>Expenses: €${this.y}`; }
        };
      case 'monthly':
      default:
        return {
          data: monthlyData,
          categories: monthlyData.map(item => item.month),
          title: 'Monthly Spending',
          xAxisTitle: 'Months',
          tooltipFormatter: function() { return `<b>${this.x}</b><br/>Expenses: €${this.y}`; }
        };
    }
  };

  const chartData = getChartData();

  // Check if there's any spending data for the selected period
  const hasSpendingData = chartData.data.some(item => item.amount > 0);

  const options = {
    chart: {
      type: 'column',
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
    xAxis: {
      categories: chartData.categories,
      labels: {
        style: {
          color: '#8B93A8',
          fontSize: '12px'
        }
      },
      lineColor: 'rgba(139, 147, 168, 0.2)',
      tickColor: 'rgba(139, 147, 168, 0.2)',
      visible: hasSpendingData
    },
    yAxis: {
      title: {
        text: null
      },
      labels: {
        style: {
          color: '#8B93A8',
          fontSize: '12px'
        },
        formatter: function() {
          return '€' + this.value;
        }
      },
      gridLineColor: hasSpendingData ? 'rgba(139, 147, 168, 0.1)' : 'transparent',
      lineColor: 'rgba(139, 147, 168, 0.2)',
      tickColor: 'rgba(139, 147, 168, 0.2)',
      visible: hasSpendingData
    },
    tooltip: {
      backgroundColor: 'rgba(26, 31, 46, 0.9)',
      borderRadius: 8,
      style: {
        color: '#FFFFFF'
      },
      formatter: chartData.tooltipFormatter
    },
    plotOptions: {
      column: {
        borderRadius: 6,
        borderWidth: 1.5,
        pointWidth: 24,
        dataLabels: {
          enabled: false
        }
      }
    },
    series: [{
      name: chartData.title,
      data: chartData.data.map((item, index) => ({
        y: item.amount,
        color: selectedPeriod === 'monthly' && index === 2 ? 'rgba(0, 217, 255, 0.8)' : 'rgba(139, 147, 168, 0.4)',
        borderColor: selectedPeriod === 'monthly' && index === 2 ? '#00D9FF' : 'rgba(139, 147, 168, 0.6)'
      })),
      borderWidth: 1.5,
      borderRadius: 6
    }],
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    }
  };

  return (
    <div className={styles.spendingChart}>
      <div className="section-title">
        <span>Spending Overview Chart</span>
        <div className={styles.periodSelector}>
          <button
            className={`${styles.periodBtn} ${selectedPeriod === 'daily' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('daily')}
          >
            Daily
          </button>
          <button
            className={`${styles.periodBtn} ${selectedPeriod === 'monthly' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('monthly')}
          >
            Monthly
          </button>
          <button
            className={`${styles.periodBtn} ${selectedPeriod === 'yearly' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Chart Card */}
      <div className={styles.chartCard}>
        <div className={styles.chartValue}>{summary.totalExpenses.toLocaleString()}€</div>
        <div className={styles.chartContainer}>
          {hasSpendingData ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
              ref={chartRef}
            />
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateMessage}>No spending data for this period yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpendingChart;
