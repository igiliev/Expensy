import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useExpense } from '../../contexts/ExpenseContext';

function SpendingChart() {
  const chartRef = useRef(null);
  const { expenseData, summary } = useExpense();

  const monthlyData = expenseData.monthlySpending;
  const totalExpenses = summary.totalExpenses;

  const options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      height: 320,
      style: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif'
      }
    },
    title: {
      text: null
    },
    xAxis: {
      categories: monthlyData.map(item => item.month),
      labels: {
        style: {
          color: '#8B93A8',
          fontSize: '12px'
        }
      },
      lineColor: 'rgba(139, 147, 168, 0.2)',
      tickColor: 'rgba(139, 147, 168, 0.2)'
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
      gridLineColor: 'rgba(139, 147, 168, 0.1)',
      lineColor: 'rgba(139, 147, 168, 0.2)',
      tickColor: 'rgba(139, 147, 168, 0.2)'
    },
    tooltip: {
      backgroundColor: 'rgba(26, 31, 46, 0.9)',
      borderColor: 'rgba(0, 217, 255, 0.3)',
      borderRadius: 8,
      style: {
        color: '#FFFFFF'
      },
      formatter: function() {
        return `<b>${this.x}</b><br/>Expenses: €${this.y}`;
      }
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
      name: 'Monthly Spending',
      data: monthlyData.map((item, index) => ({
        y: item.amount,
        color: index === 2 ? 'rgba(0, 217, 255, 0.8)' : 'rgba(139, 147, 168, 0.4)',
        borderColor: index === 2 ? '#00D9FF' : 'rgba(139, 147, 168, 0.6)'
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
    <div className="section">
      <div className="section-title">
        <span>Spending Overview</span>
        <div className="period-selector">
          <button className="period-btn">Daily</button>
          <button className="period-btn active">Monthly</button>
          <button className="period-btn">Yearly</button>
        </div>
      </div>

      {/* Chart Card */}
      <div className="chart-card">
        <div className="chart-value">{summary.totalExpenses.toLocaleString()}€</div>
        <div className="chart-container">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartRef}
          />
        </div>
      </div>
    </div>
  );
}

export default SpendingChart;
