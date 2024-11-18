import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faClipboardList, faArrowRightFromBracket, faBedPulse, faComment } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import EventNoteIcon from '@mui/icons-material/EventNote';

function Header({ children }) {
    const [profileImage, setProfileImage] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu
    const role = localStorage.getItem('userRole');
    const name = JSON.parse(localStorage.getItem('user')).name;
    const user = JSON.parse(localStorage.getItem('user'));
    const imageUrl = user.profilePictureUrl;
    const fullImageUrl = `http://localhost:8080/uploads/${imageUrl}`;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await axios.get(fullImageUrl, {
                    responseType: 'blob',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const blob = response.data;
                setProfileImage(URL.createObjectURL(blob)); // Convert the Blob to a local URL
            } catch (error) {
                console.error('Error fetching profile image:', error.response ? error.response.data : error.message);
            }
        };

        fetchProfileImage();
    }, [fullImageUrl, token]);

    const toggleMenu = () => {
        console.log('Menu toggle clicked, current state:', isMenuOpen);
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('token');
        window.location.href = '/';
    };
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

                <div className={styles.hamburger} onClick={toggleMenu}>
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="2x" />
                </div>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    {isMenuOpen && (
                        <button className={styles.closeButton} onClick={toggleMenu}>
                            <FontAwesomeIcon icon={faTimes} size="2x" />
                        </button>
                    )}
                    {(role === 'DOCTOR' ) || role === 'HOSPITAL_MANAGER' ? (
                    <Link to={getPatientsLink()} style={{ textDecoration: "none" }}>
                    <div className={styles.navButton}>
                            <FontAwesomeIcon icon={faClipboardList} size="2x" />
                            <span className={styles.btnText}> List of Patients</span>
                        </div>
                    </Link>
                    ) : null}
                    {(role === 'NURSE' ) ? (
                    <Link to="/dashboard_nurse" style={{ textDecoration: "none" }}>
                    <div className={styles.navButton}>
                            <FontAwesomeIcon icon={faClipboardList} size="2x" />
                            <span className={styles.btnText}> List of Patients</span>
                        </div>
                    </Link>
                    ) : null}
                    {(role === 'HOSPITAL_MANAGER') ? (
                    <Link to="/rooms" style={{ textDecoration: "none" }}>
                        <div className={styles.navButton}>
                            <FontAwesomeIcon icon={faBedPulse} size="2x" />
                            <span className={styles.btnText}> List of Rooms</span>
                        </div>
                    </Link>
                    ) : null}
                    {((role === 'NURSE'))? (
                    <Link to = "/schedule" style={{ textDecoration: "none" }}>
                        <div className={styles.navButton}>
                            <EventNoteIcon fontSize="large" />
                            <span className={styles.btnText}> Schedule</span>
                        </div>
                    </Link>
                    ) : null}
                    {((role === 'NURSE') || (role === 'HOSPITAL_MANAGER')) ? (
                    <Link to="/notifications" style={{ textDecoration: "none" }}>
                    
                        <div className={styles.alertButton}>
                            <FontAwesomeIcon icon={faComment} size="2x" />
                            <span className={styles.btnText}> Alerts</span>
                            <span className={styles.notificationBadge}>2</span>
                        </div>
                    </Link>
                    ) : null}
                    <div className={styles.logoutButton} onClick={handleLogout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} size="2x" />
                    </div>
                </nav>
            </header>

            <div className={styles.mainContent}>
                {children}
            </div>
        </div>
    );
}

export default Header;
