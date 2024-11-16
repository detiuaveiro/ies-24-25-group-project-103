package org.ies.deti.ua.medisync.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.ies.deti.ua.medisync.model.Bed;
import org.ies.deti.ua.medisync.model.Nurse;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.model.PatientWithVitals;
import org.ies.deti.ua.medisync.model.Room;
import org.ies.deti.ua.medisync.model.ScheduleEntry;
import org.ies.deti.ua.medisync.repository.BedRepository;
import org.ies.deti.ua.medisync.repository.NurseRepository;
import org.ies.deti.ua.medisync.repository.RoomRepository;
import org.ies.deti.ua.medisync.repository.ScheduleEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NurseService {

    private final NurseRepository nurseRepository;
    private final BedRepository bedRepository;
    private final ScheduleEntryRepository scheduleEntryRepository;
    private final RoomRepository roomRepository;

    @Autowired
    private final PatientService patientService;

    public NurseService(NurseRepository nurseRepository, ScheduleEntryRepository scheduleEntryRepository,
            BedRepository bedRepository, PatientService patientService, RoomRepository roomRepository) {
        this.nurseRepository = nurseRepository;
        this.scheduleEntryRepository = scheduleEntryRepository;
        this.bedRepository = bedRepository;
        this.patientService = patientService;
        this.roomRepository = roomRepository;
    }

    public List<Nurse> getAllNurses() {
        return nurseRepository.findAll();
    }

    public List<ScheduleEntry> getSchedules() {
        return scheduleEntryRepository.findAll();
    }

    public Optional<Nurse> getNurseById(Long nurseId) {
        return nurseRepository.findById(nurseId);
    }

    public List<Room> getRoomsByNurseId(Nurse nurse) {
        List<Room> rooms = new ArrayList<>();
        Date now = new Date();
        for (ScheduleEntry entry : nurse.getSchedule()) {
            if (entry.getRoom() != null) {
                if (entry.getStart_time() != null && entry.getEnd_time() != null) {
                    if (entry.getStart_time().before(now) && entry.getEnd_time().after(now)) {
                        rooms.addAll(entry.getRoom());
                    }
                }
            }
        }
        return rooms;
    }

    public Nurse updateNurse(Long id, Nurse updatedNurse) {
        return nurseRepository.findById(id).map(existingNurse -> {
            existingNurse.setName(updatedNurse.getName());
            existingNurse.setUsername(updatedNurse.getUsername());
            existingNurse.setEmail(updatedNurse.getEmail());
            existingNurse.setPassword(updatedNurse.getPassword());
            existingNurse.setSchedule(updatedNurse.getSchedule());
            return nurseRepository.save(existingNurse);
        }).orElseThrow(() -> new RuntimeException("Nurse not found with id: " + id));
    }

    public Map<Bed, Patient> getAssignedBedsAndPatientsForNurse(Nurse nurse) {
        Map<Bed, Patient> bedPatientMap = new HashMap<>();

        for (ScheduleEntry entry : nurse.getSchedule()) {
            List<Room> rooms = entry.getRoom();

            for (Room room : rooms) {
                List<Bed> beds = bedRepository.findBedByRoom(room);

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
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);
        if (nurseOpt.isPresent()) {
            Nurse nurse = nurseOpt.get();
            Optional<ScheduleEntry> existingEntryOpt = scheduleEntryRepository.findById(newEntry.getId());

            if (!existingEntryOpt.isPresent()) {
                // Handle rooms
                List<Room> rooms = new ArrayList<>();
                for (Room room : newEntry.getRoom()) {
                    Optional<Room> roomOpt = roomRepository.findById(room.getId());
                    roomOpt.ifPresentOrElse(
                            rooms::add,
                            () -> rooms.add(roomRepository.save(room)) // Save if room doesn't exist
                    );
                }
                newEntry.setRoom(rooms);
                newEntry = scheduleEntryRepository.save(newEntry);

                // Update the bidirectional relationship
                for (Room room : rooms) {
                    room.getScheduleEntries().add(newEntry);
                    roomRepository.save(room);
                }
            } else {
                nurse.addScheduleEntry(existingEntryOpt.get());
            }

            return nurseRepository.save(nurse);
        } else {
            return null;
        }
    }

    public Nurse updateScheduleEntryFromNurse(Long nurseId, Long before_entryId, ScheduleEntry updatedEntry) {
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);
        if (!nurseOpt.isPresent()) {
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

        List<Nurse> associatedNurses = existingEntry.getNurses();
        if (associatedNurses.contains(nurse) && associatedNurses.size() == 1) {
            existingEntry.setStart_time(updatedEntry.getStart_time());
            existingEntry.setEnd_time(updatedEntry.getEnd_time());
            existingEntry.setRoom(updatedEntry.getRoom());
            scheduleEntryRepository.save(existingEntry);
        } else {
            existingEntry.removeNurse(nurse);
            scheduleEntryRepository.save(existingEntry);
            updatedEntry.addNurse(nurse);
            scheduleEntryRepository.save(updatedEntry);
        }

        return nurseRepository.save(nurse);
    }

    public Nurse removeScheduleEntryFromNurse(Long nurseId, Long entryId) {
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);

        if (nurseOpt.isPresent()) {
            Nurse nurse = nurseOpt.get();

            ScheduleEntry entryToRemove = nurse.getSchedule().stream()
                    .filter(entry -> entry.getId().equals(entryId))
                    .findFirst()
                    .orElse(null);
            if (entryToRemove != null) {
                List<Nurse> associatedNurses = entryToRemove.getNurses();
                if (associatedNurses.contains(nurse) && associatedNurses.size() == 1) {
                    scheduleEntryRepository.delete(entryToRemove);
                } else {
                    nurse.getSchedule().remove(entryToRemove);
                }
                return nurseRepository.save(nurse);
            }
        }
        return null;
    }

    public Nurse newNurse(Nurse nurse) {
        return nurseRepository.save(nurse);
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