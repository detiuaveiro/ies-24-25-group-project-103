import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faArrowRightFromBracket, faBedPulse, faComment } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function Header({ children }) {
    const [profileImage, setProfileImage] = useState(null);
    const role = localStorage.getItem('userRole');
    const name = JSON.parse(localStorage.getItem('user')).name;
    const user = JSON.parse(localStorage.getItem('user'));
    const imageUrl = user.profilePictureUrl;
    const fullImageUrl = `http://localhost:8080/uploads/${imageUrl}`;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                console.log('Fetching image from:', fullImageUrl);
                const response = await axios.get(fullImageUrl, {
                    responseType: 'blob',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const blob = response.data;
                setProfileImage(URL.createObjectURL(blob));
            } catch (error) {
                console.error('Error fetching profile image:', error.response ? error.response.data : error.message);
            }
        };
    
        fetchProfileImage();
    }, [fullImageUrl, token]);
    
    const getPatientsLink = () => {
        if (role === 'DOCTOR') {
            return '/doctor/patients';
        }
        return '/patients';
    };

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={styles.profile}>
                    <img
                        src={profileImage || 'placeholder.jpg'}
                        alt="Profile"
                        className={styles.profileImage}
                    />
                    <div className={styles.profileInfo}>
                        <span className={styles.profileName}>{name}</span>
                        <span>{role}</span>
                    </div>
                </div>

                <div className={styles.navButtons}>
                    <Link to={getPatientsLink()}>
                        <div className={styles.navButton}>
                            <FontAwesomeIcon icon={faClipboardList} size="2x" />
                            <span className={styles.btnText}> 
                                {role === 'DOCTOR' ? 'My Patients' : 'List of Patients'}
                            </span>
                        </div>
                    </Link>
                    <Link to="/rooms">
                        <div className={styles.navButton}>
                            <FontAwesomeIcon icon={faBedPulse} size="2x" />
                            <span className={styles.btnText}> List of Rooms</span>
                        </div>
                    </Link>

                    <div className={styles.alertButton}>
                        <FontAwesomeIcon icon={faComment} size="2x" />
                        <span className={styles.btnText}> Alerts</span>
                        <span className={styles.notificationBadge}>2</span>
                    </div>
                </div>

                <div className={styles.logoutButton}>
                    <Link to="/">
                        <div className={styles.navButton}>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} size="2x" />
                        </div>
                    </Link>
                </div>
            </header>

            <div className={styles.mainContent}>
                {children}
            </div>
        </div>
    );
}

export default Header;