import { useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './HeartRateAlert.css';

export default function HeartRateAlert({ showModal, setShowModal, patient }) {

    function handleClose() {
        setShowModal(false);
    }

    return (
        <>
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Body>
                    <div className="alert alert-danger" role="alert">
                        {/* Needs to be replaced with patient's heart rate attribute */}
                        165bpm
                    </div>
                    
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
