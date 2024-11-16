import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import './App.css'
import axios from 'axios';
import Header from './Header';
import Patients from './Patients';
import Dashboard from './Dashboard';



function App() {
  
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
        </Routes>
        <Header>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
            </Routes>
        </Header>
    </Router>
  );
}

export default App;
