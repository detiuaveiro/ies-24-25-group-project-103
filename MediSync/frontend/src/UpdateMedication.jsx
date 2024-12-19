import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UpdateMedication.css';
import CONFIG from './config';

export default function UpdateMedication({ showModal, setShowModal, patient, medication=null, updateMedication }) {
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
            setDosage(medication.dosage || '');
        }
    }, [medication]);

    function handleClose() {
        setShowModal(false);
    }

    const handleSave = async () => {
        try {
          let response;
          if (addMedication) {
            response = await axios.post(
              `${baseURL}/patients/${patient.id}/medications`,
              {
                name: medicationName,
                hourInterval,
                dosage,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else {
            response = await axios.put(
              `${baseURL}/patients/${patient.id}/medications/${medication.id}`,
              {
                name: medicationName,
                hourInterval,
                numberTimes,
                dosage,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
      
          console.log('Medication saved:', response.data);
          updateMedication(response.data); // Pass the updated/added medication back to the parent
          handleClose();
        } catch (err) {
          console.error('Error saving medication:', err);
        }
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