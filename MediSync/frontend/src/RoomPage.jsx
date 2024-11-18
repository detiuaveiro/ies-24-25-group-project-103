import React, { useEffect, useState } from "react";
import axios from "axios";
import HeartRateAlert from "./HeartRateAlert";
import OxygenSaturationAlert from "./OxygenSaturationAlert";
import TemperatureAlert from "./TemperatureAlert"; // Import TemperatureAlert
import BloodPressureAlert from "./BloodPressureAlert"; // Import BloodPressureAlert
import "./RoomPage.css";

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [scheduledRooms, setScheduledRooms] = useState([]);
  const [showHeartRateAlert, setShowHeartRateAlert] = useState(false);
  const [showOxygenAlert, setShowOxygenAlert] = useState(false);
  const [showTemperatureAlert, setShowTemperatureAlert] = useState(false); // State for temperature alert
  const [showBloodPressureAlert, setShowBloodPressureAlert] = useState(false); // State for blood pressure alert
  const [alertPatient, setAlertPatient] = useState(null);
  const [alertValue, setAlertValue] = useState(null);
  const [alertTemperature, setAlertTemperature] = useState(null); // For storing temperature
  const [alertBloodPressure, setAlertBloodPressure] = useState(null); // For storing blood pressure

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const nurseId = user ? JSON.parse(user).id : null;

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchDataAndMonitorVitals = async () => {
    if (!nurseId) {
      console.error("Nurse ID not found! Ensure localStorage is correctly set.");
      return;
    }

    try {
      // Fetch nurse's schedule
      const scheduleResponse = await axiosInstance.get(
        `/nurses/${nurseId}/schedule`
      );
      const schedules = scheduleResponse.data;
      const currentDateTime = new Date();

      const currentSchedule = schedules.find((schedule) => {
        const startTime = new Date(schedule.start_time);
        const endTime = new Date(schedule.end_time);
        return currentDateTime >= startTime && currentDateTime <= endTime;
      });

      const assignedRooms = currentSchedule
        ? currentSchedule.roomsNumbers
        : [];
      setScheduledRooms(assignedRooms);

      // Fetch room details
      const roomResponse = await axiosInstance.get(
        `/nurses/${nurseId}/patients-by-room-with-beds`
      );
      const fetchedRooms = roomResponse.data;
      setRooms(fetchedRooms);

      // Monitor vitals for active rooms
      const activeRooms = fetchedRooms.filter((room) =>
        assignedRooms.includes(room.roomNumber)
      );

      for (const room of activeRooms) {
        for (const bed of room.beds) {
          if (bed && bed.patient) {
            const { vitals, patient } = bed.patient;

            // Check heart rate
            if (vitals.heartRate >= 130 || vitals.heartRate < 40) {
              setAlertPatient({ ...patient, roomNumber: room.roomNumber });
              setAlertValue(vitals.heartRate);
              setShowHeartRateAlert(true);
              return; // Stop checking further once an alert is triggered
            }

            // Check oxygen saturation
            if (vitals.oxygenSaturation <= 94) {
              setAlertPatient({ ...patient, roomNumber: room.roomNumber });
              setAlertValue(vitals.oxygenSaturation);
              setShowOxygenAlert(true);
              return; // Stop checking further once an alert is triggered
            }

            // Check temperature
            if (vitals.temperature >= 40 || vitals.temperature < 34) {
              setAlertPatient({ ...patient, roomNumber: room.roomNumber });
              setAlertTemperature(vitals.temperature);
              setShowTemperatureAlert(true);
              return; // Stop checking further once an alert is triggered
            }

            // Check blood pressure
            if (vitals.systolic >= 140 || vitals.diastolic >= 90) {
              setAlertPatient({ ...patient, roomNumber: room.roomNumber });
              setAlertBloodPressure([vitals.systolic, vitals.diastolic]);
              setShowBloodPressureAlert(true);
              return; // Stop checking further once an alert is triggered
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data or monitoring vitals:", error);
    }
  };

  // Fetch data on initial mount
  useEffect(() => {
    fetchDataAndMonitorVitals();
  }, []); // Empty dependency array ensures it runs only once

  if (!nurseId) {
    return <div>Error: Nurse ID is not available.</div>;
  }

  const filteredRooms = rooms.filter((room) =>
    scheduledRooms.includes(room.roomNumber)
  );

  return (
    <div className="room-container">
      <h1>Assigned Rooms:</h1>
      <button onClick={fetchDataAndMonitorVitals} className="refresh-button">
        Refresh
      </button>
      {filteredRooms.length > 0 ? (
        <div className="room-grid">
          {filteredRooms.map((room) => (
            <div key={room.roomId} className="room">
              <h2>Room {room.roomNumber}</h2>
              <div className="beds">
                {[...Array(4)].map((_, index) => {
                  const bed = room.beds[index];
                  return (
                    <div
                      key={index}
                      className={`bed ${
                        bed && bed.patient ? "occupied" : "empty"
                      }`}
                    >
                      {bed && bed.patient ? (
                        <>
                          <h3>{bed.patient.patient.name}</h3>
                          <div className="vitals">
                            <p>
                              <span className="icon">💓</span>
                              {bed.patient.vitals.heartRate} bpm
                            </p>
                          </div>
                        </>
                      ) : (
                        <p>No patient</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No rooms assigned for the current schedule.</p>
      )}

      {/* Alerts */}
      {showHeartRateAlert && (
        <HeartRateAlert
          showModal={showHeartRateAlert}
          setShowModal={setShowHeartRateAlert}
          patient={alertPatient}
          value={alertValue}
        />
      )}
      {showOxygenAlert && (
        <OxygenSaturationAlert
          showModal={showOxygenAlert}
          setShowModal={setShowOxygenAlert}
          patient={alertPatient}
          value={alertValue}
        />
      )}
      {showTemperatureAlert && (
        <TemperatureAlert
          showModal={showTemperatureAlert}
          setShowModal={setShowTemperatureAlert}
          patient={alertPatient}
          value={alertTemperature}
        />
      )}
      {showBloodPressureAlert && (
        <BloodPressureAlert
          showModal={showBloodPressureAlert}
          setShowModal={setShowBloodPressureAlert}
          patient={alertPatient}
          values={alertBloodPressure}
        />
      )}
    </div>
  );
};

export default RoomPage;
