import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeartbeat, FaLungs, FaThermometerHalf, FaTachometerAlt } from "react-icons/fa";
import "./RoomPage.css";

const RoomPage = ({ vitalsData }) => {
  if (!vitalsData) {
    return <p>Loading...</p>;
  }

  const rooms = vitalsData;
  console.log(vitalsData);
  console.log(rooms);
  const [filter, setFilter] = useState("HeartRate");

  const filteredRooms = rooms || [];

  const getVitalValue = (vitals) => {
    switch (filter) {
      case "HeartRate":
        return {
          value: vitals?.HeartRate || "N/A",
          display: vitals?.HeartRate || "N/A",
          icon: <FaHeartbeat />,
          unit: "bpm",
        };
      case "Oxygen":
        return {
          value: vitals?.OxygenSaturation || "N/A",
          display: vitals?.OxygenSaturation || "N/A",
          icon: <FaLungs />,
          unit: "%",
        };
      case "Temperature":
        return {
          value: vitals?.Temperature || "N/A",
          display: vitals?.Temperature || "N/A",
          icon: <FaThermometerHalf />,
          unit: "°C",
        };
      case "BloodPressure":
        const systolic = vitals?.BloodPressureSystolic || "N/A";
        const diastolic = vitals?.BloodPressureDiastolic || "N/A";
        return {
          value: systolic !== "N/A" && diastolic !== "N/A" ? `${systolic}/${diastolic}` : "N/A",
          display: (
            <>
              {systolic}
              <span className="diastolic">/{diastolic}</span>
            </>
          ),
          icon: <FaTachometerAlt />,
          unit: "mmHg",
        };
      default:
        return { value: "N/A", display: "N/A", icon: null, unit: "" };
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
                  const bed = room.beds?.[index];
                  const vital = bed && bed.patient ? getVitalValue(bed.patient.vitals) : null;
                  return (
                    <div
                      key={index}
                      className={`bed-card ${vital ? getCardBackground(vital.value) : "empty"}`}
                    >
                      {bed && bed.patient ? (
                        <Link
                          to={`/patients/${bed.patient.patient.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <>
                            <h3 className="patient-name">{bed.patient.patient.name}</h3>
                            <div className="bed-icon">{vital.icon}</div>
                            <p className="bed-value">
                              {vital.display}
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
