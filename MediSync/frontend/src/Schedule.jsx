import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Schedule.css";
import CONFIG from "./config";

const Schedule = () => {
  const [scheduleEntries, setScheduleEntries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nurseId = JSON.parse(localStorage.getItem('user')).id;
  const token = localStorage.getItem('token');

  const hours = Array.from({ length: 24 }, (_, i) => (9 + i) % 24); // From 9 AM to 8 AM next day

  const baseUrl = CONFIG.API_URL;

  // Update days whenever currentDate changes
  useEffect(() => {
    const updatedDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i); // Generate next 7 days
      return date;
    });
    setDays(updatedDays);
  }, [currentDate]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`${baseUrl}/nurses/${nurseId}/schedule`, {
          headers: {
            'Authorization': `Bearer ${token}`  // Attach token to request
          }
        });
        console.log(response.data);
        setScheduleEntries(response.data);
      } catch (err) {
        setError("Failed to load schedule.");
      } finally {
        setLoading(false);
      }
    };
    console.log("Nurse ID:", nurseId);
    if (nurseId) {
      fetchSchedule();
    } else {
      setError("Nurse ID is missing.");
      setLoading(false);
    }
  }, [nurseId, baseUrl, token]);

  const handleDayChange = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + direction);
      return newDate;
    });
  };

  const handleWeekChange = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 7 * direction); // Go 7 days forward or backward
      return newDate;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!Array.isArray(scheduleEntries) || scheduleEntries.length === 0) {
    return <div>No schedule entries available.</div>;
  }

  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  return (
    <div className="schedule-container">
      {/* Month Navigation */}
      <div class="navigation-container">
        <div class="week-navigation">
          <button class="nav-button" onClick={() => handleWeekChange(-1)}>← Previous Week</button>
          <span>
            Week of {currentDate.toLocaleDateString("default", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <button class="nav-button" onClick={() => handleWeekChange(1)}>Next Week →</button>
        </div>
        <div class="day-navigation">
          <button class="nav-button" onClick={() => handleDayChange(-1)}>Previous Day</button>
          <button class="nav-button" onClick={() => handleDayChange(1)}>Next Day</button>
        </div>
      </div>
      {/* Schedule Grid */}
      <div className="schedule-grid scrollable">
        {/* Time Column */}
        <div className="time-slot"></div>
        {days.map((day) => (
          <div key={day.toDateString()} className="day-header">
            {day.toLocaleDateString("en", { weekday: "short", day: "numeric" })}
          </div>
        ))}
        
        {/* Time Slots */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="time-slot">
              {hour}:00
            </div>
            {days.map((day) => {
  const filteredEntries = scheduleEntries.filter(
    (entry) =>
      new Date(entry.start_time).toDateString() === day.toDateString()
  );

  return (
    <div key={`${day}-${hour}`} className="day-column">
      {filteredEntries
        .filter((entry) => {
          const startHour = new Date(entry.start_time).getHours();
          return startHour === hour || (hour >= startHour && hour < new Date(entry.end_time).getHours());
        })
        .map((entry) => {
          const startTime = new Date(entry.start_time);
          const endTime = new Date(entry.end_time);

          // Calculate start and end rows (adjust for grid starting at 9 AM)
          const startGrid = startTime.getHours() - 9 + 1;
          const endGrid = endTime.getHours() - 9 + 1;

          return (
            <div
              key={entry.id}
              className="schedule-entry"
              style={{
                gridRow: `${startGrid} / ${endGrid}`,
                backgroundColor: entry.interval ? "#E6FEFF" : "#E9EFFF",
                color: entry.interval ? "#24B0C9" : "#5272E9",
              }}
            >
              {entry.interval ? (
                "Interval"
              ) : (
                `Room ${entry.roomsNumbers.map(String).join(" ")}`
              )}
            </div>
          );
        })}
    </div>
  );
})}

          </React.Fragment>
        ))}
      </div>
    </div>


  );
};

export default Schedule;