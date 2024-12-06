import { useState, useEffect } from 'react';
import axios from 'axios';
import CONFIG from './config';
import './NotificationFetcher.css'; // Import CSS for styling

function NotificationFetcher({ userId, token, interval = 30000, onUpdateNotificationCount }) {
  const [notifications, setNotifications] = useState([]);
  const [prevNotificationCount, setPrevNotificationCount] = useState(0); // Track previous count
  const [showPopup, setShowPopup] = useState(false); // Control pop-up visibility
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('userId:', userId, 'token:', token);
    let isMounted = true;

    const fetchNotifications = async () => {
      if (!userId || !token) return;
      console.log('Fetching notifications...');
      const axiosInstance = axios.create({
        baseURL: `${CONFIG.API_URL}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        const response = await axiosInstance.get(`notifications/user/${userId}`);
        if (isMounted) {
          const newNotifications = response.data;

          // Check for changes in notification count
          if (newNotifications.length > notifications.length) {
            setShowPopup(true); // Show pop-up when a new notification is received
            setTimeout(() => setShowPopup(false), 5000); // Auto-hide after 5 seconds
          }

          setNotifications(newNotifications);
          setPrevNotificationCount(notifications.length); // Update previous count
          setError(null);
          console.log('Notifications fetched:', newNotifications);

          if (onUpdateNotificationCount) {
            onUpdateNotificationCount(newNotifications.length);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching notifications:', err);
          setError('Failed to fetch notifications.');
        }
      }
    };

    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, interval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [userId, token, interval, notifications.length]); // Depend on notifications.length to detect changes

  return (
    <>
      {showPopup && (
        <div className="notification-popup">
          You received a new notification!
        </div>
      )}
    </>
  );
}

export default NotificationFetcher;
