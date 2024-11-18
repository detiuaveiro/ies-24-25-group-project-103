import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import styles from "./MedicationTable.module.css"; // Import the CSS module
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import axios from "axios";

const MedicationTableNurse = () => {
  const [medications, setMedications] = useState([]);
  const [lastAdministered, setLastAdministered] = useState({});
  const { id } = useParams(); // Get user ID from route parameters
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found.");

        const response = await axios.get(
          `http://localhost:8080/api/v1/patients/${id}/medications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMedications(response.data);
      } catch (err) {
        console.error("Error fetching medications:", err);
        setError("Failed to load medications.");
      }
    };

    fetchMedications();
  }, [id]);

  const handleToggleCheck = async (medication, index) => {
    const now = new Date();
    const isTaken = !isCheckActive(index); // Determine new state
    const updatedMedication = {
      ...medication,
      hasTaken: isTaken,
      lastTaken: isTaken ? now.toISOString() : null, // Set `lastTaken` or clear it
      patientId: id, // Ensure the patientId is included in the request
    };
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found.");
  
      // Perform PUT request to update the medication
      await axios.put(
        `http://localhost:8080/api/v1/patients/${id}/medications/${medication.id}`,
        updatedMedication,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update local state
      setLastAdministered((prev) => ({
        ...prev,
        [index]: isTaken
          ? { time: now, duration: medication.hourInterval * 60 * 60 * 1000 }
          : null,
      }));
    } catch (err) {
      console.error("Error updating medication:", err);
      setError("Failed to update medication.");
    }
  };
  

  const isCheckActive = (index) => {
    const entry = lastAdministered[index];
    if (!entry) return false;

    const { time, duration } = entry;
    const now = new Date();
    return now - time < duration; // Check if within the interval
  };

  const calculateTimeUntilNext = (medication) => {
    const { lastTaken, hourInterval } = medication;
    if (!lastTaken) return "Not given yet";

    const lastTime = new Date(lastTaken);
    const nextDue = new Date(lastTime.getTime() + hourInterval * 60 * 60 * 1000);
    const now = new Date();
    const remaining = nextDue - now;

    if (remaining <= 0) return "Due now";
    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const hours = Math.floor(remaining / 1000 / 60 / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) return <p>Loading medications...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.tableContainer}>
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
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
            {medications.map((medication, index) => {
              const entry = lastAdministered[index];
              const lastTime = entry
                ? new Date(entry.time).toLocaleTimeString()
                : "Not given yet";

              return (
                <tr key={medication.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isCheckActive(index)}
                      onChange={() => handleToggleCheck(medication, index)}
                      style={{
                        width: "20px",
                        height: "20px",
                        accentColor: isCheckActive(index) ? "#34c759" : "#ccc",
                      }}
                    />
                  </td>
                  <td>{medication.name}</td>
                  <td>{medication.dosage}</td>
                  <td>{medication.hourInterval}</td>
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
      )}
    </div>
  );
};

export default MedicationTableNurse;
