import React, { useState, useEffect } from "react";
import styles from "./MedicationTable.module.css"; // Import the CSS module
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";

const MedicationTableNurse = ({ medications = [] }) => {
  const [lastAdministered, setLastAdministered] = useState({});
  const { id } = useParams();

  const defaultMedications = [
    { name: "Benuron", quantity: "1mg", frequency: "5 in 5 hours" },
    { name: "Lisinopril", quantity: "1000mg", frequency: "4 in 4 hours" },
    { name: "Metformin", quantity: "2000mg", frequency: "5 in 5 hours" },
    { name: "Amoxicillin", quantity: "50mg", frequency: "8 in 8 hours" },
    { name: "Atorvastatin", quantity: "500mg", frequency: "8 in 8 hours" },
  ];

  const rows = medications.length > 0 ? medications : defaultMedications;

  const handleToggleCheck = (index, frequency) => {
    const now = new Date();
    const [hours] = frequency.split(" in ").map(Number);

    setLastAdministered((prev) => ({
      ...prev,
      [index]: { time: now, duration: hours * 60 * 60 * 1000 }, // Save duration in ms
    }));
  };

  const isCheckActive = (index) => {
    const entry = lastAdministered[index];
    if (!entry) return false;

    const { time, duration } = entry;
    const now = new Date();
    return now - time < duration; // Check if the time since last given is within the duration
  };

  const calculateTimeUntilNext = (index) => {
    const entry = lastAdministered[index];
    if (!entry) return "Not given yet";

    const { time, duration } = entry;
    const now = new Date();
    const remaining = duration - (now - time);

    if (remaining <= 0) return "Due now";
    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const hours = Math.floor(remaining / 1000 / 60 / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: "5%" }}>✔</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Frequency</th>
            <th>Last Administered</th>
            <th>Time Until Next</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((medication, index) => {
            const entry = lastAdministered[index];
            const lastTime = entry ? new Date(entry.time).toLocaleTimeString() : "Not given yet";

            return (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={isCheckActive(index)}
                    onChange={() => handleToggleCheck(index, medication.frequency)}
                    style={{
                      width: "20px",
                      height: "20px",
                      accentColor: isCheckActive(index) ? "#34c759" : "#ccc",
                    }}
                  />
                </td>
                <td>{medication.name}</td>
                <td>{medication.quantity}</td>
                <td>{medication.frequency}</td>
                <td>{lastTime}</td>
                <td>{calculateTimeUntilNext(index)}</td>
                <td className={styles.actions}>
                  <FontAwesomeIcon icon={faEdit} className={styles.icon} />
                  <FontAwesomeIcon icon={faTrash} className={styles.icon} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MedicationTableNurse;
