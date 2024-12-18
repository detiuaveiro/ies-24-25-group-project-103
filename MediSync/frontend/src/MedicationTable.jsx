import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CONFIG from "./config";
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
  const [trigger, setTrigger] = useState(false);
  const { id } = useParams();
  const baseUrl = CONFIG.API_URL;



  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await axios.get(
          `${baseUrl}/patients/${id}/medications`,
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
  }, [id, baseUrl, trigger]);


  const triggerUpdate = (updatedMedication) => {
    if (updatedMedication) {
      setMedications((prevMedications) => {
        // Check if the medication exists in the list
        const index = prevMedications.findIndex(med => med.id === updatedMedication.id);
        if (index > -1) {
          // Update the existing medication
          const newMedications = [...prevMedications];
          newMedications[index] = updatedMedication;
          return newMedications;
        } else {
          // Add the new medication
          return [...prevMedications, updatedMedication];
        }
      });
    } else {
      // No specific medication, refetch (fallback case)
      setTrigger(!trigger);
    }
  };
  
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
  updateMedication={triggerUpdate}
/>

    </div>
  );
};

export default MedicationTable;