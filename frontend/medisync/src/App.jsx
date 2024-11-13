import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Login.css';
import Login from './Login';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
