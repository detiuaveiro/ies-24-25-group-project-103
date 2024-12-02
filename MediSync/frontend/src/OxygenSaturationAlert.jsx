import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './OxygenSaturationAlert.css';

export default function OxygenSaturationAlert({showModal, setShowModal, patient, value}) {

    useEffect(() => {
        if (value <= 94) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [value]);

    function handleClose() {
        setShowModal(false);
    }

    if (!showModal) {
        return null; 
    }
    
    return (
        <>
            <Modal show={showModal} onHide={handleClose} className="oxygen-saturation" centered>
            <button className="close-button" onClick={handleClose}>&times;</button>
                <Modal.Body className="custom-modal-body">
                    <div className="alert-text">
                        <span className="o2">{value}</span><span className="percent">%</span>
                    </div>
                    <img src="/oxygen.png" className="o2-image"/>
                    <div className="patient-info">
                        <span className="patient-status">SATURATION IS VERY LOW</span> <br/>
                        <span className="patient-name">{patient?.name}</span>
                        <br />
                        <span className="patient-room">{patient?.roomNumber}</span>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
