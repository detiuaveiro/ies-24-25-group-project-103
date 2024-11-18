import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PatientInfo from './PatientInfo';
import BMI from './BMI';
import HeightBox from './HeightBox';
import HeartRate from './HeartRate';
import TemperatureCard from './TemperatureCard';
import BloodPressureCard from './BloodPressureCard';
import OxygenCard from './OxygenCard';
import MedicationTable from './MedicationTable';
import styles from './HealthOverview.module.css'; 
import { AddMedicationButton } from './AddMedicationButton';
import MedicationTableNurse from './MedicationTableNurse';
import { DischargePatientButton } from './DischargePatientButton';
import { Observations } from './Observations';

function HealthOverview() {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const { id } = useParams(); 

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await axios.get(`http://localhost:8080/api/v1/patients/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setPatient(response.data.patient);
                console.log(response.data);
            } catch (err) {
                setError('Failed to load patient data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [id]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    if (user.role === 'DOCTOR') {
    return (
        <div className="app">
            <div className={styles.mainContent}>
                <div className={styles.infoAndVitals}>
                    <div className={styles.leftColumn}>
                        <div className={styles.patientInfo}>
                            <PatientInfo patient={patient} />
                        </div>
                        <div className={styles.heightAndBMIRow}>
                            <HeightBox patient={patient} />
                            <BMI patient={patient} />
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={styles.vitalsGrid}>
                            <HeartRate patient={patient} />
                            <OxygenCard patient={patient} />
                            <BloodPressureCard patient={patient} />
                            <TemperatureCard patient={patient} />
                        </div>
                        <div className={styles.medicationSection}>
                            <MedicationTable patient={patient} />
                            <AddMedicationButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    }
    else if (user.role === 'NURSE') {
        return (
            <div className="app">
                <div className={styles.mainContent}>
                    <div className={styles.infoAndVitals}>
                        <div className={styles.leftColumn}>
                            <div className={styles.patientInfo}>
                                <PatientInfo patient={patient} />
                            </div>
                            <div className={styles.heightAndBMIRow}>
                                <HeightBox patient={patient} />
                                <BMI patient={patient} />
                            </div>
                        </div>
    
                        <div className={styles.rightColumn}>
                            <div className={styles.vitalsGrid}>
                                <HeartRate patient={patient} />
                                <OxygenCard patient={patient} />
                                <BloodPressureCard patient={patient} />
                                <TemperatureCard patient={patient} />
                            </div>
                            <div className={styles.medicationSection}>
                                <MedicationTableNurse patient={patient} />
                            </div>
                        </div>
                    </div>
                    <Observations patient={patient} />

                </div>
            </div>
        );
    }
    else {
        return (
            <div className="app">
                <div className={styles.mainContent}>
                    <div className={styles.infoAndVitals}>
                        <div className={styles.leftColumn}>
                            <div className={styles.patientInfo}>
                                <PatientInfo patient={patient} />
                            </div>
                            <div className={styles.heightAndBMIRow}>
                                <HeightBox patient={patient} />
                                <BMI patient={patient} />
                            </div>
                        </div>
    
                        <div className={styles.rightColumn}>
                        <DischargePatientButton patient={patient} />

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default HealthOverview;
