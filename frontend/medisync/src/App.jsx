import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Login';
import './App.css';
import Header from './Header';
import Patients from './Patients';
import Dashboard from './Dashboard';
import CodeVerification from './CodeVerification';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();

  // Define routes where the Header should not appear
  const headerExcludedRoutes = ['/', '/verify'];

  const shouldShowHeader = !headerExcludedRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify" element={<CodeVerification />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </>
  );
}

export default App;
