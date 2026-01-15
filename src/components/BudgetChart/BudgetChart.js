import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './BudgetChart.module.scss';

function BudgetChart() {
  const chartRef = useRef(null);
  const { summary } = useExpense();
  
  // Default monthly budget limit (can be made configurable later)
  const monthlyLimit = 35000;
  const spent = summary.totalExpenses;
  const remaining = Math.max(0, monthlyLimit - spent);

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
      enabled: false
    },
    plotOptions: {
      pie: {
        innerSize: '65%',
        borderWidth: 0,
        dataLabels: {
          enabled: false
        },
        states: {
          hover: {
            enabled: true
          }
        },
        startAngle: -90,
        endAngle: 270
      }
    },
    series: [{
      name: 'Budget',
      data: [
        {
          name: 'Spent',
          y: spent,
          color: '#FF6B35'
        },
        {
          name: 'Remaining',
          y: remaining,
          color: 'rgba(139, 147, 168, 0.15)'
        }
      ],
      size: '85%',
      center: ['50%', '50%']
    }],
    credits: {
      enabled: false
    }
  };

  return (
    <div className={styles.budgetChart}>
      <div className="section-title">
        <span>Budget</span>
      </div>

      {/* Chart Card */}
      <div className={styles.chartCard}>
        <div className={styles.chartContainer}>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartRef}
          />
          <div className={styles.budgetInfo}>
            <div className={styles.budgetAmount}>
              <span className={styles.budgetValue}>{spent.toLocaleString()}€</span>
              <span className={styles.budgetLabel}>Spent</span>
            </div>
          </div>
        </div>
        <div className={styles.budgetDetails}>
          <div className={styles.budgetDetailItem}>
            <div className={styles.budgetDetailValue}>{monthlyLimit.toLocaleString()}€</div>
            <div className={styles.budgetDetailLabel}>Monthly Limit</div>
          </div>
          <div className={styles.budgetDetailItem}>
            <div className={styles.budgetDetailValue}>{remaining.toLocaleString()}€</div>
            <div className={styles.budgetDetailLabel}>Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetChart;

