import React from 'react';
import { useExpense } from '../../contexts/ExpenseContext';
import styles from './Categories.module.scss';

function Categories() {
  const { expenseData } = useExpense();

  return (
    <div className="section">
      <div className="section-title">Categories</div>
      <div className={styles.categoriesList}>
        {expenseData.categories.map(category => (
          <div key={category.id} className={styles.categoryCard}>
            <div className={styles.categoryHeader}>
              <div className={`${styles.categoryIcon} ${styles[category.id]}`}>
                {category.icon}
              </div>
              <div className={styles.categoryName}>{category.name}</div>
              <div className={styles.categoryAmount}>{category.amount.toLocaleString()}€</div>
            </div>
            <div className={styles.categoryProgress}>
              <div className={styles.categoryProgressBar} style={{width: `${category.progress}%`}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
