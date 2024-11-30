import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import Select from "react-select"; // Import react-select
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker CSS
import "./AddStaff.css";

// Sample nurses and rooms data
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
  { nurse: "Nurse A", room: "Room 1", startDate: new Date("2024-11-26"), endDate: new Date("2024-12-02") },
  { nurse: "Nurse B", room: "Room 2", startDate: new Date("2024-11-27"), endDate: new Date("2024-12-01") },
  { nurse: "Nurse C", room: "Room 3", startDate: new Date("2024-11-29"), endDate: new Date("2024-12-03") },
];

export default function AddStaff({ showModal, setShowModal }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [roomAssignments, setRoomAssignments] = useState({});

  // Handle modal close
  const handleClose = () => setShowModal(false);

  // Handle save action
  const handleSave = () => {
    console.log("Staff added!");
    handleClose();
  };

  // Handle adding to group (can be used for any custom functionality)
  const handleAddToGroup = () => {
    console.log("Added to group!");
    // Implement your logic for adding the staff to a group
  };

  // Check room assignments for conflicts
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
            {/* Left Column */}
            <Col xs={12} md={6} className="left-column">
              {/* Staff Dropdown */}
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

              {/* Room Selection Dropdown */}
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

              {/* Duration Row */}
              <Row className="form-row">
                <Col>
                  <label>Duration</label>
                  <div className="duration-fields">
                    <div className="duration-field">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        maxDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Start"
                        className="duration-picker"
                      />
                    </div>
                    <div className="until-label">until</div>
                    <div className="duration-field">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        minDate={startDate}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="End"
                        className="duration-picker"
                      />
                    </div>
                  </div>
                </Col>
                {/* Add to Group Button */}
                <Col xs="auto">
                  <Button className="add-to-group-button" onClick={handleAddToGroup}>
                    Add to Group
                  </Button>
                </Col>
              </Row>
            </Col>

            {/* Right Column (Room Assignment Info) */}
            <Col xs={12} md={6} className="right-column">
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
                              <span>{conflict.nurse}</span> ({conflict.startDate.toLocaleDateString()} - {conflict.endDate.toLocaleDateString()})
                            </li>
                          ))
                        ) : (
                          <li>No staff assigned</li>
                        )}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </Col>
          </Row>
        </div>

        {/* Footer Buttons */}
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
