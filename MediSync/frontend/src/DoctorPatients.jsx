import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DoctorPatients.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function DoctorPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/v1/doctors/${user.id}/patients`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setPatients(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('Failed to fetch patients');
                setLoading(false);
            }
        };

        fetchPatients();
    }, [user.id, token]);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className={styles.loadingContainer}>Loading patients...</div>;
    if (error) return <div className={styles.errorContainer}>{error}</div>;

    return (
        <div className={styles.patientsContainer}>
            <div className={styles.headerContainer}>
                <h1 className={styles.title}>My Patients</h1>
                <div className={styles.searchContainer}>
                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.patientsTable}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Patient Name</th>
                            <th>Room</th>
                            <th>Estimated Discharge Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map((patient, index) => (
                            <tr key={patient.id}>
                                <td>{String(index + 1).padStart(2, '0')}</td>
                                <td>{patient.name}</td>
                                <td>{patient.room || 'Not assigned'}</td>
                                <td>{new Date(patient.estimatedDischargeDate).toLocaleDateString('en-GB')}</td>
                                <td>
                                    <button 
                                        className={styles.moreInfoButton}
                                        onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                                    >
                                        More Information <FontAwesomeIcon icon={faChartLine} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DoctorPatients;