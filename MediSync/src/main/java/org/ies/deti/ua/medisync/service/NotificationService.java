package org.ies.deti.ua.medisync.service;

import java.util.List;
import java.util.Optional; 

import org.ies.deti.ua.medisync.model.Medication;
import org.ies.deti.ua.medisync.model.Notification;
import org.ies.deti.ua.medisync.model.Nurse;
import org.ies.deti.ua.medisync.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.model.PatientWithVitals;
import org.ies.deti.ua.medisync.service.PatientService;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NurseService nurseService;
    private final PatientService patientService;

    public NotificationService(NotificationRepository notificationRepository, NurseService nurseService, PatientService patientService) {
        this.notificationRepository = notificationRepository;
        this.nurseService = nurseService;
        this.patientService = patientService;
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
    
    public List<Notification> getNotificationsByType(String type) {
        return notificationRepository.findByType(type);
    }

    public List<Notification> createNotificationsMedicationDue(Long id) {
        Optional<Nurse> nurse = nurseService.getNurseById(id);
        List<PatientWithVitals> patients = nurseService.getPatientsWithVitalsForNurse(nurse.get());
        List<Medication> medications = patientService.getDueMedications(patients);
    }
}
