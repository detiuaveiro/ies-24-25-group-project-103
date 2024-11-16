import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from './CodeVerification.module.css';

function CodeVerification() {
  const [code, setCode] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const inputRef = useRef(null);
  const phoneNumber = location.state?.phoneNumber || '';

  const handleInputChange = async (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setCode(value);
      setErrorMessage('');
      setActiveIndex(value.length);

      if (value.length === 6) {
        await checkCode(value);
      }
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus(); 
  };

  const checkCode = async (code) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/visitors/checkcode',
        { code: code, phoneNumber: phoneNumber },
        { withCredentials: true }
      );

      console.log('Valid code, bed:', response.data); // Handle success as needed
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorMessage('The code you entered is not valid. Please try again.');
      } else {
        setErrorMessage('An error occurred while verifying the code. Please try again later.');
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.medsyncContainer}>
        <img src="/media/medisync.png" alt="Medisync Logo" className={styles.logo} />
        <p className={styles.medsyncInstruction}>
          CODE SENT TO <span className={styles.medsyncNumber}>{phoneNumber}</span>
        </p>
        <p className={styles.medsyncSubtitle}>INSERT HERE:</p>
        <div
          className={styles.medsyncInputContainer}
          onClick={handleContainerClick}
        >
          {[...Array(6)].map((_, index) => (
            <span
              key={index}
              className={`${styles.inputBox} ${activeIndex === index ? styles.active : ''}`}
            >
              {code[index] || ''} {}
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            className={styles.hiddenInput}
            value={code}
            onChange={handleInputChange}
            maxLength="6"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

export default CodeVerification;
