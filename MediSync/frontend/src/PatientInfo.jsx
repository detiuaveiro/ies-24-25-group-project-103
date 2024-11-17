import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './PatientInfoForm.module.css';

function PatientInfo({patient}) {
  const { id } = useParams(); // Get the patient ID from the URL

  return (
    <div className={styles.formContainer}>
      <div>
        <h3 className={styles.title}>Health Overview</h3>
        <label>
          Name
          <input type="text" value={patient.name || 'N/A'} readOnly />
        </label>
      </div>
      <div>
        <label>
          Gender
          <input type="text" value={patient.gender || 'N/A'} readOnly />
        </label>
      </div>
      <div>
        <label>
          Date of Birth
          <input type="date" value={patient.birthDate || ''} readOnly />
        </label>
      </div>
      <div>
        <label>
          Admission Date
          <input type="date" value={patient.admissionDate || ''} readOnly />
        </label>
      </div>
      <div>
        <label>
          Discharge Date (Estimated)
          <input type="date" value={patient.estimatedDischargeDate || 'TBD'} onChange={(e) => setPatient({ ...patient, estimatedDischargeDate: e.target.value })} />
        </label>
      </div>
      <div>
        <label>
          Conditions
          <input type="text" value={patient.conditions?.join(', ') || 'None'} readOnly />
        </label>
      </div>

    </div>
  );
}

export default PatientInfo;
