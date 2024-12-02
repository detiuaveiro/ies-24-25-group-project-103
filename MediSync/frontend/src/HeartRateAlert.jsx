import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HeartRateAlert.css';

export default function HeartRateAlert({ showModal, setShowModal, patient, value}) {
    const [status, setStatus] = useState('HIGH');

    useEffect(() => {
        if (value >= 130) {
            setShowModal(true);
            setStatus('HIGH');
        } else if (value < 40) {
            setShowModal(true);
            setStatus('LOW');
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
            <Modal show={showModal} onHide={handleClose} className="heart-rate" centered>
                <Modal.Body className="custom-modal-body">
                    <button className="close-button" onClick={handleClose}>&times;</button>
                    <div className="alert-text">
                        <span className="heart-rate">{value}</span><span className="bpm">bpm</span>
                    </div>
                    <svg className='heart-icon' xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 296 259" fill="none">
                        <path d="M24.3278 89.2925C24.3278 43.1785 54.722 0.41748 96.3418 0.41748C125.224 0.41748 146.656 19.6028 159.884 46.819C173.112 19.6044 194.544 0.41748 223.427 0.41748C265.052 0.41748 295.441 43.1857 295.441 89.2925C295.441 187.992 159.884 258.155 159.884 258.155C159.884 258.155 68.5727 213.753 35.8349 140.92H116.704L129.558 117.839L144.572 170.92L179.732 125.259H223.676V109.15H171.932L151.275 135.978L134.393 76.2985L107.378 124.811H29.7488C31.4391 130.323 33.4866 135.695 35.8349 140.92L0.406006 140.919V124.81L29.7488 124.811C26.2928 113.542 24.3278 101.685 24.3278 89.2925Z" fill="#F03434"/>
                    </svg>
                    <div className="patient-info">
                        <span className="patient-status">BPM's ARE VERY {status}</span> <br/>
                        <span className="patient-name">{patient?.name}</span>
                        <br />
                        <span className="patient-room">{patient?.roomNumber}</span>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
