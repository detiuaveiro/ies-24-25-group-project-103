import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DischargePatientModal.css';
import axios from 'axios';
import CONFIG from './config';

export default function DischargePatient({ showModal, setShowModal, patient }) {
    async function handleDischarge() {
        try {
            const token = localStorage.getItem("token"); // Retrieve token from localStorage
            const baseUrl = CONFIG.API_URL;
            
            if (!token) {
                alert("Authentication token not found");
                return;
            }

            const response = await axios.delete(
                `${baseUrl}/patients/${patient.id}`,
             // POST body is empty for this request
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add the Authorization header
                    },
                }
            );

            if (response.status === 204) {
                alert('Patient discharged successfully');
                setShowModal(false);
            } else {
                alert('Failed to discharge patient');
            }
        } catch (error) {
            alert('Failed to discharge patient');
            console.error(error);
        }
    }

    function handleClose() {
        setShowModal(false);
    }

    return (
        <>
            <Modal className="discharge-patient" show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Discharge Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to discharge patient <strong>{patient?.name}</strong>?</p>
                    <p>This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDischarge}>
                        Discharge Patient
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
