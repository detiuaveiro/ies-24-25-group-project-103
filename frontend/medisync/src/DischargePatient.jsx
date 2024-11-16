import { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

export default function DischargePatient({showModal, setShowModal}) {    
    function handleDischarge() {
        fetch(`/api/v1/patients/${patient.id}/discharge`, {
        method: 'POST',
        });
        setShowModal(false);
    }

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    } , [showModal]);

    function handleClose() {
        setShowModal(false);
    }
    
    return (
        <>
            <Modal show={showModal} onHide={handleClose} className="dischargeModal">
                <h2>Discharge Patient</h2>
                <p>Are you sure you want to discharge TEST?</p>
                <button onClick={handleClose}>No, Cancel</button>
                <button onClick={handleDischarge}>Yes, Discharge</button>
            </Modal>
        </>
    );
}