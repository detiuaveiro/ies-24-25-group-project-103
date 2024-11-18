import { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreatePatient.css';

export default function CreatePatient({ showModal, setShowModal }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        weight: '',
        height: '',
        observations: '',
        room: '',
        doctor: '',
        contagious: false,
    });

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
        console.log('Saving form data:', formData);
        handleClose();
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered className="create-patient">
            <Modal.Header>
                <Modal.Title>Add Patient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={6}>
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
                        <Col md={6}>
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
                                    <option value="">Male/Female</option>
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
                            <Form.Group>
                                <Form.Label>Observations</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Observations"
                                    rows={16}
                                    name="observations"
                                    value={formData.observations}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Room</Form.Label>
                                        <Form.Select
                                            name="room"
                                            value={formData.room}
                                            onChange={handleChange}
                                        >
                                            <option value="">Room</option>
                                            <option value="room1">Room 1</option>
                                            <option value="room2">Room 2</option>
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
                                            <option value="">Doctor</option>
                                            <option value="doctor1">Dr. Smith</option>
                                            <option value="doctor2">Dr. Brown</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mt-3 d-flex align-items-center">
                                        <Form.Check
                                            type="checkbox"
                                            label="Patient has a contagious disease."
                                            name="contagious"
                                            checked={formData.contagious}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Button className="cancel" onClick={handleClose}>
                                        Cancel
                                    </Button>
                                </Col>
                                <Col md={6}>
                                    <Button className="add" onClick={handleSave}>
                                        Add Patient
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
