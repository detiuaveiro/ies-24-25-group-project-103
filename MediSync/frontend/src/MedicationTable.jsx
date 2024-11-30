import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import styles from "./MedicationTable.module.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UpdateMedication from "./UpdateMedication";

import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const MedicationTable= ({patient}) => {
  const [medications, setMedications] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [editMedication, setEditMedication] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found.");
        }

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
        setError("Failed to load medications.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [id]);

  if (loading) {
    return <div>Loading medications...</div>; 
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Dosage</th>
            <th>Hour Interval</th>
            <th>Last Taken</th>
            <th>Has Taken</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medications.map((medication) => (
            <tr key={medication.id}>
              <td>{medication.name}</td>
              <td>{medication.dosage}</td>
              <td>{medication.hourInterval}</td>
              <td>{medication.lastTaken ? new Date(medication.lastTaken).toLocaleString() : "N/A"}</td>
              <td>{medication.hasTaken ? "Yes" : "No"}</td>
              <td className={styles.actions}>
                <FontAwesomeIcon icon={faEdit} className={styles.icon} onClick={() => {
                  setEditMedication(medication);
                  setShowModal(true);
                }}/>
                <FontAwesomeIcon icon={faTrash} className={styles.icon} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UpdateMedication
      showModal={showModal}
      setShowModal={setShowModal}
      patient={patient}
      medication={editMedication} 
      />
    </div>
  );
};

export default MedicationTable;
