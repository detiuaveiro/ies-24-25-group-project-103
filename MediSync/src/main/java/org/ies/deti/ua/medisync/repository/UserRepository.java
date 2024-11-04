package org.ies.deti.ua.medisync.repository;

import org.ies.deti.ua.medisync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
