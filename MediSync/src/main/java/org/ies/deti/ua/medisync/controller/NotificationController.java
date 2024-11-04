package org.ies.deti.ua.medisync.controller;

import java.util.List;

import org.ies.deti.ua.medisync.model.Notification;
import org.ies.deti.ua.medisync.service.NotificationService; // Ensure you have this service created
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/send/{userId}")
    public ResponseEntity<Notification> sendNotification(@PathVariable Long userId, @RequestBody Notification notification) {
        Notification savedNotification = notificationService.saveNotification(notification);
        return new ResponseEntity<>(savedNotification, HttpStatus.CREATED);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUserId(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    // May be useful later
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Notification>> getNotificationsByType(@PathVariable Notification.Type type) {
        List<Notification> notifications = notificationService.getNotificationsByType(type);
        return ResponseEntity.ok(notifications);
    }

    // Send notifications by type
    @PostMapping("/discharge/{userId}/{roomNumber}")
    public ResponseEntity<Notification> createDischargeNotification(
            @PathVariable Long userId,
            @PathVariable String roomNumber) {
        Notification notification = notificationService.createDischargeNotification(userId, roomNumber);
        return new ResponseEntity<>(notification, HttpStatus.CREATED);
    }

    @PostMapping("/cleaning/{userId}/{roomNumber}")
    public ResponseEntity<Notification> createCleaningNotification(
            @PathVariable Long userId,
            @PathVariable String roomNumber) {
        Notification notification = notificationService.createCleaningNotification(userId, roomNumber);
        return new ResponseEntity<>(notification, HttpStatus.CREATED);
    }

    @PostMapping("/dangervitals/{userId}")
    public ResponseEntity<Notification> createDangerVitalsNotification(
            @PathVariable Long userId,
            @RequestParam String patientName,
            @RequestParam String vitalSign) {
        Notification notification = notificationService.createDangerVitalsNotification(userId, patientName, vitalSign);
        return new ResponseEntity<>(notification, HttpStatus.CREATED);
    }
}
