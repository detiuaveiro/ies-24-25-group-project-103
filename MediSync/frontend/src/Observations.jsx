import React from 'react';
import styles from './PatientInfoForm.module.css';

export function Observations({ patient }) {
  return (
    <div className={styles.observationsContainer}>
      <label className={styles.observationsLabel}>
        Observations
        <textarea
          className={styles.observationsInput}
          value={patient.Observations || 'None'}
          readOnly
        />
      </label>
    </div>
  );
}
