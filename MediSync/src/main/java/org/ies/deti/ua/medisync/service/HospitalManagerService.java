package org.ies.deti.ua.medisync.service;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

import org.ies.deti.ua.medisync.model.RoomOccupancyDTO;
import org.ies.deti.ua.medisync.model.ScheduleEntry;
import org.ies.deti.ua.medisync.model.Bed;
import org.ies.deti.ua.medisync.model.Doctor;
import org.ies.deti.ua.medisync.model.Nurse;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.model.Room;
import org.ies.deti.ua.medisync.repository.BedRepository;
import org.ies.deti.ua.medisync.repository.HospitalManagerRepository;
import org.ies.deti.ua.medisync.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HospitalManagerService {

    @Autowired
    private final PatientService patientService;

    @Autowired
    private final NurseService nurseService;

    @Autowired
    private final DoctorService doctorService;

    @Autowired
    private final HospitalManagerRepository hospitalManagerRepository;

    @Autowired
    private final RoomRepository roomRepository;

    @Autowired
    private final BedRepository bedRepository;

    @Autowired
    public HospitalManagerService(PatientService patientService, NurseService nurseService, DoctorService doctorService,
            HospitalManagerRepository hospitalManagerRepository, RoomRepository roomRepository,
            BedRepository bedRepository) {
        this.patientService = patientService;
        this.nurseService = nurseService;
        this.doctorService = doctorService;
        this.hospitalManagerRepository = hospitalManagerRepository;
        this.roomRepository = roomRepository;
        this.bedRepository = bedRepository;
    }

    public Patient createPatient(Patient patient) {
        return patientService.createPatient(patient);
    }

    public void dischargePatient(Long patientId) {
        patientService.dischargePatient(patientId);
    }

    public Doctor newDoctor(Doctor doctor) {
        return doctorService.newDoctor(doctor);
    }

    public void deleteDoctor(Long doctorId) {
        doctorService.deleteDoctor(doctorId);
    }

    public Nurse newNurse(Nurse nurse) {
        return nurseService.newNurse(nurse);
    }

    public void deleteNurse(Long nurseId) {
        nurseService.deleteNurse(nurseId);
    }

    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    public List<Nurse> getAllNurses() {
        return nurseService.getAllNurses();
    }

    // Salas

    public void addRooms() {
        // Additional check to avoid adding rooms multiple times
        if (!roomRepository.findAll().isEmpty()) {
            return;
        }

        // Floors 1-3
        for (int floor = 1; floor <= 3; floor++) {
            // Each floor has 8 rooms
            for (int roomNum = 1; roomNum <= 8; roomNum++) {
                // Format: floor_number+room_number
                String roomNumber = String.format("%d%d", floor, roomNum);

                // Create new room
                Room room = new Room();
                room.setRoomNumber(roomNumber);
                room.setScheduleEntries(new ArrayList<>());
                roomRepository.save(room);

                for (int bedNum = 1; bedNum <= 4; bedNum++) {
                    Room newRoom = roomRepository.findById(room.getId()).orElse(null);
                    Bed bed = new Bed();
                    // Format: room_number+bed_number
                    String bedNumber = String.format("%s%d", roomNumber, bedNum);
                    bed.setRoom(newRoom);
                    bed.setBedNumber(bedNumber);
                    bed.setAssignedPatient(null);
                    bedRepository.save(bed);
                }
            }
        }
    }

    public void removeAllRooms() {
        roomRepository.deleteAll();
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long roomId) {
        return roomRepository.findById(roomId).orElse(null);
    }

    public Bed getBedById(Long bedId) {
        return bedRepository.findById(bedId).orElse(null);
    }

    public Bed getBedByBedNumber(String bedNumber) {
        return bedRepository.getBedByBedNumber(bedNumber);
    }

    public List<Bed> getAllBeds() {
        return bedRepository.findAll();
    }

    public List<Bed> getBedsInRoom(Room room) {
        return bedRepository.findBedByRoom(room);
    }

    public Room getRoomByNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber).orElse(null);
    }

    public List<RoomOccupancyDTO> getRoomsOccupancy() {
        List<Room> rooms = getAllRooms();
        List<RoomOccupancyDTO> roomOccupancies = new ArrayList<>();

        for (Room room : rooms) {
            // Get beds and count patients
            List<Bed> beds = bedRepository.findBedByRoom(room);
            int patientCount = (int) beds.stream()
                .filter(bed -> bed.getAssignedPatient() != null)
                .count();

            // Count current staff (nurses) from schedule entries
            LocalDateTime now = LocalDateTime.now();
            int staffCount = (int) room.getScheduleEntries().stream()
                .filter(entry -> 
                    entry.getStart_time().isBefore(now) && 
                    entry.getEnd_time().isAfter(now))
                .map(ScheduleEntry::getNurse)
                .distinct()
                .count();

            RoomOccupancyDTO occupancy = new RoomOccupancyDTO(
                room.getId(),
                room.getRoomNumber(),
                patientCount,
                staffCount
            );

            roomOccupancies.add(occupancy);
        }

        return roomOccupancies;
    }

}