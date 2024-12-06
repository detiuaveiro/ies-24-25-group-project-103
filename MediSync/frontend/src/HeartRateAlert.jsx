import React, { useEffect, useState } from 'react';
import styles from './HeartRateAlert.module.css';

export default function HeartRateAlert({ patient, value }) {
  const [status, setStatus] = useState('HIGH');

  useEffect(() => {
    if (value >= 130) {
      setStatus('HIGH');
    } else if (value < 40) {
      setStatus('LOW');
    }
  }, [value]);

  return (
    <div className={styles.heartRateCard}>
      <div className={styles.alertText}>
        <span className={styles.heartRate}>{value}</span>
        <span className={styles.bpm}>bpm</span>
      </div>
      <svg
        className={styles.heartIcon}
        xmlns="http://www.w3.org/2000/svg"
        width="180"
        height="180"
        viewBox="0 0 296 259"
        fill="none"
      >
        <path
          d="M24.3278 89.2925C24.3278 43.1785 54.722 0.41748 96.3418 0.41748C125.224 0.41748 146.656 19.6028 159.884 46.819C173.112 19.6044 194.544 0.41748 223.427 0.41748C265.052 0.41748 295.441 43.1857 295.441 89.2925C295.441 187.992 159.884 258.155 159.884 258.155C159.884 258.155 68.5727 213.753 35.8349 140.92H116.704L129.558 117.839L144.572 170.92L179.732 125.259H223.676V109.15H171.932L151.275 135.978L134.393 76.2985L107.378 124.811H29.7488C31.4391 130.323 33.4866 135.695 35.8349 140.92L0.406006 140.919V124.81L29.7488 124.811C26.2928 113.542 24.3278 101.685 24.3278 89.2925Z"
          fill="#F03434"
        />
      </svg>
      <div className={styles.patientInfo}>
        <span className={styles.patientStatus}>BPM's ARE VERY {status}</span> <br />
        <span className={styles.patientName}>{patient?.name}</span>
        <br />
        <span className={styles.patientRoom}>Room {patient?.roomNumber}</span>
      </div>
    </div>
  );
}
