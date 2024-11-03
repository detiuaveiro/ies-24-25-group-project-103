package org.ies.deti.ua.medisync.repository;

import java.util.Optional;

import org.ies.deti.ua.medisync.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    Optional<Room> findByBeds_Id(Long bedId);
}