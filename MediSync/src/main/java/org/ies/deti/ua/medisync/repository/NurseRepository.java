package org.ies.deti.ua.medisync.repository;

import org.ies.deti.ua.medisync.model.Nurse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NurseRepository extends JpaRepository<Nurse, Long> {

}
