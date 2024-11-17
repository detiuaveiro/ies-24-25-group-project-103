package org.ies.deti.ua.medisync.repository;

import java.util.List;

import org.ies.deti.ua.medisync.model.ScheduleEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleEntryRepository extends JpaRepository<ScheduleEntry, Long> {
    List<ScheduleEntry> findByNurseId(Long nurseId);
}
