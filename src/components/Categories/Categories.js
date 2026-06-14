import React from 'react';
import { useExpense } from '../../contexts/ExpenseContext';
import { renderCategoryIcon } from '../../utils/categoryIcons';
import styles from './Categories.module.scss';

function Categories() {
  const { expenseData } = useExpense();
  const currency = '\u20ac';

  return (
    <section className="section" aria-labelledby="categories-title">
      <h2 id="categories-title" className="section-title">Categories</h2>
      <ul className={styles.categoriesList}>
        {expenseData.categories.map(category => (
          <li key={category.id} className={styles.categoryCard}>
            <article>
              <header className={styles.categoryHeader}>
                <div className={`${styles.categoryIcon} ${styles[category.id]}`}>
                  {renderCategoryIcon(category.name, category.id)}
                </div>
                <p className={styles.categoryName}>{category.name}</p>
                <p className={styles.categoryAmount}>
                  {category.amount.toLocaleString()}{currency}
                </p>
              </header>
              <div className={styles.categoryProgress}>
                <div className={styles.categoryProgressBar} style={{width: `${category.progress}%`}}></div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Categories;
