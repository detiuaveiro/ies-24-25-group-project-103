import React, { useEffect, useState } from 'react';
import BloodPressureAlert from './BloodPressureAlert';
import OxygenSaturationAlert from './OxygenSaturationAlert';
import HeartRateAlert from './HeartRateAlert';
import TemperatureAlert from './TemperatureAlert';
import './PatientAlerts.css';

const PatientAlerts = ({ vitalsData }) => {
  const [alertQueue, setAlertQueue] = useState([]);
  const [suppressedPatients, setSuppressedPatients] = useState(new Map());
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  useEffect(() => {
    const savedSuppression = localStorage.getItem('suppressedPatients');
    if (savedSuppression) {
      setSuppressedPatients(new Map(JSON.parse(savedSuppression)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('suppressedPatients', JSON.stringify([...suppressedPatients]));
  }, [suppressedPatients]);

  const isSuppressed = (patientId) => {
    if (!suppressedPatients.has(patientId)) return false;

    const suppressionTime = suppressedPatients.get(patientId);
    const now = Date.now();
    return now - suppressionTime < 15 * 60 * 1000; 
  };

  const suppressPatient = (patientId) => {
    setSuppressedPatients((prev) => {
      const updated = new Map(prev);
      updated.set(patientId, Date.now());
      return updated;
    });
  };

  const setShowModal = (show) => {
    if (!show) closeCurrentModal();
  };

  const closeCurrentModal = () => {
    if (alertQueue.length > 0) {
      const currentAlert = alertQueue[currentAlertIndex];
      suppressPatient(currentAlert.patient.id);
      setCurrentAlertIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const alerts = new Map();

    vitalsData.forEach((room) => {
      if (!Array.isArray(room.beds)) return;

      room.beds.forEach((bed) => {
        if (!bed?.patient?.vitals) return;

        const patientId = bed.patient.patient.id;

        if (isSuppressed(patientId)) return;

        const { BloodPressureSystolic: systolic, BloodPressureDiastolic: diastolic, OxygenSaturation, HeartRate, Temperature } =
          bed.patient.vitals;

        const patient = {
          id: bed.patient.patient.id,
          name: bed.patient.patient.name,
          roomNumber: room.roomNumber,
          bedNumber: bed.bedNumber,
          vitals: { systolic, diastolic, OxygenSaturation, HeartRate, Temperature },
        };

        if (!alerts.has(patientId)) {
          alerts.set(patientId, { patient, alerts: [] });
        }

        if (systolic >= 140 || diastolic >= 90 || systolic < 70 || diastolic < 40) {
          alerts.get(patientId).alerts.push({ type: 'BloodPressure', values: [systolic, diastolic] });
        }
        if (OxygenSaturation <= 95) {
          alerts.get(patientId).alerts.push({ type: 'OxygenSaturation', value: OxygenSaturation });
        }
        if (HeartRate >= 100 || HeartRate < 65) {
          alerts.get(patientId).alerts.push({ type: 'HeartRate', value: HeartRate });
        }
        if (Temperature >= 37.5 || Temperature < 34) {
          alerts.get(patientId).alerts.push({ type: 'Temperature', value: Temperature });
        }
      });
    });

    setAlertQueue(Array.from(alerts.values()));
    setCurrentAlertIndex(0);
  }, [vitalsData]);

  if (!Array.isArray(vitalsData) || vitalsData.length === 0) {
    return <div>No patient data available.</div>;
  }
  
  const currentAlert = alertQueue[currentAlertIndex];
  
  // Ensure there are valid alerts before rendering the modal
  const hasValidAlerts = currentAlert?.alerts?.length > 0;
  
  return (
    <>
      {hasValidAlerts && (
        <div className="alerts-modal" style={{ zIndex: currentAlertIndex + 100 }}>
          <div className="alerts-modal-content">
            <span className="close-modal-icon" onClick={closeCurrentModal}>
              &times;
            </span>
            <div className="alerts-modal-body">
              {currentAlert.alerts.map((alert, index) => {
                const { type, value, values } = alert;
                switch (type) {
                  case 'BloodPressure':
                    return (
                      <BloodPressureAlert
                        key={`bp-${index}`}
                        patient={currentAlert.patient}
                        values={values}
                        showModal={true}
                        setShowModal={setShowModal}
                      />
                    );
                  case 'OxygenSaturation':
                    return (
                      <OxygenSaturationAlert
                        key={`o2-${index}`}
                        patient={currentAlert.patient}
                        value={value}
                        showModal={true}
                        setShowModal={setShowModal}
                      />
                    );
                  case 'HeartRate':
                    return (
                      <HeartRateAlert
                        key={`hr-${index}`}
                        patient={currentAlert.patient}
                        value={value}
                        showModal={true}
                        setShowModal={setShowModal}
                      />
                    );
                  case 'Temperature':
                    return (
                      <TemperatureAlert
                        key={`temp-${index}`}
                        patient={currentAlert.patient}
                        value={value}
                        showModal={true}
                        setShowModal={setShowModal}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );

}

export default PatientAlerts;