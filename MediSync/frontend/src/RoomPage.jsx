import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RoomPage.css";

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [scheduledRooms, setScheduledRooms] = useState([]);
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const nurseId = user ? JSON.parse(user).id : null;

  // Create an Axios instance with defaults
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!nurseId) {
      console.error("Nurse ID not found! Ensure localStorage is correctly set.");
      return;
    }

    // Fetch nurse's schedule
    axiosInstance
      .get(`/nurses/${nurseId}/schedule`)
      .then((response) => {
        const schedules = response.data;
        console.log("Fetched schedules:", schedules);

        const currentDateTime = new Date();
        const currentSchedule = schedules.find((schedule) => {
          const startTime = new Date(schedule.start_time);
          const endTime = new Date(schedule.end_time);
          return currentDateTime >= startTime && currentDateTime <= endTime;
        });

        if (currentSchedule) {
          console.log("Current schedule:", currentSchedule);
          setScheduledRooms(currentSchedule.roomsNumbers);
        } else {
          console.warn("No active schedule found.");
          setScheduledRooms([]);
        }
      })
      .catch((error) =>
        console.error("Error fetching schedule:", error.response || error)
      );

    // Fetch room details
    axiosInstance
      .get(`/nurses/${nurseId}/patients-by-room-with-beds`)
      .then((response) => {
        console.log("Fetched room data:", response.data);
        setRooms(response.data);
      })
      .catch((error) =>
        console.error("Error fetching room data:", error.response || error)
      );
  }, [nurseId]);

  if (!nurseId) {
    return <div>Error: Nurse ID is not available.</div>;
  }

  // Filter rooms based on the schedule
  const filteredRooms = rooms.filter((room) =>
    scheduledRooms.includes(room.roomNumber)
  );

  return (
    <div className="room-container">
      <h1>Assigned Rooms:</h1>
      {filteredRooms.length > 0 ? (
        <div className="room-grid">
          {filteredRooms.map((room) => (
            <div key={room.roomId} className="room">
              <h2>Room {room.roomNumber}</h2>
              <div className="beds">
                {[...Array(4)].map((_, index) => {
                    const bed = room.beds[index]; // Access bed by index
                    return (
                    <div
                        key={index}
                        className={`bed ${
                        bed && bed.patient ? "occupied" : "empty"
                        }`}
                    >
                        {bed && bed.patient ? (
                        <>
                            <h3>{bed.patient.patient.name}</h3>
                            <div className="vitals">
                            <p>
                                <span className="icon">💓</span>
                                {bed.patient.vitals.heartRate} bpm
                            </p>
                            </div>
                        </>
                        ) : (
                        <p>No patient</p>
                        )}
                    </div>
                    );
                })}
                </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No rooms assigned for the current schedule.</p>
      )}
    </div>
  );
};

export default RoomPage;
