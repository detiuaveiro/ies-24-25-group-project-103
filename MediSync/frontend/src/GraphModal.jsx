import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const GraphModal = ({ show, onClose, patientId, vitalType, startDate, endDate }) => {
  const [graphUrl, setGraphUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/patients/graph/${patientId}/${vitalType}/${startDate}/${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGraphUrl(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch graph data.');
      } finally {
        setLoading(false);
      }
    };

    if (show && patientId && vitalType && startDate && endDate) {
      fetchGraph();
    }
  }, [show, patientId, vitalType, startDate, endDate]);

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{`Graph for ${vitalType}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <p>Loading graph...</p>}
        {error && <p className="text-danger">{error}</p>}
        {graphUrl && (
          <div style={{ textAlign: 'center' }}>
            <img src={graphUrl} alt={`${vitalType} graph`} style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GraphModal;
