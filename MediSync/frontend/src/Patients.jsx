import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Patients.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import CONFIG from './config';

function Patients() {
    const [patients, setPatients] = useState([]);
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');
    const baseUrl = CONFIG.API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsResponse, bedsResponse] = await Promise.all([
                    axios.get(`${baseUrl}/patients`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get(`${baseUrl}/hospital/beds`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                setPatients(patientsResponse.data);
                setBeds(bedsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        } else {
            setError('Not authenticated');
            setLoading(false);
        }
    }, [token, baseUrl]);

    // Function to format room number (e.g., "13" becomes "Floor 1 Room 3")
    const formatRoomNumber = (roomNumber) => {
        if (!roomNumber) return '-';
        const floor = roomNumber.charAt(0);
        const room = roomNumber.charAt(1);
        return `Floor ${floor} Room ${room}`;
    };

    const getPatientRoom = (patientId) => {
        const bed = beds.find(bed => bed.assignedPatient?.id === patientId);
        if (bed) {
            if (typeof bed.room === 'object') {
                return formatRoomNumber(bed.room.roomNumber);
            } else {
                const roomBed = beds.find(b => 
                    typeof b.room === 'object' && b.room.id === bed.room
                );
                return formatRoomNumber(roomBed?.room?.roomNumber);
            }
        }
        return '-';
    };

    if (loading) return <div className={styles.loadingContainer}>Loading patients...</div>;
    if (error) return <div className={styles.errorContainer}>Error: {error}</div>;

    return (
        <div className={styles.patientsContainer}>
            <div className={styles.headerContainer}>
                <h1 className={styles.title}>List of Patients</h1>
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
                        <th className={styles.hideOnMobile}>#</th>
                        <th>Patient Name</th>
                        <th>Room</th>
                        <th className={styles.hideOnMobile}>Estimated Discharge Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient, index) => (
                        <tr key={patient.id}>
                            <td className={styles.hideOnMobile}>{String(index + 1).padStart(2, '0')}</td>
                            <td>{patient.name}</td>
                            <td>{getPatientRoom(patient.id)}</td>
                            <td className={styles.hideOnMobile}>
                                {new Date(patient.estimatedDischargeDate).toLocaleDateString('en-GB')}
                            </td>
                            <td>
                                <Link to={`/patients/${patient.id}`} style={{ textDecoration: 'none' }}>
                                    <button className={styles.moreInfoButton}>
                                        More Information <FontAwesomeIcon icon={faChartLine} />
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            </div>
        </div>
    );
}

export default Patients;