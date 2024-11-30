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

  useEffect(() => {
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

    fetchData();
  }, [nurseId]);

  const filteredRooms = rooms.filter((room) => scheduledRooms.includes(room.roomNumber));

  const getVitalValue = (vitals) => {
    switch (filter) {
      case "HeartRate":
        return { value: vitals.heartRate, icon: <FaHeartbeat />, unit: "bpm" };
      case "Oxygen":
        return { value: vitals.oxygenSaturation, icon: <FaLungs />, unit: "%" };
      case "Temperature":
        return { value: vitals.temperature, icon: <FaThermometerHalf />, unit: "°C" };
      case "BloodPressure":
        return {
          value: `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`,
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
        if (value < 60) return "bad"; // Below normal
        if (value <= 100) return "good"; // Normal range
        return "warning"; // Above normal
  
      case "Oxygen":
        if (value < 90) return "bad"; // Dangerously low
        if (value <= 100) return "good"; // Normal range
        return "warning"; // Higher than normal (rare but possible)
  
      case "Temperature":
        if (value < 36) return "bad"; // Hypothermia
        if (value <= 37.5) return "good"; // Normal range
        if (value <= 38) return "warning"; // Low-grade fever
        return "bad"; // High fever
  
      case "BloodPressure":
        const [systolic, diastolic] = value.split("/").map(Number);
        if (systolic < 90 || diastolic < 60) return "bad"; // Low blood pressure
        if (systolic <= 120 && diastolic <= 80) return "good"; // Normal range
        if (systolic <= 140 || diastolic <= 90) return "warning"; // Elevated
        return "bad"; // Hypertension
  
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
                  const vital = bed && bed.patient ? getVitalValue(bed.patient.vitals) : null;
                  return (
                    <div
                      key={index}
                      className={`bed-card ${vital ? getCardBackground(vital.value) : "empty"}`}
                    >
                      {bed && bed.patient ? (
                        <>
                          <Link to={`/patients/${bed.patient.patient.id}`}>
                            <h3>{bed.patient.patient.name}</h3>
                          </Link>
                          <div className="bed-icon">{vital.icon}</div>
                          <p className="bed-value">
                            {vital.value} {vital.unit}
                          </p>
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
    </div>
  );
};

export default RoomPage;
