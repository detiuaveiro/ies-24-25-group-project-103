import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './VisitorInstructions.module.css';

function VisitorInstructions() {
    const location = useLocation();
    const { bed } = location.state || {};

    const roomNumber = bed?.room?.roomNumber || '';
    const floor = roomNumber ? String(roomNumber).charAt(0) : ''; // Extract first digit as floor number
    const roomNumberDisplay = roomNumber ? String(roomNumber).substring(1) : ''; // Remove floor number from display

    // This exists because I don't want to change the API and potentially break other parts of the system, this works just fine, even if we add more floors in the future
    const calculateActualBedNumber = (bedId) => {
        // Since each room has 4 beds, the actual bed number is:
        // bedId % 4 if not 0, or 4 if bedId % 4 is 0
        const remainder = bedId % 4;
        return remainder === 0 ? 4 : remainder;
    };
    const actualBedNumber = calculateActualBedNumber(parseInt(bed?.bedNumber));

    const getBedLocation = (bedNum) => {
        switch(bedNum) {
            case 1:
                return 'TOP LEFT';
            case 2:
                return 'TOP RIGHT';
            case 3:
                return 'BOTTOM LEFT';
            case 4:
                return 'BOTTOM RIGHT';
            default:
                return 'MIDDLE'; // Default case if any trouble happens
        }
    };
    
    const corner = getBedLocation(actualBedNumber);

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
                            {floor && <li>PRESS '{floor}' ON THE ELEVATOR</li>}
                            {roomNumber && <li>GO AHEAD UNTIL YOU FIND ROOM {roomNumberDisplay}</li>}
                            {corner && <li>ENTER THE ROOM AND YOU WILL FIND THE PATIENT IN THE {corner} BED</li>}
                        </ul>
                    </div>

                    {floor && (
                        <div className={styles.floorPlan}>
                            <h3>FLOOR {floor}</h3>
                            <div className={styles.roomsGrid}>
                                <div className={`${styles.room} ${roomNumberDisplay === '1' ? styles.highlight : ''}`}>Room 1</div>
                                <div className={`${styles.room} ${roomNumberDisplay === '2' ? styles.highlight : ''}`}>Room 2</div>
                                <div className={`${styles.room} ${roomNumberDisplay === '3' ? styles.highlight : ''}`}>Room 3</div>
                                <div className={`${styles.room} ${roomNumberDisplay === '4' ? styles.highlight : ''}`}>Room 4</div>
                                <div className={`${styles.room} ${roomNumberDisplay === '5' ? styles.highlight : ''}`}>Room 5</div>
                                <div className={`${styles.room} ${roomNumberDisplay === '6' ? styles.highlight : ''}`}>Room 6</div>
                                <div className={`${styles.room} ${roomNumberDisplay === '7' ? styles.highlight : ''}`}>Room 7</div>
                                <div className={`${styles.room} ${roomNumberDisplay === '8' ? styles.highlight : ''}`}>Room 8</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VisitorInstructions;