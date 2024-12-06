import React, { useEffect } from 'react';
import styles from './OxygenSaturationAlert.module.css';
import { FaLungs } from 'react-icons/fa';
export default function OxygenSaturationAlert({ showModal, setShowModal, patient, value }) {
  useEffect(() => {
    if (value <= 95) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [value, setShowModal]);

  if (!showModal) {
    return null;
  }

  return (
    <div className={styles.oxygenSaturationCard}>
      <div className={styles.alertText}>
        <span className={styles.o2}>{value}</span>
        <span className={styles.percent}>%</span>
      </div>
      <FaLungs style={{ fontSize: '10rem', color: '#ff8500', marginBottom: '1rem' }} />
      <div className={styles.patientInfo}>
        <span className={styles.patientStatus}>SATURATION IS VERY LOW</span> <br />
        <span className={styles.patientName}>Patient {patient?.name}</span>
        <br />
        <span className={styles.patientRoom}>Located in room {patient?.roomNumber}</span>
      </div>
    </div>
  );
}
