import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './PatientInfoForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

function PatientInfo({ patient: initialPatient }) {
  const [patient, setPatient] = useState(initialPatient);

  const handleDischargeDateChange = (date) => {
    setPatient({ ...patient, estimatedDischargeDate: date.toISOString().split('T')[0] });
    console.log('Updated discharge date:', date.toISOString().split('T')[0]);
  };

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
            <input 
              type="text" 
              value={patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString('en-GB') : 'N/A'} 
              readOnly 
            />
          </label>
        </div>
        <div className={styles.datePickerContainer}>
        <label>
          Discharge Date (Estimated)
          <div className={styles.inputWithIcon}>
          <DatePicker
              selected={patient.estimatedDischargeDate ? new Date(patient.estimatedDischargeDate) : null}
              onChange={handleDischargeDateChange}
              dateFormat="dd-MM-YYYY"
              className={`${styles.dateInput}`} // Ensure the styles are applied
              wrapperClassName={styles.datePickerWrapper}
            />
            <FontAwesomeIcon icon={faCalendar} className={styles.calendarIcon} />
          </div>
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
