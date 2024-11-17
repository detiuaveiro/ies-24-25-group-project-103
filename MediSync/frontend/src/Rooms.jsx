import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Rooms.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed } from '@fortawesome/free-solid-svg-icons';

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/hospital/rooms', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setRooms(response.data);
            } catch (err) {
                console.error('Error fetching rooms:', err);
                setError(err.response?.data?.message || 'Failed to fetch rooms');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchRooms();
        } else {
            setError('Not authenticated');
            setLoading(false);
        }
    }, [token]);

    // Helper function to get floor number from room number
    const getFloor = (roomNumber) => roomNumber.charAt(0);
    
    // Helper function to get room number (second digit)
    const getRoomNumber = (roomNumber) => roomNumber.charAt(1);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <p>Loading rooms...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p>Error: {error}</p>
                <p>Please try again later or contact support.</p>
            </div>
        );
    }

    return (
        <div className={styles.roomsContainer}>
            <h1 className={styles.title}>List of Rooms</h1>
            <div className={styles.tableContainer}>
                <table className={styles.roomsTable}>
                    <thead>
                        <tr>
                            <th>Floor</th>
                            <th>Room</th>
                            <th>Patients</th>
                            <th>Staff</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room.id}>
                                <td>{getFloor(room.roomNumber)}</td>
                                <td>{getRoomNumber(room.roomNumber)}</td>
                                <td>0/4</td>
                                <td>0/8</td>
                                <td>
                                    <button className={styles.moreInfoButton}>
                                        More Information <FontAwesomeIcon icon={faBed} />
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

export default Rooms;