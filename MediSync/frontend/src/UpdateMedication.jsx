import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UpdateMedication.css';
import CONFIG from './config';

export default function UpdateMedication({ showModal, setShowModal, patient, medication=null}) {
    const addMedication = medication === null;
    console.log(addMedication);    

    const [medicationName, setMedicationName] = useState(medication?.name || '');
    const [hourInterval, setHourInterval] = useState(medication?.hourInterval || '');
    const [numberTimes, setNumberTimes] = useState(medication?.numberTimes || '');
    const [dosage, setDosage] = useState(medication?.dosage || '');
    const token = localStorage.getItem('token');
    console.log(medication);
    const baseURL = CONFIG.API_URL;
    useEffect(() => {
        if (medication) {
            setMedicationName(medication.name || '');
            setHourInterval(medication.hourInterval || '');
            setNumberTimes(medication.numberTimes || '');
            setDosage(medication.dosage || '');
        }
    }, [medication]);

    function handleClose() {
        setShowModal(false);
    }

    const handleSave = () => {
        if (addMedication) {
            const addMedication = async () => {
                try {
                    const response = await axios.post(`${baseURL}/patients/${patient.id}/medications`, {
                        "name": medicationName,
                        "hourInterval": hourInterval,
                        "numberTimes": numberTimes,
                        "dosage": dosage,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log('Medication added:', response.data);
                    handleClose();
                } catch (err) {
                    console.error('Error adding medication:', err);
                }
            };
            if (medicationName != "" && hourInterval != "" && numberTimes != "" && dosage != "") {
                if (token) {
                    addMedication();
                } else {
                    console.error('Not authenticated');
                }
            }
            else {
                console.error('Missing medication information');
            }
        }
        else {
            const editMedication = async () => {
                try {
                    const response = await axios.put(`${baseUrl}/patients/${patient.id}/medications/${medication.id}`, {
                        "name": medicationName,
                        "hourInterval": hourInterval,
                        "numberTimes": numberTimes,
                        "dosage": dosage,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log('Medication edited:', response.data);
                    handleClose();
                } catch (err) {
                    console.error('Error editing medication:', err);
                }
            }
            setMedicationName(medicationName != "" ? medicationName : medication.name);
            setHourInterval(hourInterval != "" ? hourInterval : medication.hourInterval);
            setNumberTimes(numberTimes != "" ? numberTimes : medication.numberTimes);
            setDosage(dosage != "" ? dosage : medication.dosage);
            if (token) {
                editMedication();
            }
            else {
                console.error('Not authenticated');
            }
        }
        // Handle saving the medication information here
        console.log('Medication:', medicationName, hourInterval, numberTimes, dosage);
      };

    return (
        <>
            <Modal show={showModal} onHide={handleClose} className="update-medication" centered>
                <Modal.Title className="custom-modal-title">
                    {addMedication ? 'Add' : 'Edit'} Medication Information
                </Modal.Title>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="medicationName">
                            <Form.Label>Insert the name of the medication</Form.Label>
                            <Form.Control
                            type="text"
                            placeholder="Enter medication name"
                            value={medicationName}
                            onChange={(e) => setMedicationName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="hourInterval">
                            <Form.Label>Insert the time interval in hours between administrations for this medication</Form.Label>
                            <Form.Control
                            type="number"
                            placeholder="Enter time interval"
                            value={hourInterval}
                            onChange={(e) => {if(Number.isInteger(Number(e.target.value)) && Number(e.target.value) >= 0) {setHourInterval(e.target.value)}}}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="numberTimes">
                            <Form.Label>Specify the total number of administrations for this medication</Form.Label>
                            <Form.Control
                            type="number"
                            placeholder="Enter number of administrations"
                            value={numberTimes}
                            onChange={(e) => {if(Number.isInteger(Number(e.target.value)) && Number(e.target.value) >= 0) {setNumberTimes(e.target.value)}}}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="dosage">
                            <Form.Label>Insert the dosage of the medication</Form.Label>
                            <Form.Control
                            type="text"
                            placeholder="Enter dosage"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                            />
                        </Form.Group>
                    </Form> 

                </Modal.Body>
                <Modal.Footer className="custom-modal-footer">
                    <div className="button-container">
                        <Button variant="secondary" className="cancel-button" onClick={handleClose}>
                            No, cancel
                        </Button>
                        <Button variant="primary" className="confirm-button" onClick={handleSave}>
                            Yes, confirm
                        </Button>
                    </div>
                </Modal.Footer>

            </Modal>
        </>
    );
}
