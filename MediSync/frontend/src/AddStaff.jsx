import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddStaff.css";

const nurses = [
  { value: "nurse1", label: "Nurse A" },
  { value: "nurse2", label: "Nurse B" },
  { value: "nurse3", label: "Nurse C" },
];

const rooms = [
  { value: "room1", label: "Room 1" },
  { value: "room2", label: "Room 2" },
  { value: "room3", label: "Room 3" },
];

const existingAssignments = [
  {
    nurse: "Nurse A",
    room: "Room 1",
    startDate: new Date("2024-11-26T08:00:00Z"),
    endDate: new Date("2024-12-02T08:00:00Z"),
  },
  {
    nurse: "Nurse B",
    room: "Room 2",
    startDate: new Date("2024-11-27T08:00:00Z"),
    endDate: new Date("2024-12-01T08:00:00Z"),
  },
  {
    nurse: "Nurse C",
    room: "Room 3",
    startDate: new Date("2024-11-29T08:00:00Z"),
    endDate: new Date("2024-12-03T08:00:00Z"),
  },
];

export default function AddStaff({ showModal, setShowModal }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [roomAssignments, setRoomAssignments] = useState({});

  const handleClose = () => setShowModal(false);

  const handleSave = () => {
    console.log("Staff added!");
    handleClose();
  };

  useEffect(() => {
    const updatedAssignments = {};
    selectedRooms.forEach((room) => {
      const conflicts = existingAssignments.filter(
        (assignment) =>
          assignment.room === room.label &&
          ((startDate >= assignment.startDate && startDate <= assignment.endDate) ||
            (endDate >= assignment.startDate && endDate <= assignment.endDate) ||
            (startDate <= assignment.startDate && endDate >= assignment.endDate))
      );
      updatedAssignments[room.value] = conflicts;
    });
    setRoomAssignments(updatedAssignments);
  }, [selectedRooms, startDate, endDate]);

  return (
    <Modal show={showModal} onHide={handleClose} centered className="add-staff-modal">
      <Modal.Body>
        <h1 className="modal-title">Add Staff</h1>
        <div className="modal-content-grid">
          <Row>
            <Col xs={12} md={6} className="left-column">
              <Row className="form-row">
                <Col>
                  <label>Staff</label>
                  <Select
                    options={nurses}
                    value={selectedNurse}
                    onChange={setSelectedNurse}
                    placeholder="Select Nurse"
                  />
                </Col>
              </Row>
              <Row className="form-row">
                <Col>
                  <label>Rooms</label>
                  <Select
                    options={rooms}
                    value={selectedRooms}
                    onChange={setSelectedRooms}
                    isMulti
                    placeholder="Select Rooms"
                  />
                </Col>
              </Row>
              <Row className="form-row">
                <Col>
                  <label>Duration</label>
                  <div className="duration-fields">
                    <div className="duration-field">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd'T'HH:mm:ssXXX"
                        placeholderText="Start"
                        className="duration-picker"
                      />
                    </div>
                    <div className="until-label">until</div>
                    <div className="duration-field">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd'T'HH:mm:ssXXX"
                        placeholderText="End"
                        className="duration-picker"
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={6} className="right-column d-flex flex-column">
              <h5 className="staff-group-title">Room Assignments</h5>
              <ul className="staff-list">
                {selectedRooms.map((room) => {
                  const conflicts = roomAssignments[room.value] || [];
                  return (
                    <li key={room.value}>
                      <strong>{room.label}</strong>
                      <ul>
                        {conflicts.length > 0 ? (
                          conflicts.map((conflict, idx) => (
                            <li key={idx}>
                              <span>{conflict.nurse}</span> ({conflict.startDate.toISOString()} -{" "}
                              {conflict.endDate.toISOString()})
                            </li>
                          ))
                        ) : (
                          <li>No conflicts</li>
                        )}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </Col>
          </Row>
        </div>
        <div className="footer-container">
          <div className="footer-buttons">
            <Button variant="secondary" className="cancel-button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" className="confirm-button" onClick={handleSave}>
              Add Staff
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
