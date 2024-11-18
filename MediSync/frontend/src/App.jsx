import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Login from './Login';
import './App.css';
import Header from './Header';
import Patients from './Patients';
import Dashboard from './Dashboard';
import Schedule from './Schedule';
import CodeVerification from './CodeVerification';
import DischargePatient from './DischargePatient';
import PatientInfo from './PatientInfo';
import HealthOverview from './HealthOverview';
import Notifications from './Notification';
import Rooms from './Rooms';
import RoomPage from './RoomPage';
import DoctorPatients from "./DoctorPatients";

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(true);
  const headerExcludedRoutes = ['/', '/verify'];
  const shouldShowHeader = !headerExcludedRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header> {}
        <Routes>
          <Route path="/dashboard_nurse" element={<RoomPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/patients/:id" element={<HealthOverview />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/park" element={<DischargePatient showModal={showModal} setShowModal={setShowModal}/>} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
        </Routes>
      </Header>}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify" element={<CodeVerification />} />
      </Routes>
    </>
  );
}

export default App;