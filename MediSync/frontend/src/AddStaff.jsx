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
    console.log(nurses);
    fetchData("/hospital/rooms", setRooms, "Failed to fetch rooms");
  }, []);

  const fetchData = async (endpoint, setState, errorMsg) => {
    try {
      const response = await fetch(baseUrl + endpoint, {
        method: "GET",
        headers: { Authorization: bearerToken },
      });

      if (!response.ok) throw new Error(errorMsg);

      const data = await response.json();

      if (endpoint === "/nurses") {

 
        const updatedNurses = await Promise.all(
          data.map(async (nurse) => {
            if (nurse.schedule) {
              const updatedSchedule = await Promise.all(
                nurse.schedule.map(async (schedule) => {
                  const updatedRooms = await Promise.all(
                    schedule.room.map(async (room) => {
                      if (typeof room === "number") {
                        const roomResponse = await fetch(
                          `${baseUrl}/hospital/rooms/${room}`,
                          {
                            method: "GET",
                            headers: { Authorization: bearerToken },
                          }
                        );
                        if (!roomResponse.ok) {
                          console.error(
                            `Failed to fetch details for room ID ${room}`
                          );
                          return { id: room, roomNumber: `Unknown (${room})` };
                        }
                        const roomData = await roomResponse.json();
                        return {
                          id: roomData.id,
                          roomNumber: roomData.roomNumber,
                        };
                      }
                      return room; // Return room as is if already complete
                    })
                  );
                  return { ...schedule, room: updatedRooms };
                })
              );
              return { ...nurse, schedule: updatedSchedule };
            }
            return nurse;
          })
        );

        setState(updatedNurses);
      } else if (endpoint === "/hospital/rooms") {
        setState(data.map((room) => ({ value: room.id, label: `Room ${room.roomNumber}` })));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedNurse) {
      const updatedAssignments = {};

      rooms.forEach((room) => {
        const conflicts = nurses.flatMap((nurse) =>
          (nurse.schedule || []).filter((schedule) =>
            schedule.room.some((r) => r.id === room.value) &&
            ((new Date(startDate) >= new Date(schedule.start_time) &&
              new Date(startDate) <= new Date(schedule.end_time)) ||
              (new Date(endDate) >= new Date(schedule.start_time) &&
                new Date(endDate) <= new Date(schedule.end_time)) ||
              (new Date(startDate) <= new Date(schedule.start_time) &&
                new Date(endDate) >= new Date(schedule.end_time)))
          ).map((conflict) => ({
            ...conflict,
            nurse: { name: nurse.name },
            isConflict: nurse.id === selectedNurse.id,
          }))
        );

        if (conflicts.length > 0 || selectedRooms.some((r) => r.value === room.value)) {
          updatedAssignments[room.value] = conflicts;
        }
      });

      setRoomAssignments(updatedAssignments);
    }
  }, [rooms, selectedRooms, startDate, endDate, selectedNurse, nurses]);

  const handleSave = () => {
    if (selectedNurse && selectedRooms.length && startDate && endDate) {
      const payload = {
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        isInterval: false,
        room: selectedRooms.map((room) => ({ id: room.value })),
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

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-US", {
      weekday: "short", // 'Mon'
      year: "numeric", // '2024'
      month: "short", // 'Dec'
      day: "numeric", // '2'
      hour: "numeric", // '3'
      minute: "numeric", // '15'
      hour12: true, // 'PM'
    });
  };

  const formatInputDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

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
                        customInput={<input value={formatInputDate(startDate)} />}
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
                        customInput={<input value={formatInputDate(endDate)} />}
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
                            <li
                              key={idx}
                              className={conflict.isConflict ? "conflict" : ""}
                            >
                              <span>{conflict.nurse.name}</span> (
                              {formatDate(conflict.start_time)} -{" "}
                              {formatDate(conflict.end_time)})
                            </li>
                          ))
                        ) : (
                          <li>No Assignment</li>
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
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={Object.values(roomAssignments).some((conflicts) =>
                conflicts.some((conflict) => conflict.isConflict)
              )}
            >
              {Object.values(roomAssignments).some((conflicts) =>
                conflicts.some((conflict) => conflict.isConflict)
              )
                ? "Solve Schedule Conflict"
                : "Add Staff"}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
