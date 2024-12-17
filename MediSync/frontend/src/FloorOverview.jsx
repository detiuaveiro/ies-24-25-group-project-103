import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './FloorOverview.module.css';
import AddIcon from '@mui/icons-material/Add';
import CreatePatient from './CreatePatient';
import CONFIG from './config';
import AddStaff from './AddStaff';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Button } from '@mui/material';

function FloorOverview() {
    const [beds, setBeds] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState('1');
    const token = localStorage.getItem('token');
    const [showPatientsModal, setShowPatientsModal] = useState(false);
    const [showStaffModal, setShowStaffModal] = useState(false);
    const baseUrl = CONFIG.API_URL;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                setError('Error fetching beds');
            }
        };
    
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${baseUrl}/doctors`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDoctors(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setError('Error fetching doctors');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctors();
        fetchBeds();
    }, [token, baseUrl]);

    const floors = ['1', '2', '3'];

    const addPatient = () => {
        setShowPatientsModal(true);
    };

    const addStaff = () => {
        setShowStaffModal(true);
    };

    const getRoomsForFloor = () => {
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

        return Object.entries(floorRooms).sort((a, b) => a[0].localeCompare(b[0]));
    };

    const getBedStatus = (bed) => {
        if (bed.assignedPatient) return 'occupied';
        if (!bed.cleaned) return 'needs-cleaning';
        return 'available';
    };

    const handleBedClick = (bed) => {
        if (bed.assignedPatient) {
            navigate(`/patients/${bed.assignedPatient.id}`);
        }
    };

    const isIsolationRoom = (roomNumber) => {
        return selectedFloor === '3' && (roomNumber === '37' || roomNumber === '38');
    };

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 className={styles.title}>Floor Overview</h1>
                <Button 
                    variant="contained" 
                    startIcon={<FormatListBulletedIcon className={styles.buttonIcon} />}
                    onClick={() => navigate('/rooms')}
                    className={styles.overviewButton}
                    style={{ marginBottom: "10px" }}
                >
                    Room Overview
                </Button>
            </div>

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
                        <div className={styles.legendItem}>
                            <div className={`${styles.isolationIndicator}`}></div>
                            <span>Isolation Room</span>
                        </div>
                    </div>
                </div>

                <div className={styles.actionButtons}>
                    <button className={styles.addButton} onClick={addPatient}>
                        <AddIcon /> Add Patient
                    </button>
                    <button className={styles.addButton} onClick={addStaff}>
                        <AddIcon /> Add Staff
                    </button>
                </div>
            </div>
            <div className={styles.floorPlan}>
                {getRoomsForFloor().map(([roomNumber, roomBeds]) => (
                    <div 
                        key={roomNumber} 
                        className={`${styles.room} ${isIsolationRoom(roomNumber) ? styles.isolationRoom : ''}`}
                    >
                        <div className={styles.roomHeader}>
                            Room {roomNumber.charAt(1)}
                            {isIsolationRoom(roomNumber) && 
                                <span className={styles.isolationLabel}>Isolation Room</span>
                            }
                        </div>
                        <div className={styles.bedGrid}>
                            {roomBeds
                                .sort((a, b) => a.bedNumber.localeCompare(b.bedNumber))
                                .map(bed => (
                                    <div 
                                        key={bed.id} 
                                        className={`${styles.bed} ${styles[getBedStatus(bed)]}`}
                                        title={`Bed ${bed.bedNumber.charAt(2)}`}
                                        onClick={() => handleBedClick(bed)}
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
                availableBeds={beds
                    .filter(bed => getBedStatus(bed) === "available")
                    .map(bed => ({
                        id: bed.id,
                        name: `Floor ${bed.bedNumber.charAt(0)} / Room ${bed.bedNumber.charAt(1)} / Bed ${bed.bedNumber.charAt(2)}`
                    }))} 
                availableDoctors={doctors.map(doctor => ({
                    id: doctor.id,
                    name: doctor.name
                }))}
            />

            <AddStaff showModal={showStaffModal} setShowModal={setShowStaffModal} />
        </div>
    );
}

export default FloorOverview;