package org.ies.deti.ua.medisync.service;

import java.util.List;
import java.util.Optional;

import org.ies.deti.ua.medisync.model.Doctor;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


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
        doctor.setRole("DOCTOR");
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

    public void deleteDoctor(Long doctorId) {
        Optional<Doctor> doctorOptional = doctorRepository.findById(doctorId);
        doctorOptional.ifPresent(doctorRepository::delete);
    }
}
