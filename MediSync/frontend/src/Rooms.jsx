// Rooms.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Rooms.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GridViewIcon from '@mui/icons-material/GridView';

function Rooms() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/hospital/rooms/occupants', {
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

    const getFloor = (roomNumber) => roomNumber.charAt(0);
    
    const getRoomNumber = (roomNumber) => roomNumber.charAt(1);

    const filteredRooms = rooms.filter(room => {
        const searchLower = searchTerm.toLowerCase();
        const floor = getFloor(room.roomNumber);
        const roomNum = getRoomNumber(room.roomNumber);
        
        return searchLower === '' || 
               `floor ${floor}`.includes(searchLower) ||
               `room ${roomNum}`.includes(searchLower) ||
               `floor ${floor} room ${roomNum}`.includes(searchLower);
    });

    if (loading) return <div className={styles.loadingContainer}>Loading rooms...</div>;
    if (error) return <div className={styles.errorContainer}>Error: {error}</div>;

    return (
        <div className={styles.roomsContainer}>
            <div className={styles.headerContainer}>
                <h1 className={styles.title}>List of Rooms</h1>
                <div className={styles.controlsContainer}>
                    <Button 
                        variant="contained" 
                        startIcon={<GridViewIcon className={styles.buttonIcon}/>}
                        onClick={() => navigate('/rooms/overview')}
                        className={styles.overviewButton}
                    >
                        Room Overview
                    </Button>
                    <div className={styles.searchContainer}>
                        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by floor or room (e.g., 'floor 1' or 'room 3')"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>
            </div>

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
                        {filteredRooms.map(room => (
                            <tr key={room.id}>
                                <td>{getFloor(room.roomNumber)}</td>
                                <td>{getRoomNumber(room.roomNumber)}</td>
                                <td>{`${room.currentPatients}/4`}</td>
                                <td>{`${room.currentStaff}/8`}</td>
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