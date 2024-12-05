package org.ies.deti.ua.medisync.repository;

import java.util.List;

import org.ies.deti.ua.medisync.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);
    List<Notification> findByType(String type);
    boolean existsByTypeAndDescription(String type, String description);
}
