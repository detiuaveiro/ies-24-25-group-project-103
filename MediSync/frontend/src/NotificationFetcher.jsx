import { useState, useEffect } from 'react';
import axios from 'axios';
import CONFIG from './config';

function NotificationFetcher({ userId, token, interval = 5000 }) {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    let isMounted = true; //
    const fetchNotifications = async () => {
      if (!userId || !token) return;

      const axiosInstance = axios.create({
        baseURL: `${CONFIG.API_URL}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        const response = await axiosInstance.get(`/notifications/${userId}`);
        if (isMounted) {
          setNotifications(response.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching notifications:', err);
          setError('Failed to fetch notifications.');
        }
      }
    };

    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 50000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [userId, token, interval]);

  return (
    <div className="notification-fetcher">
      {error && <p className="error-message">{error}</p>}
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <strong>{notification.title}:</strong> {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationFetcher;
