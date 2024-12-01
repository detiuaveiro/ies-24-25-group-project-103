import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddStaff.css";
import CONFIG from "./config";

export default function AddStaff({ showModal, setShowModal }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [roomAssignments, setRoomAssignments] = useState({});
  const [nurses, setNurses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const baseUrl = CONFIG.API_URL;
  const bearerToken = "Bearer " + localStorage.getItem("token");

  useEffect(() => {
    fetchData("/nurses", setNurses, "Failed to fetch nurses");
    fetchData("/hospital/rooms", setRooms, "Failed to fetch rooms");
  }, []);

  const fetchData = (endpoint, setState, errorMsg) => {
    fetch(baseUrl + endpoint, {
      method: "GET",
      headers: { Authorization: bearerToken },
    })
      .then((response) => {
        if (!response.ok) throw new Error(errorMsg);
        return response.json();
      })
      .then((data) => {
        if (endpoint === "/nurses") {
          setState(data);
        } else if (endpoint === "/hospital/rooms") {
          setState(data.map((room) => ({ value: room.id, label: `Room ${room.roomNumber}` })));
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (selectedNurse) {
      const updatedAssignments = {};

      // Check all rooms for conflicts with the selected nurse's schedule
      rooms.forEach((room) => {
        const conflicts = (selectedNurse.schedule || []).filter(
          (schedule) =>
            schedule.room.some((r) => r.id === room.value) &&
            ((new Date(startDate) >= new Date(schedule.start_time) &&
              new Date(startDate) <= new Date(schedule.end_time)) ||
              (new Date(endDate) >= new Date(schedule.start_time) &&
                new Date(endDate) <= new Date(schedule.end_time)) ||
              (new Date(startDate) <= new Date(schedule.start_time) &&
                new Date(endDate) >= new Date(schedule.end_time)))
        ).map((conflict) => ({
          ...conflict,
          nurse: conflict.nurse || { name: selectedNurse.name },
          isConflict: true, // Mark as a conflict
        }));

        if (conflicts.length > 0 || selectedRooms.some((r) => r.value === room.value)) {
          updatedAssignments[room.value] = conflicts;
        }
      });

      setRoomAssignments(updatedAssignments);
    }
  }, [rooms, selectedRooms, startDate, endDate, selectedNurse]);

  const handleSave = () => {
    if (selectedNurse && selectedRooms.length && startDate && endDate) {
      const payload = {
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        rooms: selectedRooms.map((room) => ({ id: room.value })),
      };

      fetch(`${baseUrl}/nurses/${selectedNurse.id}/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: bearerToken,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to save schedule");
          return response.json();
        })
        .then(() => {
          console.log("Schedule saved successfully!");
          setShowModal(false);
        })
        .catch((error) => console.error(error));
    } else {
      console.error("Please fill in all fields before saving.");
    }
  };

  const handleClose = () => setShowModal(false);

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
                    options={nurses.map((nurse) => ({
                      value: nurse,
                      label: nurse.name,
                    }))}
                    value={selectedNurse ? { value: selectedNurse, label: selectedNurse.name } : null}
                    onChange={(option) => setSelectedNurse(option?.value || null)}
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
                {Object.entries(roomAssignments).map(([roomId, conflicts]) => {
                  const room = rooms.find((r) => r.value === parseInt(roomId));
                  return (
                    <li key={roomId}>
                      <strong>{room?.label || `Room ${roomId}`}</strong>
                      <ul>
                        {conflicts.length > 0 ? (
                          conflicts.map((conflict, idx) => (
                            <li
                              key={idx}
                              className={conflict.isConflict ? "conflict" : ""}
                            >
                              <span>{conflict.nurse.name}</span> (
                              {conflict.start_time} - {conflict.end_time})
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
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Add Staff
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
