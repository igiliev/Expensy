import React from 'react';
import { useExpense } from '../../contexts/ExpenseContext';

function Categories() {
  const { expenseData } = useExpense();

  return (
    <div className="section">
      <div className="section-title">Categories</div>
      <div className="categories-list">
        {expenseData.categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-header">
              <div className={`category-icon ${category.id}`}>
                {category.icon}
              </div>
              <div className="category-name">{category.name}</div>
              <div className="category-amount">{category.amount.toLocaleString()}€</div>
            </div>
            <div className="category-progress">
              <div className="category-progress-bar" style={{width: `${category.progress}%`}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
