package org.ies.deti.ua.medisync.repository;

import org.ies.deti.ua.medisync.model.HospitalManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HospitalManagerRepository extends JpaRepository<HospitalManager, Long> {
    // Additional query methods can be defined here if needed
}
