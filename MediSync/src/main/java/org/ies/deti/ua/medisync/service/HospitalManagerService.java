package org.ies.deti.ua.medisync.service;

import org.ies.deti.ua.medisync.model.Bed;
import org.ies.deti.ua.medisync.model.Doctor;
import org.ies.deti.ua.medisync.model.Nurse;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.model.Room;
import org.ies.deti.ua.medisync.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class HospitalManagerService {

    private final PatientService patientService;
    private final NurseService nurseService;
    private final DoctorService doctorService;

    @Autowired
    public HospitalManagerService(PatientService patientService, NurseService nurseService, DoctorService doctorService) {
        this.patientService = patientService;
        this.nurseService = nurseService;
        this.doctorService = doctorService;
    }
    
    @Autowired
    private RoomRepository roomRepository;

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
        // Floors 1-3
        for (int floor = 1; floor <= 3; floor++) {
            // Each floor has 8 rooms
            for (int roomNum = 1; roomNum <= 8; roomNum++) {
                // Format: floor_number+room_number
                String roomNumber = String.format("%d%d", floor, roomNum);
                
                // Create new room
                Room room = new Room();
                room.setRoomNumber(roomNumber);
                room.setScheduleEntries(new HashSet<>());
                
                // Each room has 4 beds
                Set<Bed> beds = new HashSet<>();
                for (int bedNum = 1; bedNum <= 4; bedNum++) {
                    Bed bed = new Bed();
                    // Format: room_number+bed_number
                    Long bedId = Long.parseLong(roomNumber + bedNum);
                    bed.setId(bedId);
                    bed.setRoom(room);
                    bed.setAssignedPatient(null);
                    beds.add(bed);
                }
                
                room.setBeds(beds);
                
                // Due to the cascade type (Room.java, line 20), the beds will be saved as well
                roomRepository.save(room);
            }
        }
    }

}