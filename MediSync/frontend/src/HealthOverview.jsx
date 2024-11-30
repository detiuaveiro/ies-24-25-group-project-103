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
import DischargePatient from './DischargePatient';
import UpdateMedication from './UpdateMedication';

function HealthOverview() {
    const [patient, setPatient] = useState(null);
    const [vitals, setVitals] = useState(null); // State for vitals
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const { id } = useParams();
    const [showModal, setShowModal] = useState(false); // State for UpdateMedication modal
    const [showDischargeModal, setShowDischargeModal] = useState(false); // State for DischargePatient modal

    const handleAddMedicationClick = () => {
        console.log('Add Medication button clicked');
        setShowModal(true);
    };

    const handleDischargeClick = () => {
        setShowDischargeModal(true);
    };

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

                const { patient, vitals } = response.data; 
                setPatient(patient);
                setVitals(vitals); 
                
                console.log(response.data);
            } catch (err) {
                setError('Failed to load patient data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();

        const intervalId = setInterval(fetchPatientData, 5000);

        return () => clearInterval(intervalId);
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
                                <HeartRate value={vitals?.HeartRate} />
                                <OxygenCard value={vitals?.OxygenSaturation} />
                                <BloodPressureCard 
                                    systolic={vitals?.BloodPressureSystolic} 
                                    diastolic={vitals?.BloodPressureDiastolic} 
                                />
                                <TemperatureCard value={vitals?.Temperature} />
                            </div>
                            <div className={styles.medicationSection}>
                                <MedicationTable patient={patient} />
                                <div onClick={handleAddMedicationClick}>
                                    <AddMedicationButton />
                                </div>
                                {showModal && (
                                    <UpdateMedication
                                        showModal={showModal}
                                        setShowModal={setShowModal}
                                        patient={patient}
                                        medication={null} 
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if (user.role === 'NURSE') {
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
                                <HeartRate value={vitals?.HeartRate} />
                                <OxygenCard value={vitals?.OxygenSaturation} />
                                <BloodPressureCard 
                                    systolic={vitals?.BloodPressureSystolic} 
                                    diastolic={vitals?.BloodPressureDiastolic} 
                                />
                                <TemperatureCard value={vitals?.Temperature} />
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
    } else {
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
                            <div onClick={handleDischargeClick}>
                                <DischargePatientButton />
                            </div>
                        </div>

                        <div className={styles.rightColumn}>
                            <DischargePatient 
                                showModal={showDischargeModal} 
                                setShowModal={setShowDischargeModal} 
                                patient={patient} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HealthOverview;
