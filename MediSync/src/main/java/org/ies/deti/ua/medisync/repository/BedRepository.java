package org.ies.deti.ua.medisync.repository;

import java.util.List;

import org.ies.deti.ua.medisync.model.Bed;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    List<Bed> findBedByRoom(Room room);

    Bed getBedByAssignedPatient(Patient patient);

    Bed getBedByBedNumber(String bedNumber);
    List<Bed> findByCleaned(boolean cleaned);
    List<Bed> findBedByRoomAndCleaned(Room room, boolean cleaned);
}
