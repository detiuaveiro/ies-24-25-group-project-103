package org.ies.deti.ua.medisync.repository;

import org.ies.deti.ua.medisync.model.Bed;
import org.ies.deti.ua.medisync.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    Set<Bed> findBedByRoom(Room room);
}
