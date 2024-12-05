package org.ies.deti.ua.medisync.controller;

import java.util.List;

import org.ies.deti.ua.medisync.model.Notification;
import org.ies.deti.ua.medisync.service.NotificationService; // Ensure you have this service created
import org.ies.deti.ua.medisync.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Notification> sendNotification(@PathVariable Long userId, @RequestBody Notification notification) {
        notification.setUser(userService.getUserById(userId));
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
        notificationService.createNotificationsMedicationDue(userId);
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }
    
}
