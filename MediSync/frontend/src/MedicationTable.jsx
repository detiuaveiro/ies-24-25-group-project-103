import React from "react";
import styles from "./MedicationTable.module.css"; // Import the CSS module
import EditIcon from "@mui/icons-material/Edit";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from "react";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';   

import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const MedicationTableNurse = ({ medications = [] }) => {
  // Default values for medications
  const [Medication, setMedication] = useState([]);
  const { id } = useParams();
  const defaultMedications = [
    { name: "Benuron", quantity: "1mg", frequency: "5 in 5 hours" },
    { name: "Lisinopril", quantity: "1000mg", frequency: "4 in 4 hours" },
    { name: "Metformin", quantity: "2000mg", frequency: "5 in 5 hours" },
    { name: "Amoxicillin", quantity: "50mg", frequency: "8 in 8 hours" },
    { name: "Atorvastatin", quantity: "500mg", frequency: "8 in 8" },
  ];

  useEffect(() => {
    const fetchPatientData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await axios.get(`http://localhost:8080/api/v1/patients/${id}/medications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMedication(response.data);
            console.log(response.data);
        } catch (err) {
            setError('Failed to load patient data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchPatientData();
}, [id]);

  const rows = medications.length > 0 ? medications : defaultMedications;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Frequency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((medication, index) => (
            <tr key={index}>
              <td>{medication.name}</td>
              <td>{medication.quantity}</td>
              <td>{medication.frequency}</td>
              <td className={styles.actions}>
                <FontAwesomeIcon icon={faEdit} className={styles.icon} />
                <FontAwesomeIcon icon={faTrash} className={styles.icon} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicationTableNurse
