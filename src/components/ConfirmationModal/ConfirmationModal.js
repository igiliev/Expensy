import React, { useEffect } from 'react';
import styles from './ConfirmationModal.module.scss';

function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'primary'
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <dialog className={styles.modalOverlay} open aria-modal="true" onMouseDown={onCancel}>
      <article
        className={styles.modalContent}
        aria-labelledby="confirmation-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.accentLine} />
        <section className={styles.modalBody}>
          <h2 id="confirmation-modal-title" className={styles.modalTitle}>
            {title}
          </h2>
          <p className={styles.modalMessage}>{message}</p>
        </section>
        <footer className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={`${styles.confirmButton} ${styles[variant]}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </footer>
      </article>
    </dialog>
  );
}

export default ConfirmationModal;
