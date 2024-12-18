import React, { useEffect, useState } from 'react';
import styles from './BloodPressureAlert.module.css';

export default function BloodPressureAlert({ patient, values = [100, 50] }) {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (values[0] >= 140 || values[1] >= 90) {
      setStatus('HIGH');
    } else if (values[0] < 70 || values[1] < 40) {
      setStatus('LOW');
    } else {
      setStatus('NORMAL');
    }
  }, [values]);

  return (
    <div className={styles.bloodPressureCard}>
      <div className={styles.alertText}>
        <span className={styles.systolic}>{values[0]}</span>
        <span className={styles.diastolic}>/{values[1]} mmHg</span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="163"
        height="160"
        viewBox="0 0 163 160"
        fill="none"
        className={styles.bloodIcon}
      >
        <path
          d="M81.6616 7.99951C81.6616 50.1099 37.9939 80.3979 37.9939 110.688C37.9939 133.944 57.5441 152.796 81.6616 152.796C105.776 152.796 125.324 133.944 125.324 110.688C125.324 80.3979 81.6616 50.1099 81.6616 7.99951ZM99.2281 132.38H64.0886V123.196L99.2281 123.203V132.38ZM99.2281 100.606L86.4261 100.6V112.96H76.8873V100.6H64.0869V91.4155H76.8873V79.0683H86.4261V91.4155H99.2281V100.606V100.606Z"
          fill="#478F96"
        />
      </svg>
      <div className={styles.patientInfo}>
        <span className={styles.patientStatus}>PRESSURES ARE {status}</span> <br />
        <span className={styles.patientName}>{patient?.name}</span>
        <br />
        <span className={styles.patientRoom}>Room {patient?.roomNumber}</span>
      </div>
    </div>
  );
}
