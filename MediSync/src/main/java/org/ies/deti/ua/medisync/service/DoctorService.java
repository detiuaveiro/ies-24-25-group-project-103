package org.ies.deti.ua.medisync.service;

import org.ies.deti.ua.medisync.model.*;
import org.ies.deti.ua.medisync.repository.DoctorRepository;
import org.ies.deti.ua.medisync.repository.NurseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.*;


@Service
public class DoctorService {
    @Autowired
    private final DoctorRepository doctorRepository;
    @Autowired
    private PatientService patientService;

    public DoctorService(DoctorRepository doctorRepository, PatientService patientService) {
        this.doctorRepository = doctorRepository;
        this.patientService = patientService;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(long id) {
        return doctorRepository.findById(id);
    }

    public Doctor newDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public List<Patient> getDoctorPatients(Doctor doctor) {
        return patientService.getPatientsFromDoctor(doctor);
    }

    public Doctor updateDoctor(Long doctorId, Doctor doctor) {
        Optional<Doctor> doctorOptional = doctorRepository.findById(doctorId);
        if (doctorOptional.isPresent()) {
            Doctor doc = doctorOptional.get();
            doc.setName(doctor.getName());
            doc.setName(doctor.getName());
            return doctorRepository.save(doc);
        }
        return null;
    }
}
