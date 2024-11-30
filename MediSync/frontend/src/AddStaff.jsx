import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for the date picker
import "./AddStaff.css";

export default function AddStaff({ showModal, setShowModal }) {
  const handleClose = () => setShowModal(false);
  const handleSave = () => {
    console.log("Staff added!");
    handleClose();
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      centered
      className="add-staff-modal"
    >
      <Modal.Body>
        <h1 className="modal-title">Add Staff</h1>
        <div className="modal-content-grid">
          <Row>
            {/* Left Column */}
            <Col xs={12} md={6} className="left-column">
              {/* Staff and Room Row */}
              <Row className="form-row">
                <Col>
                  <div className="form-group">
                    <label>Staff</label>
                    <input type="text" placeholder="Doctor/Nurse" className="form-control" />
                  </div>
                </Col>
                <Col>
                  <div className="form-group">
                    <label>Room</label>
                    <input type="text" placeholder="Enter room" className="form-control" />
                  </div>
                </Col>
              </Row>

              {/* Duration Row */}
              <Row className="form-row">
                <Col>
                  <label>Duration</label>
                  <div className="duration-fields">
                    <div className="duration-field">
                      <DatePicker
                        selected={null} // Replace with selected date state
                        onChange={() => {}} // Implement date change handling here
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Start"
                        className="duration-picker"
                      />
                    </div>
                    <div className="until-label">until</div>
                    <div className="duration-field">
                      <DatePicker
                        selected={null} // Bind to state
                        onChange={() => {}} // Implement date change handling here
                        dateFormat="dd/MM/yyyy"
                        placeholderText="End"
                        className="duration-picker"
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Add to Group Button */}
              <Row>
                <Col className="add-to-group-button-col">
                  <Button className="add-to-group-button">Add to group</Button>
                </Col>
              </Row>
            </Col>

            {/* Right Column */}
            <Col xs={12} md={6} className="right-column">
              <h5 className="staff-group-title">Staff Group</h5>
              <ul className="staff-list">
                <li>Doctor - Nadia Smith - 26/11/2024-02/12/2024</li>
                <li>Nurse - Pedro Smith - 26/11/2024-01/12/2024</li>
                <li>Nurse - John Grandson - 29/11/2024-02/12/2024</li>
              </ul>
            </Col>
          </Row>

          {/* Footer Buttons */}
          <div className="footer-buttons">
            <Button
              variant="secondary"
              className="cancel-button"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="confirm-button"
              onClick={handleSave}
            >
              Add Staff
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
