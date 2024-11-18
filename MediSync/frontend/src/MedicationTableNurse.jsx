import React, { useState, useEffect } from "react";
import styles from "./MedicationTable.module.css"; // Import the CSS module
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import axios from "axios";

const MedicationTableNurse = () => {
  const [medications, setMedications] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedications = async () => {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/patients/${id}/medications`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          },
        });
        setMedications(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load medications");
        setLoading(false);
      }
    };

    fetchMedications();
  }, [id]);

  const handleToggleCheck = async (medication) => {
    const token = localStorage.getItem("token");
    const now = new Date();

    // Calculate the next due time
    const lastTaken = new Date(medication.lastTaken || 0); // Handle null `lastTaken`
    const nextDue = new Date(lastTaken.getTime() + medication.hourInterval * 60 * 60 * 1000);

    // Check if the medication is still within the due interval
    if (now < nextDue && medication.hasTaken) {
      console.log("Medication is still within the interval. No update required.");
      return;
    }

    try {
      // Toggle the medication status
      const updatedMedication = {
        ...medication,
        hasTaken: now < nextDue, // Untoggle if overdue, otherwise set to true
        lastTaken: now < nextDue ? medication.lastTaken : now.toISOString(),
      };

      await axios.put(
        `http://localhost:8080/api/v1/patients/${id}/medications/${medication.id}`,
        updatedMedication,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the state locally
      setMedications((prev) =>
        prev.map((item) =>
          item.id === medication.id ? updatedMedication : item
        )
      );
    } catch (err) {
      setError("Failed to update medication status");
    }
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
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: "5%" }}>✔</th>
            <th>Name</th>
            <th>Dosage</th>
            <th>Frequency (hours)</th>
            <th>Last Administered</th>
            <th>Time Until Next</th>
          </tr>
        </thead>
        <tbody>
          {medications.map((medication) => {
            const lastTime = medication.lastTaken
              ? new Date(medication.lastTaken).toLocaleTimeString()
              : "Not given yet";

            return (
              <tr key={medication.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={medication.hasTaken}
                    onChange={() => handleToggleCheck(medication)}
                    style={{
                      width: "20px",
                      height: "20px",
                      accentColor: medication.hasTaken ? "#34c759" : "#ccc",
                    }}
                  />
                </td>
                <td>{medication.name}</td>
                <td>{medication.dosage}</td>
                <td>{medication.hourInterval}</td>
                <td>{lastTime}</td>
                <td>{calculateTimeUntilNext(medication)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MedicationTableNurse;
