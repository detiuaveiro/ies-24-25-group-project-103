import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [visitorPhoneNumber, setVisitorPhoneNumber] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorError, setVisitorError] = useState('');
  const [visitorMessage, setVisitorMessage] = useState('');

  const baseUrl = 'http://localhost:8080/api/v1';
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/auth/login`,
        { username, password },
        { withCredentials: true }
      );

      const { token, user, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', role);
      console.log(role);
      if (role === 'HOSPITAL_MANAGER') navigate('/rooms/overview');
      else if (role === 'DOCTOR') navigate('/doctor/patients');
      else if (role === 'NURSE') navigate('/dashboard_nurse');
      else navigate('/patients');

    } catch (error) {
      setError('Invalid username or password');
    }
  };

  const handleVisitorSubmit = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/visitors`,
        { name: visitorName, phoneNumber: visitorPhoneNumber },
        { withCredentials: true }
      );

      setVisitorMessage(response.data);
      setVisitorError('');
      navigate('/verify', { state: { phoneNumber: visitorPhoneNumber } });
    } catch (error) {
      setVisitorError('Visitor not allowed');
      setVisitorMessage('');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.logoContainer}>
        <img src='/media/medisync.png' alt="Medisync Logo" className={styles.logo} />
      </div>
      
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.staffLogin}>
            <h2>FOR STAFF:</h2>
            <div className={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="USERNAME" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <input 
                type="password" 
                placeholder="PASSWORD" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className={styles.loginButton} onClick={handleLogin}>
              LOGIN
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <p className={styles.forgotPassword}>Forgot password?</p>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.patientVisit}>
            <h2>TO VISIT A PATIENT:</h2>
            <div className={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="YOUR PHONE NUMBER" 
                value={visitorPhoneNumber}
                onChange={(e) => setVisitorPhoneNumber(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <input 
                type="text" 
                placeholder="PATIENT NAME" 
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
              />
            </div>
            <button className={styles.submitButton} onClick={handleVisitorSubmit}>
              SUBMIT
            </button>
            {visitorMessage && <p className={styles.successMessage}>{visitorMessage}</p>}
            {visitorError && <p className={styles.errorMessage}>{visitorError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
