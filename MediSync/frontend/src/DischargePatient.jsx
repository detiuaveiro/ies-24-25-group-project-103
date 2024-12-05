import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DischargePatientModal.css';
import axios from 'axios';
import CONFIG from './config';

export default function DischargePatient({ showModal, setShowModal, patient }) {
    async function handleDischarge() {
        try {
            const token = localStorage.getItem("token"); 
            const userRole = localStorage.getItem("role"); 
            const baseUrl = CONFIG.API_URL;

            if (!token || !userRole) {
                alert("Authentication details not found");
                return;
            }

            const state = userRole === "HOSPITAL_MANAGER" ? "DISCHARGED" : "TO_BE_DISCHARGED";

            const response = await axios.put(
                `${baseUrl}/patients/${patient.id}/state`,
                state, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'text/plain', 
                    },
                }
            );

            if (response.status === 200) {
                alert('Patient state updated successfully');
                setShowModal(false);
            } else {
                alert('Failed to update patient state');
            }
        } catch (error) {
            alert('Failed to update patient state');
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
