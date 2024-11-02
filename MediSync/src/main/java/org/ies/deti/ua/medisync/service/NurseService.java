package org.ies.deti.ua.medisync.service;

import org.ies.deti.ua.medisync.model.*;
import org.ies.deti.ua.medisync.repository.NurseRepository;
import org.ies.deti.ua.medisync.repository.ScheduleEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class NurseService {

    private final NurseRepository nurseRepository;

    private final ScheduleEntryRepository scheduleEntryRepository;

    @Autowired
    private PatientService patientService;

    @Autowired
    public NurseService(NurseRepository nurseRepository, ScheduleEntryRepository scheduleEntryRepository) {
        this.nurseRepository = nurseRepository;
        this.scheduleEntryRepository = scheduleEntryRepository;
    }

    public List<Nurse> getAllNurses() {
        return nurseRepository.findAll();
    }

    public Optional<Nurse> getNurseById(Long nurseId) {
        return nurseRepository.findById(nurseId);
    }

    public List<Room> getRoomsByNurseId(Nurse nurse) {
        List<Room> rooms = new ArrayList<>();
        for (ScheduleEntry entry : nurse.getSchedule()) {
            if(entry.getRoom() != null) {
                rooms.addAll(entry.getRoom());
            }
        }
        return rooms;
    }


    public Nurse updateNurse(Long id, Nurse updatedNurse) {
        return nurseRepository.findById(id).map(existingNurse -> {
            existingNurse.setName(updatedNurse.getName());
            existingNurse.setSchedule(updatedNurse.getSchedule());
            return nurseRepository.save(existingNurse);
        }).orElseThrow(() -> new RuntimeException("Nurse not found with id: " + id));
    }

    public Map<Bed, Patient> getAssignedBedsAndPatientsForNurse(Nurse nurse) {
        Map<Bed, Patient> bedPatientMap = new HashMap<>();

        for (ScheduleEntry entry : nurse.getSchedule()) {
            Set<Room> rooms = entry.getRoom(); // Get the set of rooms

            for (Room room : rooms) { // Iterate through each room
                Set<Bed> beds = room.getBeds(); // Get the beds for the current room

                for (Bed bed : beds) {
                    Patient assignedPatient = bed.getAssignedPatient();
                    if (assignedPatient != null) {
                        bedPatientMap.put(bed, assignedPatient);
                    }
                }
            }
        }

        return bedPatientMap;
    }

    public List<PatientWithVitals> getPatientsWithVitalsForNurse(Nurse nurse) {
        Map<Bed, Patient> bedPatientMap = getAssignedBedsAndPatientsForNurse(nurse);
        List<PatientWithVitals> patientsWithVitals = new ArrayList<>();

        for (Map.Entry<Bed, Patient> entry : bedPatientMap.entrySet()) {
            Patient patient = entry.getValue();
            Optional<PatientWithVitals> patientWithVitals = patientService.getPatientWithVitalsById(patient.getId());
            patientWithVitals.ifPresent(patientsWithVitals::add);
        }

        return patientsWithVitals;
    }

    public Nurse addScheduleEntryToNurse(Long nurseId, ScheduleEntry newEntry) {
        // Optional<Nurse>: To avoid the use of null and the problems it can cause (such as NullPointerException), Spring Data JPA and other Java libraries use the Optional class. An Optional is a container that can or cannot contain a value.
        // nurseOpt.isPresent(): This method checks if the Optional contains a value. If the Nurse was found, isPresent() returns true; otherwise, it returns false.
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);
        if (nurseOpt.isPresent()) {
            Nurse nurse = nurseOpt.get();
            nurse.addScheduleEntry(newEntry);
            scheduleEntryRepository.save(newEntry);
            return nurseRepository.save(nurse);
        } else {
            return null;
        }
    }

    public Nurse updateScheduleEntryFromNurse(Long nurseId, Long before_entryId, Long after_entryId) {
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);
        Optional<ScheduleEntry> scheduleEntryOpt = scheduleEntryRepository.findById(after_entryId);
        if (!nurseOpt.isPresent() || !scheduleEntryOpt.isPresent()) {
            return null;
        }
        Nurse nurse = nurseOpt.get();

        Optional<ScheduleEntry> entryOpt = nurse.getSchedule().stream()
                .filter(entry -> entry.getId().equals(before_entryId))
                .findFirst();

        if (!entryOpt.isPresent()) {
            return null;
        }

        ScheduleEntry existingEntry = entryOpt.get();
        ScheduleEntry updatedEntry = scheduleEntryOpt.get();

        existingEntry.setStart_time(updatedEntry.getStart_time());
        existingEntry.setEnd_time(updatedEntry.getEnd_time());
        existingEntry.setRoom(updatedEntry.getRoom());

        return nurseRepository.save(nurse);
    }

    public Nurse removeScheduleEntryFromNurse(Long nurseId, Long entryId) {
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);
        Optional<ScheduleEntry> scheduleEntry = scheduleEntryRepository.findById(entryId);
        boolean scheduleDependencies = false;

        if (nurseOpt.isPresent()) {
            Nurse nurse = nurseOpt.get();
            nurse.getSchedule().removeIf(entry -> entry.getId().equals(entryId));
            for (Nurse n : getAllNurses()) {
                if (n.getSchedule().stream().anyMatch(entry -> entry.getId().equals(entryId))) {
                    scheduleDependencies = true;
                    break;
                }
            }
            if (!scheduleDependencies) {
                scheduleEntry.ifPresent(scheduleEntryRepository::delete);
            }

            return nurseRepository.save(nurse);
        } else {
            return null;
        }
    }

    public void deleteNurse(Long nurseId) {
        Nurse nurse = nurseRepository.findById(nurseId)
                .orElseThrow(() -> new RuntimeException("Nurse not found"));

        nurse.cleanupUnassociatedScheduleEntries();

        nurseRepository.delete(nurse);
    }

    public Nurse addNurse(Nurse nurse) {
        return nurseRepository.save(nurse);
    }
}