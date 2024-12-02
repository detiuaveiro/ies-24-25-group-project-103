import { useState, useEffect } from 'react';
import axios from 'axios';
import CONFIG from './config';

export function useVitalsAlerts(nurseId, token) {
  const [vitalsData, setVitalsData] = useState([]);
  const [alerts, setAlerts] = useState({
    bpAlerts: [],
    o2Alerts: [],
    hrAlerts: [],
    tempAlerts: [],
  });

  useEffect(() => {
    const fetchVitalsData = async () => {
      if (!nurseId || !token) return;

      const axiosInstance = axios.create({
        baseURL: CONFIG.API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        const roomResponse = await axiosInstance.get(`/nurses/${nurseId}/roomswithpatients`);
        const rooms = roomResponse.data;
        setVitalsData(rooms);

        const bpAlerts = [];
        const o2Alerts = [];
        const hrAlerts = [];
        const tempAlerts = [];

        rooms.forEach((room) => {
          room.beds.forEach((bed) => {
            if (!bed?.patient?.vitals) return;

            const { BloodPressureSystolic: systolic, BloodPressureDiastolic: diastolic, OxygenSaturation, HeartRate, Temperature } =
              bed.patient.vitals;

            if (systolic >= 140 || diastolic >= 90 || systolic < 70 || diastolic < 40) {
              bpAlerts.push({
                name: bed.patient.name,
                roomNumber: room.roomNumber,
                vitals: { systolic, diastolic },
              });
            }

            if (OxygenSaturation <= 94) {
              o2Alerts.push({
                name: bed.patient.name,
                roomNumber: room.roomNumber,
                value: OxygenSaturation,
              });
            }

            if (HeartRate >= 130 || HeartRate < 40) {
              hrAlerts.push({
                name: bed.patient.name,
                roomNumber: room.roomNumber,
                value: HeartRate,
              });
            }

            if (Temperature >= 37.5 || Temperature < 34) {
              tempAlerts.push({
                name: bed.patient.name,
                roomNumber: room.roomNumber,
                value: Temperature,
              });
            }
          });
        });

        setAlerts({ bpAlerts, o2Alerts, hrAlerts, tempAlerts });
      } catch (error) {
        console.error('Error fetching vitals data:', error);
      }
    };

    fetchVitalsData();
    const interval = setInterval(fetchVitalsData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [nurseId, token]);

  return { vitalsData, alerts };
}

