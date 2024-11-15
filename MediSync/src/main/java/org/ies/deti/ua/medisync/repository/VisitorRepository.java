package org.ies.deti.ua.medisync.repository;

import org.ies.deti.ua.medisync.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    Visitor findByPhoneNumber(String phoneNumber);
    Visitor findVisitorById(Long id);
}
