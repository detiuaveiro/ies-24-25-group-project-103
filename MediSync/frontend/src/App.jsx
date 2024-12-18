import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import './App.css';
import Header from './Header';
import Patients from './Patients';
import Schedule from './Schedule';
import CodeVerification from './CodeVerification';
import DischargePatient from './DischargePatient';
import HealthOverview from './HealthOverview';
import Notifications from './Notification';
import Rooms from './Rooms';
import RoomPage from './RoomPage';
import DoctorPatients from './DoctorPatients';
import FloorOverview from './FloorOverview';
import OxygenSaturationAlert from './OxygenSaturationAlert';
import HeartRateAlert from './HeartRateAlert';
import TemperatureAlert from './TemperatureAlert';
import BloodPressureAlert from './BloodPressureAlert';
import VisitorInstructions from './VisitorInstructions';
import NotificationFetcher from './NotificationFetcher';
import CONFIG from './config';
import PatientAlerts from './PatientAlerts'; // Import the PatientAlerts component

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const [vitalsData, setVitalsData] = useState([]);
  const [bpAlerts, setBpAlerts] = useState([]);
  const [o2Alerts, setO2Alerts] = useState([]);
  const [hrAlerts, setHrAlerts] = useState([]);
  const [tempAlerts, setTempAlerts] = useState([]);
  const [bpModalState, setBpModalState] = useState([]);
  const [o2ModalState, setO2ModalState] = useState([]);
  const [hrModalState, setHrModalState] = useState([]);
  const [tempModalState, setTempModalState] = useState([]);
  const [scheduledRooms, setScheduledRooms] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const role = user ? JSON.parse(user).role : null;
  const nurseId = user ? JSON.parse(user).id : null;
  const userId = user ? JSON.parse(user).id : null;
  const baseUrl = CONFIG.API_URL;

  const headerExcludedRoutes = ['/', '/verify', '/visitorInstructions'];
  const shouldShowHeader = !headerExcludedRoutes.includes(location.pathname);

  useEffect(() => {
    const fetchVitalsData = async () => {
      if (role === 'NURSE' && nurseId) {
        const axiosInstance = axios.create({
          baseURL: `${baseUrl}`,
          headers: { Authorization: `Bearer ${token}` },
        });

        try {
          const scheduleResponse = await axiosInstance.get(`/nurses/${nurseId}/schedule`);
          const roomResponse = await axiosInstance.get(`/nurses/${nurseId}/roomswithpatients`);
          const rooms = roomResponse.data;
          const schedules = scheduleResponse.data;
          const currentDateTime = new Date();
          const currentSchedule = schedules.find((schedule) => {
            const startTime = new Date(schedule.start_time);
            const endTime = new Date(schedule.end_time);
            return currentDateTime >= startTime && currentDateTime <= endTime;
          });
          const assignedRooms = currentSchedule ? currentSchedule.roomsNumbers : [];
          setScheduledRooms(assignedRooms);
          const filteredRooms = rooms.filter((room) => assignedRooms.includes(room.roomNumber));
          setVitalsData(filteredRooms);

          const criticalBpPatients = filteredRooms.flatMap(room =>
            room.beds
              .filter(bed => bed?.patient?.vitals)
              .map(bed => {
                const { BloodPressureSystolic: systolic, BloodPressureDiastolic: diastolic } = bed.patient.vitals;

                if (systolic >= 140 || diastolic >= 90 || systolic < 70 || diastolic < 40) {
                  return {
                    name: bed.patient.name,
                    roomNumber: room.roomNumber,
                    vitals: { systolic, diastolic },
                  };
                }
                return null;
              })
              .filter(Boolean)
          );

          // Find patients with critical oxygen saturation
          const criticalO2Patients = filteredRooms.flatMap(room =>
            room.beds
              .filter(bed => bed?.patient?.vitals)
              .map(bed => {
                const { OxygenSaturation } = bed.patient.vitals;

                if (OxygenSaturation <= 94) {
                  return {
                    name: bed.patient.name,
                    roomNumber: room.roomNumber,
                    value: OxygenSaturation,
                  };
                }
                return null;
              })
              .filter(Boolean)
          );

          // Find patients with critical heart rate
          const criticalHrPatients = filteredRooms.flatMap(room =>
            room.beds
              .filter(bed => bed?.patient?.vitals)
              .map(bed => {
                const { HeartRate } = bed.patient.vitals;

                if (HeartRate >= 130 || HeartRate < 40) {
                  return {
                    name: bed.patient.name,
                    roomNumber: room.roomNumber,
                    value: HeartRate,
                  };
                }
                return null;
              })
              .filter(Boolean)
          );

          // Find patients with critical temperature
          const criticalTempPatients = filteredRooms.flatMap(room =>
            room.beds
              .filter(bed => bed?.patient?.vitals)
              .map(bed => {
                const { Temperature } = bed.patient.vitals;

                if (Temperature >= 37.5 || Temperature < 34) {
                  return {
                    name: bed.patient.name,
                    roomNumber: room.roomNumber,
                    value: Temperature,
                  };
                }
                return null;
              })
              .filter(Boolean)
          );

          setBpAlerts(criticalBpPatients);
          setO2Alerts(criticalO2Patients);
          setHrAlerts(criticalHrPatients);
          setTempAlerts(criticalTempPatients);

        } catch (error) {
          console.error('Error fetching vitals data:', error);
        }
      }
    };

    if (role === 'NURSE') {
      fetchVitalsData();
      const interval = setInterval(fetchVitalsData, 10000); // Fetch data every 10 seconds
      return () => clearInterval(interval);
    }
  }, [role, nurseId, token, baseUrl]);

  return (
    <>
      {role === 'NURSE' && (
        <PatientAlerts vitalsData={vitalsData} />
      )}

      {shouldShowHeader ? (
        <div className="app-layout">
          <NotificationFetcher
            userId={userId}
            token={token}
            interval={30000}
            onUpdateNotificationCount={setNotificationCount}
          />
          <Header numNotifications={notificationCount}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard_nurse" element={<RoomPage vitalsData={vitalsData} />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/patients/:id" element={<HealthOverview />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/park" element={<DischargePatient showModal={true} setShowModal={() => { }} />} />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/rooms/overview" element={<FloorOverview />} />
            </Routes>
          </Header>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/verify" element={<CodeVerification />} />
          <Route path="/visitorInstructions" element={<VisitorInstructions />} />
        </Routes>
      )}
    </>
  );
}

export default App;
