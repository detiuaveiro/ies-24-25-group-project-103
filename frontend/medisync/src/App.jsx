import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';

import Login from './Login';
import DischargePatient from './DischargePatient';

function App() {
  const [showModal, setShowModal] = useState(true);
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/park" element={<DischargePatient showModal={showModal} setShowModal={setShowModal}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
