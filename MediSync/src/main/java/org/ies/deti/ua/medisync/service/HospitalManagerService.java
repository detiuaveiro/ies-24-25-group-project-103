package org.ies.deti.ua.medisync.service;

import org.ies.deti.ua.medisync.model.Doctor;
import org.ies.deti.ua.medisync.model.Nurse;
import org.ies.deti.ua.medisync.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
}