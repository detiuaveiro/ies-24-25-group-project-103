package org.ies.deti.ua.medisync.controller;

import org.ies.deti.ua.medisync.model.Doctor;
import org.ies.deti.ua.medisync.model.Nurse;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.service.HospitalManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hospital")
public class HospitalManagerController {

    private final HospitalManagerService hospitalManagerService;

    @Autowired
    public HospitalManagerController(HospitalManagerService hospitalManagerService) {
        this.hospitalManagerService = hospitalManagerService;
    }

    // Staff Management endpoints
    @PostMapping("/doctors")
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        Doctor newDoctor = hospitalManagerService.newDoctor(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(newDoctor);
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        hospitalManagerService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = hospitalManagerService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @PostMapping("/nurses")
    public ResponseEntity<Nurse> createNurse(@RequestBody Nurse nurse) {
        Nurse newNurse = hospitalManagerService.newNurse(nurse);
        return ResponseEntity.status(HttpStatus.CREATED).body(newNurse);
    }

    @DeleteMapping("/nurses/{id}")
    public ResponseEntity<Void> deleteNurse(@PathVariable Long id) {
        hospitalManagerService.deleteNurse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nurses")
    public ResponseEntity<List<Nurse>> getAllNurses() {
        List<Nurse> nurses = hospitalManagerService.getAllNurses();
        return ResponseEntity.ok(nurses);
    }

    // Patient Management endpoints
    @PostMapping("/patients")
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        Patient newPatient = hospitalManagerService.createPatient(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(newPatient);
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<Void> dischargePatient(@PathVariable Long id) {
        hospitalManagerService.dischargePatient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = hospitalManagerService.getAllPatients();
        return ResponseEntity.ok(patients);
    }
}