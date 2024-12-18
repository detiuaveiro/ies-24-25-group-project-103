package org.ies.deti.ua.medisync.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.ies.deti.ua.medisync.model.Bed;
import org.ies.deti.ua.medisync.model.Medication;
import org.ies.deti.ua.medisync.model.Notification;
import org.ies.deti.ua.medisync.model.Nurse;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.model.PatientWithVitals;
import org.ies.deti.ua.medisync.model.Room;
import org.ies.deti.ua.medisync.model.User;
import org.ies.deti.ua.medisync.repository.BedRepository;
import org.ies.deti.ua.medisync.repository.NotificationRepository;
import org.ies.deti.ua.medisync.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NurseService nurseService;
    private final PatientService patientService;
    private final UserRepository userRepository;
    private final BedRepository bedRepository;

    public NotificationService(NotificationRepository notificationRepository, NurseService nurseService, PatientService patientService, UserRepository userRepository, BedRepository bedRepository){
        this.notificationRepository = notificationRepository;
        this.nurseService = nurseService;
        this.patientService = patientService;
        this.userRepository = userRepository;
        this.bedRepository = bedRepository;
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
    
        if (nurse.isEmpty()) {
            throw new IllegalArgumentException("Nurse with ID " + id + " not found");
        }
    
        List<PatientWithVitals> patients = nurseService.getPatientsWithVitalsForNurse(nurse.get());
    
        for (PatientWithVitals patient : patients) {
            List<Medication> medications = patientService.getDueMedications(patient.getPatient().getId());
    
            for (Medication medication : medications) {
    
                String expectedDescription = "Medication " + medication.getName() + " is due for patient " + patient.getPatient().getName();
    
                boolean notificationExists = notificationRepository.existsByTypeAndDescription(
                    "MEDICATION_DUE",
                    expectedDescription
                );
    
                if (!notificationExists && !medication.isHasTaken()) {
                    Notification notification = new Notification();
                    notification.setDate(new Date());
                    notification.setTitle("Medication is Due!");
                    Optional<User> user = userRepository.findById(nurse.get().getId());
                    if (user.isEmpty()) {
                        throw new IllegalArgumentException("User associated with Nurse ID " + id + " not found");
                    }
                    notification.setUser(user.get());
                    notification.setType("MEDICATION_DUE");
                    notification.setDescription(expectedDescription);
                    notification.setPatientId(patient.getPatient().getId());
                    notificationRepository.save(notification);
                }
            }
        }
    
        return notificationRepository.findByType("MEDICATION_DUE");
    }


public List<Notification> createNotificationsDischargePatient(Long hospitalManagerId) {

    Optional<User> hospitalManager = userRepository.findById(hospitalManagerId);

    if (hospitalManager.isEmpty()) {
        throw new IllegalArgumentException("Hospital Manager with ID " + hospitalManagerId + " not found");
    }

    List<Patient> patientsToBeDischarged = patientService.getPatientsByState("TO_BE_DISCHARGED");

    for (Patient patient : patientsToBeDischarged) {
        String expectedDescription = "Patient " + patient.getName() + " is ready to be discharged.";

        boolean notificationExists = notificationRepository.existsByTypeAndDescription(
            "DISCHARGE",
            expectedDescription
        );

        if (!notificationExists) {
            Notification notification = new Notification();
            notification.setDate(new Date());
            notification.setTitle("Patient Discharge Alert");
            notification.setType("DISCHARGE");
            notification.setDescription(expectedDescription);
            notification.setUser(hospitalManager.get());
            notification.setPatientId(patient.getId());
            notificationRepository.save(notification);
        }
    }

    return notificationRepository.findByType("DISCHARGE");
}
public List<Notification> createNotificationsForUncleanBeds(Long nurseId) {
    Optional<Nurse> nurseOpt = nurseService.getNurseById(nurseId);
    if (nurseOpt.isEmpty()) {
        throw new IllegalArgumentException("Nurse with ID " + nurseId + " not found");
    }
    Nurse nurse = nurseOpt.get();

    List<Room> scheduledRooms = nurseService.getRoomsByNurseId(nurse);

    if (scheduledRooms.isEmpty()) {
        return notificationRepository.findByType("CLEANPREP"); 
    }

    List<Bed> uncleanBeds = new ArrayList<>();
    for (Room room : scheduledRooms) {
        List<Bed> beds = bedRepository.findBedByRoomAndCleaned(room, false);
        uncleanBeds.addAll(beds);
    }

    if (uncleanBeds.isEmpty()) {
        return notificationRepository.findByType("CLEANPREP");
    }

    for (Bed bed : uncleanBeds) {
        String bedNumber = bed.getBedNumber();
        char floor = bedNumber.charAt(0);
        char roomNumber = bedNumber.charAt(1);
        char bedInRoom = bedNumber.charAt(2);
        String expectedDescription = String.format(
            "Clean and prepare bed %s in room %s on floor %s",
            bedInRoom,
            roomNumber,
            floor
        );

        boolean notificationExists = notificationRepository.existsByTypeAndDescription(
            "CLEANPREP",
            expectedDescription
        );

        if (!notificationExists) {
            Notification notification = new Notification();
            notification.setDate(new Date());
            notification.setTitle("Clean and Prepare Bed!");
            Optional<User> userOpt = userRepository.findById(nurse.getId());
            if (userOpt.isEmpty()) {
                throw new IllegalArgumentException("User associated with Nurse ID " + nurseId + " not found");
            }
            notification.setUser(userOpt.get());
            notification.setType("CLEANPREP");
            notification.setDescription(expectedDescription);
            notification.setBedId(bed.getId());
            notificationRepository.save(notification);
        }
    }

    return notificationRepository.findByType("CLEANPREP");
    }

}