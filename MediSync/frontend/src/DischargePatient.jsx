import { useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DischargePatientModal.css';

export default function DischargePatient({ showModal, setShowModal, patient }) {

    function handleDischarge() {
        fetch(`/api/v1/patients/${patient.id}/discharge`, {
            method: 'POST',
        }).then(response => {
            if (response.ok) {
                alert('Patient discharged successfully');
                setShowModal(false);
            } else {
                alert('Failed to discharge patient');
            }
        });
    }

    function handleClose() {
        setShowModal(false);
    }

    return (
        <>
            <Modal show={showModal} onHide={handleClose} centered>
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
