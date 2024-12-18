import { useState, useEffect } from 'react';
import axios from 'axios';
import CONFIG from './config';

function NotificationFetcher({ userId, token, interval = 30000, onUpdateNotificationCount}) {
  const [notifications, setNotifications] = useState([]);
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
          setNotifications(response.data);
          setError(null);
          console.log('Notifications fetched:', response.data); 
        }
        if (onUpdateNotificationCount) {
            onUpdateNotificationCount(response.data.length);
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
  }, [userId, token, interval]);
  

}

export default NotificationFetcher;
