import { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreatePatient.css';

export default function CreatePatient({ showModal, setShowModal, availableBeds=[{id: 1, name: "Room 1"}], availableDoctors=[{id: 1, name: "Doctor Ricardo"}] }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        weight: '',
        height: '',
        observations: '',
        conditions: '',
        bed: '',
        doctor: ''
    });

    const token = localStorage.getItem('token');

    function handleClose() {
        setShowModal(false);
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

   
    const handleSave = () => {
        if (!formData.firstName || !formData.lastName || !formData.height || !formData.weight || !formData.observations || !formData.room || !formData.doctor) {
            alert('Please fill all fields');
            return;
        }
        const name = `${formData.firstName} ${formData.lastName}`;
        const gender = `${formData.gender}`;
        const birthDate = `${formData.birthDate}`;
        const weight = `${formData.weight}`;
        const height = `${formData.height}`;
        const observations = `${formData.observations}`.split('\n');
        const conditions = `${formData.conditions}`.split('\n');
        const jsonBody = {
            name,
            gender,
            birthDate,
            weight,
            height,
            observations,
            conditions,
        };
        const postData = () => {
            fetch('/api/v1/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jsonBody),
            }).then(response => {
                if (response.ok) {
                    alert('Patient added successfully');
                } else {
                    alert('Failed to add patient');
                }
            });
        };
        postData();
        handleClose();
    };
  

    const availableRoomsOptions = availableRooms.map(room => (
        <option key={room.id} value={room.id}>{room.name}</option>
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
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Bed</Form.Label>
                                        <Form.Select
                                            name="bed"
                                            value={formData.bed}
                                            onChange={handleChange}
                                        >
                                            {availableBedsOptions}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Doctor</Form.Label>
                                        <Form.Select
                                            name="doctor"
                                            value={formData.doctor}
                                            onChange={handleChange}
                                        >
                                            {availableDoctorsOptions}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                            <Col md={6}>
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
