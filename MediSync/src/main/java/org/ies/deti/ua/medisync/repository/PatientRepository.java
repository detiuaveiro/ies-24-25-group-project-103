package org.ies.deti.ua.medisync.repository;

import java.util.List;

import org.ies.deti.ua.medisync.model.Doctor;
import org.ies.deti.ua.medisync.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    // Additional query methods can be defined here if needed
    List<Patient> findByAssignedDoctor(Doctor doctor);
    Patient findPatientById(Long id);
    List<Patient> findByState(String state);
}
