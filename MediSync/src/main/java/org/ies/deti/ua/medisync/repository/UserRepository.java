package org.ies.deti.ua.medisync.repository;

import org.ies.deti.ua.medisync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Long, User> {
}
