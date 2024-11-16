import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';

import Login from './Login';
import './App.css'
import axios from 'axios';
import Header from './Header';
import Patients from './Patients';
import Dashboard from './Dashboard';
import DischargePatient from './DischargePatient';

function App() {
  const [showModal, setShowModal] = useState(true);
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
        <Header>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/park" element={<DischargePatient showModal={showModal} setShowModal={setShowModal}/>} />
            </Routes>
        </Header>
    </Router>
  );
}

export default App;
