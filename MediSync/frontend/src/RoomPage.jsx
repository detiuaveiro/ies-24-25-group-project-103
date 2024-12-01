import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHeartbeat, FaLungs, FaThermometerHalf, FaTachometerAlt } from "react-icons/fa";
import "./RoomPage.css";
import CONFIG from "./config";

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [scheduledRooms, setScheduledRooms] = useState([]);
  const [filter, setFilter] = useState("HeartRate");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const nurseId = user ? JSON.parse(user).id : null;
  const baseUrl = CONFIG.API_URL;

  const axiosInstance = axios.create({
    baseURL: `${baseUrl}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchData = async () => {
    if (!nurseId) return;

    try {
      const scheduleResponse = await axiosInstance.get(`/nurses/${nurseId}/schedule`);
      const roomResponse = await axiosInstance.get(`/nurses/${nurseId}/roomswithpatients`);
      const schedules = scheduleResponse.data;
      const currentDateTime = new Date();
      const currentSchedule = schedules.find((schedule) => {
        const startTime = new Date(schedule.start_time);
        const endTime = new Date(schedule.end_time);
        return currentDateTime >= startTime && currentDateTime <= endTime;
      });

      const assignedRooms = currentSchedule ? currentSchedule.roomsNumbers : [];
      setScheduledRooms(assignedRooms);
      setRooms(roomResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); 

    const interval = setInterval(() => {
      fetchData(); 
    }, 10000);

    return () => clearInterval(interval);
  }, [nurseId]);

  const filteredRooms = rooms.filter((room) => scheduledRooms.includes(room.roomNumber));

  const getVitalValue = (vitals) => {
    switch (filter) {
      case "HeartRate":
        return { value: vitals.HeartRate, icon: <FaHeartbeat />, unit: "bpm" };
      case "Oxygen":
        return { value: vitals.OxygenSaturation, icon: <FaLungs />, unit: "%" };
      case "Temperature":
        return { value: vitals.Temperature, icon: <FaThermometerHalf />, unit: "°C" };
      case "BloodPressure":
        return {
          value: `${vitals.BloodPressureSystolic}/${vitals.BloodPressureDiastolic}`,
          icon: <FaTachometerAlt />,
          unit: "mmHg",
        };
      default:
        return { value: "N/A", icon: null, unit: "" };
    }
  };

  const getCardBackground = (value) => {
    if (value === "N/A") return "neutral";

    switch (filter) {
      case "HeartRate":
        if (value < 60) return "bad";
        if (value <= 100) return "good";
        return "warning";

      case "Oxygen":
        if (value < 90) return "bad";
        if (value <= 100) return "good";
        return "warning";

      case "Temperature":
        if (value < 36) return "bad";
        if (value <= 37.5) return "good";
        if (value <= 38) return "warning";
        return "bad";

      case "BloodPressure":
        const [systolic, diastolic] = value.split("/").map(Number);
        if (systolic < 90 || diastolic < 60) return "bad";
        if (systolic <= 120 && diastolic <= 80) return "good";
        if (systolic <= 140 || diastolic <= 90) return "warning";
        return "bad";

      default:
        return "neutral";
    }
  };

  return (
    <div className="room-container">
    <div className="header">
      <h1>Assigned Rooms</h1>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="filter-dropdown"
      >
        <option value="HeartRate">Heart Rate</option>
        <option value="Oxygen">Oxygen Saturation</option>
        <option value="Temperature">Temperature</option>
        <option value="BloodPressure">Blood Pressure</option>
      </select>
    </div>


      {filteredRooms.length > 0 ? (
        <div className="room-grid">
          {filteredRooms.map((room) => (
            <div key={room.roomId} className="room-card">
              <h2>Room {room.roomNumber}</h2>
              <div className="beds-grid">
                {[...Array(4)].map((_, index) => {
                  const bed = room.beds[index];
                  console.log(bed);
                  const vital = bed && bed.patient ? getVitalValue(bed.patient.vitals) : null;
                  return (
                    <div
                      key={index}
                      className={`bed-card ${vital ? getCardBackground(vital.value) : "empty"}`}
                    >
                      {bed && bed.patient ? (
                        <Link to={`/patients/${bed.patient.patient.id}`} style={{ textDecoration: 'none' }}>
                        <>
                          <h3 className="patient-name">{bed.patient.patient.name}</h3>
                          <div className="bed-icon">{vital.icon}</div>
                          <p className="bed-value">
                            {vital.value}
                            <span>{vital.unit}</span>
                          </p>
                        </>
                        </Link>
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
    </div>
  );
};

export default RoomPage;
