package org.ies.deti.ua.medisync.repository;

import org.ies.deti.ua.medisync.model.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
}
