import { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreatePatient.css';
import CONFIG from './config';

export default function CreatePatient({ showModal, setShowModal, availableBeds=[{id: 1, name: "Room 1"}], availableDoctors=[{id: 1, name: "Doctor Ricardo"}] }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        birthDate: '',
        weight: '',
        height: '',
        observations: '',
        conditions: '',
        bed: '',
        doctor: '',
        contagious: false
    });

    const token = localStorage.getItem('token');
    const baseUrl = CONFIG.API_URL;

    function handleClose() {
        setFormData({
            firstName: '',
            lastName: '',
            gender: '',
            birthDate: '',
            weight: '',
            height: '',
            observations: '',
            conditions: '',
            bed: '',
            doctor: '',
            contagious: false
        });
        setShowModal(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates = {
                ...prev,
                [name]: value
            };
            
            // reset bed selection when contagious status changes
            if (name === 'contagious') {
                updates.bed = '';
            }
            
            return updates;
        });
    };

    const handleSave = () => {
        if (!formData.firstName || !formData.lastName || !formData.height || 
            !formData.weight || !formData.observations || !formData.bed || 
            !formData.doctor) {
            alert('Please fill all fields');
            return;
        }
    
        const jsonBody = {
            name: `${formData.firstName} ${formData.lastName}`,
            gender: formData.gender.toUpperCase(),
            birthDate: formData.birthDate,
            weight: Number(formData.weight),
            height: Number(formData.height),
            observations: formData.observations.split('\n'),
            conditions: formData.conditions.split('\n'),
            contagious: formData.contagious
        };
    
        let createdPatient;
    
        fetch(`${baseUrl}/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(jsonBody),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Failed to create patient: ${text}`);
                });
            }
            return response.json();
        })
        .then(patient => {
            console.log('Patient created:', patient);
            createdPatient = patient;
            
            const selectedBed = availableBeds.find(bed => bed.id.toString() === formData.bed);
            return fetch(`${baseUrl}/patients/${patient.id}/bed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(selectedBed)
            });
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Failed to assign bed: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Bed assigned:', data);
            
            const selectedDoctor = availableDoctors.find(doc => doc.id.toString() === formData.doctor);
            return fetch(`${baseUrl}/patients/${createdPatient.id}/doctor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(selectedDoctor)
            });
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Failed to assign doctor: ${text}`);
                });
            }
            alert('Patient added successfully');
            handleClose();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
    };

    const availableBedsOptions = availableBeds
        .filter(bed => {
            const floorNumber = bed.name.split(' / ')[0].split(' ')[1];
            const roomNumber = bed.name.split(' / ')[1].split(' ')[1];
            
            if (formData.contagious) {
                // Only allow floor 3, rooms 7 and 8 for contagious patients
                return floorNumber === '3' && (roomNumber === '7' || roomNumber === '8');
            }
            // For non-contagious patients, exclude floor 3, rooms 7 and 8
            return !(floorNumber === '3' && (roomNumber === '7' || roomNumber === '8'));
        })
        .map(bed => (
            <option key={bed.id} value={bed.id}>{bed.name}</option>
        ));

    const availableDoctorsOptions = availableDoctors.map(doctor => (
        <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
    ));

    return (
        <Modal show={showModal} onHide={handleClose} centered className="create-patient">
            <Modal.Header>
                <Modal.Title>Add Patient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Birth Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Gender</Form.Label>
                                <Form.Select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Weight</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Weight (kg)"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Height</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Height (cm)"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Row>
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>Conditions</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Conditions"
                                            name="conditions"
                                            value={formData.conditions}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={6}>
                            <Row>
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>Observations</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Observations"
                                            name="observations"
                                            value={formData.observations}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Bed</Form.Label>
                                <Form.Select
                                    name="bed"
                                    value={formData.bed}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a bed</option>
                                    {availableBedsOptions}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="contagious-group">
                                <Form.Label></Form.Label>
                                <div className="contagious-checkbox">
                                <Form.Check
                                    type="checkbox"
                                    id="contagious-checkbox"
                                    name="contagious"
                                    checked={formData.contagious}
                                    onChange={(e) => handleChange({
                                        target: {
                                            name: 'contagious',
                                            value: e.target.checked
                                        }
                                    })}
                                    label="Patient is contagious"
                                    className="form-check-sm"
                                />
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Doctor</Form.Label>
                                <Form.Select
                                    name="doctor"
                                    value={formData.doctor}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a doctor</option>
                                    {availableDoctorsOptions}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Button className="cancel" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Col>
                        <Col md={3}>
                            <Button className="add" onClick={handleSave}>
                                Add Patient
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
}