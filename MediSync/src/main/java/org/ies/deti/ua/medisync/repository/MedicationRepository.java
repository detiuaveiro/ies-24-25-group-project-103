package org.ies.deti.ua.medisync.repository;

import org.ies.deti.ua.medisync.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicationRepository extends JpaRepository<Long, Medication> {
}
