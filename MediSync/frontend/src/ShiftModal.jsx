import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ShiftModal.css";

export default function ShiftModal({ showModal, setShowModal, nurses=[{id: 1, name: "Nurse Ricardo"}], rooms=[{id: 1, name: "Room 1"}] }) {
    const [formData, setFormData] = useState({
        nurseIds: [],     // Allow multiple nurse selections
        rooms: [],        // Allow multiple room selections
        startTime: "",    // Start time field (includes date)
        endTime: "",      // End time field (includes date)
    });

    const handleClose = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "nurseIds" || name === "rooms") {
            // Handle multiple selections for nurses and rooms
            const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
            setFormData({ ...formData, [name]: selectedOptions });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare shift data for submission
        const shiftData = {
            nurseIds: formData.nurseIds,
            rooms: formData.rooms,
            startTime: formData.startTime,
            endTime: formData.endTime,
        };

        console.log("Shift Data Submitted:", shiftData);

        // Add API submission logic here if needed
        handleClose();
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered className="shift-modal">
            <Modal.Header closeButton>
                <Modal.Title>Create Nurse Shift</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Nurse Selection */}
                    <Row>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Nurses</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="nurseIds"
                                    multiple
                                    value={formData.nurseIds}
                                    onChange={handleChange}
                                >
                                    {nurses.map((nurse) => (
                                        <option key={nurse.id} value={nurse.id}>
                                            {nurse.name}
                                        </option>
                                    ))}
                                </Form.Control>
                                <small className="text-muted">
                                    Hold Ctrl (or Cmd) to select multiple nurses
                                </small>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Room Selection */}
                    <Row>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Room(s)</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="rooms"
                                    multiple
                                    value={formData.rooms}
                                    onChange={handleChange}
                                >
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.name}
                                        </option>
                                    ))}
                                </Form.Control>
                                <small className="text-muted">
                                    Hold Ctrl (or Cmd) to select multiple rooms
                                </small>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Start and End Time */}
                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>End Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Buttons */}
                    <Row className="button-row">
                        <Col className="d-flex justify-content-between">
                            <Button
                                variant="secondary"
                                onClick={handleClose}
                                className="cancel-button"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="add-button">
                                Create Shift
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
