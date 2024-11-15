import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Visitor state
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
            {
                username,
                password
            },
            { withCredentials: true }
        );

        const { token, user } = response.data;
        console.log('Login successful:', token, user);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        navigate('/dashboard');
    } catch (error) {
        console.error('Error logging in:', error);
        setError('Invalid username or password');
    }
};


const handleVisitorSubmit = async () => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  console.log('Retrieved token:', token); // Log the token to ensure it’s fetched
  
  try {
      const response = await axios.post(
        `${baseUrl}/visitors`, 
        {
            name: visitorName,
            phoneNumber: visitorPhoneNumber,
        },
        {
        withCredentials: true 
        }
    );
      console.log('Response:', response); // Log the response to see the data
      console.log("aaa")
      console.log('Visitor submission successful:', response.data); // Log the response for success
      setVisitorMessage(response.data);
      setVisitorError('');
  } catch (error) {
      console.error('Error submitting visitor information:', error); // Log the error details
      setVisitorError('Visitor not allowed');
      setVisitorMessage('');
  }
};

  return (
    <div className="page">
      <div className="logo-container">
        <img src='/media/medisync.png' alt="Medisync Logo" className="logo" />
      </div>
      
      <div className="container">
        <div className="form-container">
          <div className="staff-login">
            <h2>FOR STAFF:</h2>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="USERNAME" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="PASSWORD" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="login-button" onClick={handleLogin}>
              LOGIN
            </button>
            {error && <p className="error-message">{error}</p>}
            <p className="forgot-password">Forgot password?</p>
          </div>

          <div className="divider"></div>

          <div className="patient-visit">
            <h2>TO VISIT A PATIENT:</h2>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="YOUR PHONE NUMBER" 
                value={visitorPhoneNumber}
                onChange={(e) => setVisitorPhoneNumber(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="PATIENT NAME" 
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
              />
            </div>
            <button className="submit-button" onClick={handleVisitorSubmit}>
              SUBMIT
            </button>
            {visitorMessage && <p className="success-message">{visitorMessage}</p>}
            {visitorError && <p className="error-message">{visitorError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
