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
import CONFIG from './config';
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

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const role = user ? JSON.parse(user).role : null;
  const nurseId = user ? JSON.parse(user).id : null;
  const baseUrl = CONFIG.API_URL;

  const headerExcludedRoutes = ['/', '/verify'];
  const shouldShowHeader = !headerExcludedRoutes.includes(location.pathname);
    useEffect(() => {
      setBpModalState(new Array(bpAlerts.length).fill(true));
      setO2ModalState(new Array(o2Alerts.length).fill(true));
      setHrModalState(new Array(hrAlerts.length).fill(true));
      setTempModalState(new Array(tempAlerts.length).fill(true));
    }, [bpAlerts, o2Alerts, hrAlerts, tempAlerts]);

  useEffect(() => {
    const fetchVitalsData = async () => {
      if (nurseId) {
        const axiosInstance = axios.create({
          baseURL: `${baseUrl}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        try {
          const roomResponse = await axiosInstance.get(`/nurses/${nurseId}/roomswithpatients`);
          const rooms = roomResponse.data;
          setVitalsData(rooms);

          const criticalBpPatients = rooms.flatMap(room =>
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
          const criticalO2Patients = rooms.flatMap(room =>
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
          const criticalHrPatients = rooms.flatMap(room =>
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
          const criticalTempPatients = rooms.flatMap(room =>
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

    fetchVitalsData();

    const interval = setInterval(fetchVitalsData, 10000);
    return () => clearInterval(interval);
  }, [nurseId, token, baseUrl]);

return (
  <>
    {role === 'NURSE' && (
      <>
        {bpAlerts.map((patient, index) => (
          <BloodPressureAlert
            key={`bp-${index}`}
            showModal={bpModalState[index]}
            setShowModal={(value) => {
              const newState = [...bpModalState];
              newState[index] = value;
              setBpModalState(newState);
            }}
            patient={patient}
            values={[patient.vitals.systolic, patient.vitals.diastolic]}
          />
        ))}
        {o2Alerts.map((patient, index) => (
          <OxygenSaturationAlert
            key={`o2-${index}`}
            showModal={o2ModalState[index]}
            setShowModal={(value) => {
              const newState = [...o2ModalState];
              newState[index] = value;
              setO2ModalState(newState);
            }}
            patient={patient}
            value={patient.value}
          />
        ))}
        {hrAlerts.map((patient, index) => (
          <HeartRateAlert
            key={`hr-${index}`}
            showModal={hrModalState[index]}
            setShowModal={(value) => {
              const newState = [...hrModalState];
              newState[index] = value;
              setHrModalState(newState);
            }}
            patient={patient}
            value={patient.value}
          />
        ))}
        {tempAlerts.map((patient, index) => (
          <TemperatureAlert
            key={`temp-${index}`}
            showModal={tempModalState[index]}
            setShowModal={(value) => {
              const newState = [...tempModalState];
              newState[index] = value;
              setTempModalState(newState);
            }}
            patient={patient}
            value={patient.value}
          />
        ))}
      </>
    )}

  {shouldShowHeader ? (
        <div className="app-layout">
          <Header>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard_nurse" element={<RoomPage vitalsData={vitalsData} />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/patients/:id" element={<HealthOverview />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route
                path="/park"
                element={<DischargePatient showModal={true} setShowModal={() => { }} />}
              />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/rooms/overview" element={<FloorOverview />} />
            </Routes>
          </Header>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/verify" element={<CodeVerification />} />
        </Routes>
      )}
  </>
  
);
}

export default App;
