import React, { useEffect } from 'react';
import styles from './OxygenSaturationAlert.module.css';
import { FaLungs } from 'react-icons/fa';
export default function OxygenSaturationAlert({ showModal, setShowModal, patient, value }) {
  useEffect(() => {
    if (value <= 90) {
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
      <FaLungs style={{ fontSize: '12rem', color: '#ff8500', marginTop:"-20px"}} />
      <div className={styles.patientInfo}>
        <span className={styles.patientStatus}>SATURATION IS LOW</span> <br />
        <span className={styles.patientName}>{patient?.name}</span>
        <br />
        <span className={styles.patientRoom}>Room {patient?.roomNumber}</span>
      </div>
    </div>
  );
}
