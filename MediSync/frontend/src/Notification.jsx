import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notification.css"; 

import CONFIG from './config';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")); 
  const userId = user ? user.id : null; 
  const token = localStorage.getItem("token"); 
  const baseUrl = CONFIG.API_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/notifications/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, token, baseUrl]);

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${baseUrl}/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError("Failed to delete notification.");
    }
  };

  const clearAllNotifications = async () => {
    try {
      const deleteRequests = notifications.map((notification) =>
        axios.delete(`${baseUrl}/notifications/${notification.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      await Promise.all(deleteRequests); 
      setNotifications([]); 
    } catch (err) {
      console.error("Error clearing notifications:", err);
      setError("Failed to clear notifications.");
    }
  };

  const viewPatient = (patientId) => {
    window.location.href = `/patients/${patientId}`;
  };

  const cleanBed = async (notificationId, bedId) => {
    try {
      await axios.put(
        `${baseUrl}/nurses/clean/${bedId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("The bed has been successfully cleaned!");
      deleteNotification(notificationId);
    } catch (err) {
      console.error("Error cleaning bed:", err);
    }
  }

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="notification-widget-container">
        <h2 className="notification-widget-header">Notifications:</h2>
        {notifications.filter(notification => 
            ["MEDICATION_DUE", "CLEANPREP", "DISCHARGE"].includes(notification.type)
        ).length > 0 ? (
            <>
            <div className="notification-widget-button">
                <button
                    className="notification-widget-clean-all-btn"
                    onClick={clearAllNotifications}
                >
                    Clean All
                </button>
            </div>
            <div className="notification-widget-list">
            {notifications
                .filter(notification => 
                    ["MEDICATION_DUE", "CLEANPREP", "DISCHARGE"].includes(notification.type)
                )
                .map(notification => (
                    <div
                        key={notification.id}
                        className={`notification-widget-card ${
                            notification.type === "CLEANPREP" 
                                ? "cleanprep" 
                                : notification.type === "DISCHARGE" 
                                    ? "discharge" 
                                    : "info"
                        }`}
                    >
                              <div className="notification-widget-header-content">
                                  <h3>
                                      <span>
                                          {notification.type === "CLEANPREP"
                                              ? "🧹"
                                              : notification.type === "DISCHARGE"
                                                  ? "🚪"
                                                  : "ℹ️"}
                                      </span>
                                      {notification.title}
                                  </h3>
                                  <button
                                      className="notification-widget-close-btn" style={{width: "20px", height: "20px"}}
                                      onClick={() => deleteNotification(notification.id)}
                                  >
                                      ✖
                                  </button>
                              </div>

                        <p className="notification-widget-card-description">
                            {notification.description}
                        </p>
                        {notification.patientId && (
                                      <button
                                          className="notification-widget-view-patient-btn"
                                          onClick={() => viewPatient(notification.patientId)}
                                          style={{width: "300px", height: "50px", alignContent: "right", justifyContent: "right", alignItems: "right"}}
                                      >
                                          View Patient
                                      </button>
                                  )}
                        {notification.bedId && (                                     
                            <button
                            className="notification-widget-view-patient-btn"
                            onClick={() => cleanBed(notification.id, notification.bedId)}
                            style={{width: "300px", height: "50px", alignContent: "right", justifyContent: "right", alignItems: "right", color: "white", backgroundColor: "#4CAF50"}}
                        >
                            I've cleaned this bed
                        </button>
                        )}
                    </div>
                ))}
            </div>
            </>
        ) : (
            <p className="notification-widget-error-message">
                No notifications to display.
            </p>
        )}
    </div>
  );
};

export default Notifications;
