package org.ies.deti.ua.medisync.service;

import java.util.Date;
import java.util.List;
import java.util.Optional; // Ensure you have this repository created

import org.ies.deti.ua.medisync.model.Notification;
import org.ies.deti.ua.medisync.model.User;
import org.ies.deti.ua.medisync.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification updateNotification(Long id, Notification updatedNotification) {
        if (notificationRepository.existsById(id)) {
            updatedNotification.setId(id);
            return notificationRepository.save(updatedNotification);
        }
        return null; 
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }
    
    public List<Notification> getNotificationsByType(Notification.Type type) {
        return notificationRepository.findByType(type);
    }


    // Notifications by type
    public Notification createDischargeNotification(Long userId, String roomNumber) {
        Notification notification = new Notification();
        notification.setTitle("Patient Discharge");
        notification.setDescription("Room " + roomNumber + " is ready for cleaning");
        notification.setDate(new Date());
        notification.setType(Notification.Type.DISCHARGE);
        
        User user = new User();
        user.setId(userId);
        notification.setUser(user);
        
        return saveNotification(notification);
    }

    public Notification createCleaningNotification(Long userId, String roomNumber) {
        Notification notification = new Notification();
        notification.setTitle("Room Cleaning Required");
        notification.setDescription("Room " + roomNumber + " needs cleaning");
        notification.setDate(new Date());
        notification.setType(Notification.Type.CLEANING);
        
        User user = new User();
        user.setId(userId);
        notification.setUser(user);
        
        return saveNotification(notification);
    }

    public Notification createDangerVitalsNotification(Long userId, String patientName, String vitalSign) {
        Notification notification = new Notification();
        notification.setTitle("Dangerous Vital Signs");
        notification.setDescription("Patient " + patientName + " has dangerous " + vitalSign);
        notification.setDate(new Date());
        notification.setType(Notification.Type.DANGERVITALS);
        
        User user = new User();
        user.setId(userId);
        notification.setUser(user);
        
        return saveNotification(notification);
    }
}
