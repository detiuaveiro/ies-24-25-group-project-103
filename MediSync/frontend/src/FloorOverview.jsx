import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FloorOverview.module.css';
import AddIcon from '@mui/icons-material/Add';
import CreatePatient from './CreatePatient';
import CONFIG from './config';

function FloorOverview() {
    const [beds, setBeds] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState('1');
    const token = localStorage.getItem('token');
    const [showPatientsModal, setShowPatientsModal] = useState(false);
    const baseUrl = CONFIG.API_URL;

    useEffect(() => {
        const fetchBeds = async () => {
            try {
                const response = await axios.get(`${baseUrl}/hospital/beds`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setBeds(response.data);
            } catch (error) {
                console.error('Error fetching beds:', error);
            }
        };
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${baseUrl}/doctors`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
        fetchDoctors();
        fetchBeds();
    }, [token]);

    const floors = ['1', '2', '3'];

    const addPatient = () => {
        setShowPatientsModal(true);
    };


    const getRoomsForFloor = () => {
        // Filter beds for selected floor and organize by room
        const floorRooms = beds.reduce((rooms, bed) => {
            const floor = bed.bedNumber.charAt(0);
            const roomNumber = bed.bedNumber.substring(0, 2);
            
            if (floor === selectedFloor) {
                if (!rooms[roomNumber]) {
                    rooms[roomNumber] = [];
                }
                rooms[roomNumber].push(bed);
            }
            return rooms;
        }, {});

        // Sort rooms by room number
        return Object.entries(floorRooms).sort((a, b) => a[0].localeCompare(b[0]));
    };

    const getBedStatus = (bed) => {
        if (bed.assignedPatient) return 'occupied';
        if (!bed.cleaned) return 'needs-cleaning';
        return 'available';
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Floor Overview</h1>
            
            <div className={styles.controlsRow}>
                <div className={styles.leftControls}>
                    <div className={styles.floorControl}>
                        <select 
                            value={selectedFloor} 
                            onChange={(e) => setSelectedFloor(e.target.value)}
                            className={styles.floorSelect}
                        >
                            {floors.map(floor => (
                                <option key={floor} value={floor}>
                                    Floor {floor}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <div className={`${styles.bed} ${styles.occupied}`}></div>
                            <span>Occupied Bed</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.bed} ${styles.available}`}></div>
                            <span>Free Bed</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.bed} ${styles['needs-cleaning']}`}></div>
                            <span>Needs to be Cleaned</span>
                        </div>
                    </div>
                </div>

                <div className={styles.actionButtons}>
                    <button className={styles.addButton} onClick={addPatient}>
                        <AddIcon /> Add Patient
                    </button>
                    <button className={styles.addButton}>
                        <AddIcon /> Add Staff
                    </button>
                </div>
            </div>

            <div className={styles.floorPlan}>
                {getRoomsForFloor().map(([roomNumber, roomBeds]) => (
                    <div key={roomNumber} className={styles.room}>
                        <div className={styles.roomHeader}>Room {roomNumber.charAt(1)}</div>
                        <div className={styles.bedGrid}>
                            {roomBeds
                                .sort((a, b) => a.bedNumber.localeCompare(b.bedNumber))
                                .map(bed => (
                                    <div 
                                        key={bed.id} 
                                        className={`${styles.bed} ${styles[getBedStatus(bed)]}`}
                                        title={`Bed ${bed.bedNumber.charAt(2)}`}
                                    >
                                        {bed.bedNumber.charAt(2)}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            <CreatePatient 
                showModal={showPatientsModal} 
                setShowModal={setShowPatientsModal} 
                availableBeds={beds.filter(bed => getBedStatus(bed) === "available").map(bed => ({
                    id: bed.id,
                    name: `Floor ${bed.bedNumber.charAt(0)} / Room ${bed.bedNumber.charAt(1)} / Bed ${bed.bedNumber.charAt(2)}`
                }))} 
                availableDoctors={doctors.map(doctor => ({
                    id: doctor.id,
                    name: doctor.name
                }))}
            />
        </div>
    );
}

export default FloorOverview;