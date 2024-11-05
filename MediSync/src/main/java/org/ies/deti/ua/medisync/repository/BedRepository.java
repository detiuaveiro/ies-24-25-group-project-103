package org.ies.deti.ua.medisync.repository;

import org.ies.deti.ua.medisync.model.Bed;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    List<Bed> findBedByRoom(Room room);
    Bed getBedByAssignedPatient(Patient patient);
}
