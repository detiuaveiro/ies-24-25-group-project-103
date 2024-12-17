import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './PatientInfoForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import CONFIG from './config';

function PatientInfo({ patient: initialPatient }) {
  const [patient, setPatient] = useState(initialPatient);
  const [isUpdating, setIsUpdating] = useState(false); 
  const role = localStorage.getItem('userRole');
  const baseUrl = CONFIG.API_URL;

  const handleDischargeDateChange = async (date) => {
    const updatedDate = date.toISOString().split('T')[0];
    setPatient({ ...patient, estimatedDischargeDate: updatedDate });
    
    if (role === 'DOCTOR') {
      try {
        setIsUpdating(true);
        const response = await fetch(`${baseUrl}/patients/discharge-date/${patient.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ dischargeDate: updatedDate }),
        });

        if (!response.ok) {
          if (response.status === 400) {
            throw new Error('Bad Request: Missing discharge date in payload');
          }
          if (response.status === 404) {
            throw new Error('Patient not found');
          }
          throw new Error('Failed to update discharge date');
        }

        const updatedPatient = await response.json();
        setPatient(updatedPatient);
        console.log('Successfully updated discharge date:', updatedDate);
      } catch (error) {
        console.error('Error updating discharge date:', error);
      } finally {
        setIsUpdating(false);
      }
    }
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
            {role === 'DOCTOR' ? (
              <DatePicker
                selected={patient.estimatedDischargeDate ? new Date(patient.estimatedDischargeDate) : null}
                onChange={handleDischargeDateChange}
                dateFormat="dd-MM-yyyy"
                className={`${styles.dateInput}`}
                wrapperClassName={styles.datePickerWrapper}
              />
            ) : (
              <input
                type="date"
                value={patient.estimatedDischargeDate || ''}
                readOnly
                className={`${styles.readOnlyInput}`}
              />
            )}
            <FontAwesomeIcon icon={faCalendar} className={styles.calendarIcon} />
          </div>
          {isUpdating && <p className={styles.loadingText}>Updating...</p>}
        </label>
      </div>
      <div>
        <label>
          Conditions
          <input type="text" value={patient.conditions?.join(', ') || 'None'} readOnly />
        </label>
      </div>
      <div className={styles.contagiousContainer}>
        <label>
          Contagious
          <input 
            type="text" 
            value={patient.contagious ? 'Yes' : 'No'} 
            readOnly 
            className={patient.contagious ? styles.contagiousYes : styles.contagiousNo}
          />
        </label>
      </div>
    </div>
  );
}

export default PatientInfo;