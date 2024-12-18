import React, { useEffect, useState } from 'react';
import styles from './TemperatureAlert.module.css';

export default function TemperatureAlert({ patient, value = 39 }) {
  const [status, setStatus] = useState('HIGH');

  useEffect(() => {
    if (value >= 37.5) {
      setStatus('HIGH');
    } else if (value < 34) {
      setStatus('LOW');
    } else {
      setStatus('NORMAL');
    }
  }, [value]);

  return (
    <div className={styles.temperatureCard}>
      <div className={styles.alertText}>
        <span className={styles.temperature}>{value}</span>
        <span className={styles.celsius}>°C</span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="123"
        height="151"
        viewBox="0 0 163 191"
        fill="none"
        className={styles.temperatureIcon}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M49.1989 10.0192L44.5042 4.51696C41.9622 1.53784 38.4918 -0.0920539 34.8969 0.00401895L34.4476 0.0155742C15.6201 0.51141 0.449783 18.2673 0.00373237 40.3286C-0.0815983 44.5148 1.29934 48.5587 3.82495 51.5188L89.4276 151.899C93.4162 156.578 98.2908 159.58 103.401 160.914L136.956 172.712L150.401 188.468C153.284 191.844 157.955 191.844 160.838 188.468C163.721 185.089 163.721 179.611 160.838 176.236L147.596 160.718L140.751 124.618C140.157 119.825 137.946 115.665 136.08 112.736C135.394 111.658 134.67 110.618 133.941 109.632L128.013 116.578C124.83 120.308 119.67 120.308 116.487 116.579C113.305 112.848 113.305 106.802 116.487 103.072L122.542 95.9774L109.619 80.8321L103.563 87.9277C100.38 91.657 95.2198 91.6579 92.0373 87.9277C88.8547 84.1984 88.8547 78.1514 92.0373 74.4222L98.0943 67.3247L85.1709 52.179L79.113 59.2779C75.9304 63.0075 70.7698 63.0075 67.5872 59.278C64.4044 55.5486 64.4044 49.5018 67.5872 45.7722L73.6468 38.672L60.7236 23.5262L54.663 30.628C51.4803 34.3575 46.3199 34.3575 43.1372 30.6281C39.9544 26.8986 39.9544 20.8518 43.1371 17.1223L49.1989 10.0192Z"
          fill="#e8cc5f"
        />
      </svg>
      <div className={styles.patientInfo}>
        <span className={styles.patientStatus}>TEMPERATURE IS VERY {status}</span> <br />
        <span className={styles.patientName}>{patient?.name}</span>
        <br />
        <span className={styles.patientRoom}>Room {patient?.roomNumber}</span>
      </div>
    </div>
  );
}
