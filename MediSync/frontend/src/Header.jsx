import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faClipboardList, faArrowRightFromBracket, faBedPulse, faComment } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

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
                setProfileImage(URL.createObjectURL(blob));
            } catch (error) {
                console.error('Error fetching profile image:', error.response ? error.response.data : error.message);
            }
        };

        fetchProfileImage();
    }, [fullImageUrl, token]);
<<<<<<< HEAD

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
=======
    
    const getPatientsLink = () => {
        if (role === 'DOCTOR') {
            return '/doctor/patients';
        }
        return '/patients';
    };

>>>>>>> develop
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

<<<<<<< HEAD
                {/* Hamburger Icon */}
                <div className={styles.hamburger} onClick={toggleMenu}>
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="2x" />
                </div>

                {/* Navigation for desktop and mobile */}
                {/* Navigation for desktop and mobile */}
                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
                    {/* Close button */}
                    {isMenuOpen && (
                        <button className={styles.closeButton} onClick={toggleMenu}>
                            <FontAwesomeIcon icon={faTimes} size="2x" />
                        </button>
                    )}
                    <Link to="/patients" style={{ textDecoration: "none" }}>
=======
                <div className={styles.navButtons}>
                    <Link to={getPatientsLink()}>
>>>>>>> develop
                        <div className={styles.navButton}>
                            <FontAwesomeIcon icon={faClipboardList} size="2x" />
                            <span className={styles.btnText}> 
                                {role === 'DOCTOR' ? 'My Patients' : 'List of Patients'}
                            </span>
                        </div>
                    </Link>
                    <Link to="/rooms" style={{ textDecoration: "none" }}>
                        <div className={styles.navButton}>
                            <FontAwesomeIcon icon={faBedPulse} size="2x" />
                            <span className={styles.btnText}> List of Rooms</span>
                        </div>
                    </Link>
                    <Link to="/notifications" style={{ textDecoration: "none" }}>
                    
                        <div className={styles.alertButton}>
                            <FontAwesomeIcon icon={faComment} size="2x" />
                            <span className={styles.btnText}> Alerts</span>
                            <span className={styles.notificationBadge}>2</span>
                        </div>
                    </Link>
                    <div className={styles.logoutButton} onClick={handleLogout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} size="2x" />
                    </div>
<<<<<<< HEAD
                </nav>
=======
                </div>

                <div className={styles.logoutButton}>
                    <Link to="/">
                        <div className={styles.navButton}>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} size="2x" />
                        </div>
                    </Link>
                </div>
>>>>>>> develop
            </header>

            <div className={styles.mainContent}>
                {children}
            </div>
        </div>
    );
}

export default Header;