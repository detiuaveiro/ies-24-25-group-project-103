package org.ies.deti.ua.medisync.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.ies.deti.ua.medisync.dto.BedWithPatientDTO;
import org.ies.deti.ua.medisync.dto.RoomWithPatientsDTO;
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
    /*
     * public List<Nurse> getAllActiveNurses() {
     * List<Nurse> output = new ArrayList<>();
     * for (Nurse nurse : nurseRepository.findAll()) {
     * if (isactive(nurse.getId())) {
     * output.add(nurse);
     * }
     * }
     * return output;
     * }
     */

    public List<ScheduleEntry> getSchedules() {
        return scheduleEntryRepository.findAll();
    }

    public List<ScheduleEntry> getScheduleEntriesFromNurse(Long id) {
        return scheduleEntryRepository.findByNurseId(id);
    }

    public Optional<Nurse> getNurseById(Long nurseId) {
        return nurseRepository.findById(nurseId);
    }

    public List<Room> getRoomsByNurseId(Nurse nurse) {
        List<Room> rooms = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (ScheduleEntry entry : nurse.getSchedule()) {
            if (entry.getRoom() != null) {
                if (entry.getStart_time() != null && entry.getEnd_time() != null) {
                    if (entry.getStart_time().isBefore(now) && entry.getEnd_time().isAfter(now)) {
                        rooms.addAll(entry.getRoom());
                    }
                }
            }
        }
        return rooms;
    }

    public Nurse updateNurse(Long id, Nurse updatedNurse) {
        /*
         * if (!isactive(id)) {
         * return null;
         * }
         */
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

        for (Patient patient : bedPatientMap.values()) {
            Optional<PatientWithVitals> patientWithVitals = patientService.getPatientWithVitalsById(patient.getId());
            patientWithVitals.ifPresent(patientsWithVitals::add);
        }

        return patientsWithVitals;
    }

    public List<RoomWithPatientsDTO> getRoomWithBedsAndPatientsDTO(Nurse nurse) {
        // Fetch all rooms the nurse is assigned to
        List<Room> nurseRooms = nurse.getSchedule().stream()
                .flatMap(scheduleEntry -> scheduleEntry.getRoom().stream())
                .distinct()
                .toList();

        // Fetch all beds and their patients
        Map<Bed, Patient> bedPatientMap = getAssignedBedsAndPatientsForNurse(nurse);
        Map<Room, List<BedWithPatientDTO>> roomToBedsMap = new HashMap<>();

        for (Map.Entry<Bed, Patient> entry : bedPatientMap.entrySet()) {
            Bed bed = entry.getKey();
            Patient patient = entry.getValue();
            Room room = bed.getRoom(); // Assuming Bed has a reference to Room

            Optional<PatientWithVitals> patientWithVitalsOpt = patientService.getPatientWithVitalsById(patient.getId());
            if (patientWithVitalsOpt.isPresent()) {
                PatientWithVitals patientWithVitals = patientWithVitalsOpt.get();
                BedWithPatientDTO bedWithPatientDTO = new BedWithPatientDTO(
                        bed.getId(),
                        bed.getBedNumber(), // Assuming Bed has a getName() or similar method
                        patientWithVitals);

                roomToBedsMap
                        .computeIfAbsent(room, r -> new ArrayList<>())
                        .add(bedWithPatientDTO);
            }
        }

        roomToBedsMap.forEach((room, beds) -> beds.sort(Comparator.comparing(BedWithPatientDTO::getBedId)));

        // Create the list of DTOs, ensuring every room is included
        List<RoomWithPatientsDTO> roomWithPatientsDTOList = new ArrayList<>();
        for (Room room : nurseRooms) {
            List<BedWithPatientDTO> beds = roomToBedsMap.getOrDefault(room, new ArrayList<>()); // Default to empty list
                                                                                                // if no beds
            RoomWithPatientsDTO dto = new RoomWithPatientsDTO(
                    room.getId(),
                    room.getRoomNumber(),
                    beds);
            roomWithPatientsDTOList.add(dto);
        }

        return roomWithPatientsDTOList;
    }

    public Nurse addScheduleEntryToNurse(Long nurseId, ScheduleEntry newEntry) {
        /*
         * if (!isactive(nurseId)) {
         * return null;
         * }
         */
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);
        if (nurseOpt.isPresent()) {
            Nurse nurse = nurseOpt.get();

            if (newEntry.getStart_time().isAfter(newEntry.getEnd_time())) {
                return null;
            }

            for (ScheduleEntry existing : nurse.getSchedule()) {
                boolean hasOverlap = !(newEntry.getEnd_time().isBefore(existing.getStart_time()) || // newEntry ends
                                                                                                    // before existing
                                                                                                    // starts
                        newEntry.getStart_time().isAfter(existing.getEnd_time()) // newEntry starts after existing ends
                );
                if (hasOverlap) {
                    return null;
                }
            }
            newEntry.setNurse(nurse);

            List<Room> associatedRooms = new ArrayList<>();
            for (Room room : newEntry.getRoom()) {
                Room existingRoom = roomRepository.findById(room.getId()).orElse(null);
                if (existingRoom != null) {
                    associatedRooms.add(existingRoom);
                }
            }
            newEntry.setRoom(associatedRooms);
            newEntry = scheduleEntryRepository.save(newEntry);
            for (Room room : associatedRooms) {
                if (!room.getScheduleEntries().contains(newEntry)) {
                    room.getScheduleEntries().add(newEntry); // Add new schedule entry
                }
                roomRepository.save(room);
            }
            nurse.addScheduleEntry(newEntry);
            return nurseRepository.save(nurse);
        } else {
            return null;
        }
    }

    public Nurse updateScheduleEntryFromNurse(Long nurseId, Long before_entryId, ScheduleEntry updatedEntry) {
        /*
         * if (!isactive(nurseId)) {
         * return null;
         * }
         */
        Optional<Nurse> nurseOptional = nurseRepository.findById(nurseId);
        if (nurseOptional.isEmpty()) {
            return null;
        }
        Nurse nurse = nurseOptional.get();

        Optional<ScheduleEntry> beforeEntryOptional = nurse.getSchedule().stream()
                .filter(entry -> entry.getId().equals(before_entryId))
                .findFirst();
        if (beforeEntryOptional.isEmpty()) {
            return null;
        }
        ScheduleEntry beforeEntry = beforeEntryOptional.get();

        boolean hasOverlap = nurse.getSchedule().stream()
                .filter(entry -> !entry.getId().equals(before_entryId))
                .anyMatch(entry -> updatedEntry.getStart_time().isBefore(entry.getEnd_time()) &&
                        updatedEntry.getEnd_time().isAfter(entry.getStart_time()));
        if (hasOverlap) {
            return null;
        }

        beforeEntry.setStart_time(updatedEntry.getStart_time());
        beforeEntry.setEnd_time(updatedEntry.getEnd_time());
        beforeEntry.setInterval(updatedEntry.isInterval());

        beforeEntry.setRoom(updatedEntry.getRoom());

        for (Room room1 : beforeEntry.getRoom()) {
            Optional<Room> roomOpt = roomRepository.findById(room1.getId());
            Room room = roomOpt.get();
            if (!room.getScheduleEntries().contains(beforeEntry)) {
                room.getScheduleEntries().add(beforeEntry);
                roomRepository.save(room);
            }
        }

        scheduleEntryRepository.save(beforeEntry);
        return nurseRepository.save(nurse);
    }

    public Nurse removeScheduleEntryFromNurse(Long nurseId, Long before_entryId) {
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);

        if (nurseOpt.isPresent()) {
            Nurse nurse = nurseOpt.get();

            Optional<ScheduleEntry> beforeEntryOptional = nurse.getSchedule().stream()
                    .filter(entry -> entry.getId().equals(before_entryId))
                    .findFirst();
            if (beforeEntryOptional.isEmpty()) {
                return null;
            }
            ScheduleEntry beforeEntry = beforeEntryOptional.get();

            for (Room room : beforeEntry.getRoom()) {
                if (room.getScheduleEntries().contains(beforeEntry)) {
                    room.getScheduleEntries().remove(beforeEntry);
                    roomRepository.save(room);
                }
            }

            nurse.getSchedule().remove(beforeEntry);
            scheduleEntryRepository.delete(beforeEntry);
            return nurseRepository.save(nurse);
        }
        return null;
    }

    public Nurse newNurse(Nurse nurse) {
        return nurseRepository.save(nurse);
    }

    public void deleteNurse(Long nurseId) {
        Optional<Nurse> nurseOpt = nurseRepository.findById(nurseId);
        if (nurseOpt.isPresent()) {
            Nurse nurse = nurseOpt.get();
            nurse.setEnabled(false);
            nurseRepository.save(nurse);
        }
    }

    public Nurse addNurse(Nurse nurse) {
        nurse.setRole("NURSE");
        return nurseRepository.save(nurse);
    }

    /*
     * public boolean isactive(Long nurseid) {
     * Optional<Nurse> nurse = nurseRepository.findById(nurseid);
     * return nurse.get().isIsactive();
     * }
     */

    public List<Patient> getPatientsByNurseId(Long nurseId) {
        List<Patient> patients = new ArrayList<>();
        Optional<Nurse> nurseOptional = nurseRepository.findById(nurseId);

        if (nurseOptional.isPresent()) {
            Nurse nurse = nurseOptional.get();
            LocalDateTime now = LocalDateTime.now(); // Current time

            for (ScheduleEntry entry : nurse.getSchedule()) {
                if (entry.getStart_time().isBefore(now) && entry.getEnd_time().isAfter(now)) {
                    for (Room room : entry.getRoom()) {
                        List<Bed> beds = bedRepository.findBedByRoom(room);
                        for (Bed bed : beds) {
                            if (bed.getAssignedPatient() != null) {
                                patients.add(bed.getAssignedPatient());
                            }
                        }
                    }
                }
            }
        }
        return patients;
    }

    public Optional<Bed> cleanBed(Long bedId) {
        Optional<Bed> bedOptional = bedRepository.findById(bedId);
        if (bedOptional.isPresent()) {
            Bed bed = bedOptional.get();
            bed.setAssignedPatient(null);
            bed.setCleaned(true);
            bedRepository.save(bed);
        }
        return bedOptional;
    }
}