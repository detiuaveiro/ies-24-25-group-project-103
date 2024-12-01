import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './VisitorInstructions.module.css';

function VisitorsInstructions() {
    const location = useLocation();
    const { bed } = location.state || {};
  
    const roomNumber = bed?.room?.roomNumber || '';
    const floor = roomNumber ? roomNumber.charAt(0) : ''; // Extract first digit as floor number
    const roomNumberDisplay = roomNumber ? roomNumber.substring(1) : ''; // Remove floor number from display
    const bedNumber = bed?.bedNumber || '';

    const getBedLocation = (bedNumber) => {
        switch(bedNumber) {
            case '1':
                return 'TOP LEFT';
            case '2':
                return 'TOP RIGHT';
            case '3':
                return 'BOTTOM LEFT';
            case '4':
                return 'BOTTOM RIGHT';
            default:
                return '';
        }
    };
    const corner = getBedLocation(bedNumber);

    return (
        <div className={styles.page}>
        <div className={styles.container}>
            <div className={styles.logoContainer}>
            <img src="/media/medisync.png" alt="Medisync Logo" className={styles.logo} />
            </div>
            
            <div className={styles.contentContainer}>
            <div className={styles.instructionsSection}>
                <h2>INSTRUCTIONS TO FIND PATIENT:</h2>
                <ul>
                <li>PRESS '{floor}' ON THE ELEVATOR</li>
                <li>GO AHEAD UNTIL YOU FIND ROOM {roomNumber}</li>
                <li>ENTER THE ROOM AND YOU WILL FIND IT IN THE {corner} CORNER</li>
                </ul>
            </div>

            <div className={styles.floorPlan}>
                <h3>FLOOR {floor}</h3>
                <div className={styles.roomsGrid}>
                <div className={`${styles.room} ${roomNumberDisplay === '01' ? styles.highlight : ''}`}>Room 01</div>
                <div className={`${styles.room} ${roomNumberDisplay === '02' ? styles.highlight : ''}`}>Room 02</div>
                <div className={`${styles.room} ${roomNumberDisplay === '03' ? styles.highlight : ''}`}>Room 03</div>
                <div className={`${styles.room} ${roomNumberDisplay === '04' ? styles.highlight : ''}`}>Room 04</div>
                
                <div className={`${styles.room} ${roomNumberDisplay === '05' ? styles.highlight : ''}`}>Room 05</div>
                <div className={`${styles.room} ${roomNumberDisplay === '06' ? styles.highlight : ''}`}>Room 06</div>
                <div className={`${styles.room} ${roomNumberDisplay === '07' ? styles.highlight : ''}`}>Room 07</div>
                <div className={`${styles.room} ${roomNumberDisplay === '08' ? styles.highlight : ''}`}>Room 08</div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default VisitorsInstructions;