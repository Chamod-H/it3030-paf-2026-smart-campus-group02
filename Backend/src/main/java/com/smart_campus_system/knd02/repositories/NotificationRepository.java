package com.smart_campus_system.knd02.repositories;

import com.smart_campus_system.knd02.models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByTimestampDesc(String userId);
    List<Notification> findByUserIdAndReadOrderByTimestampDesc(String userId, boolean read);
    long countByUserIdAndRead(String userId, boolean read);
}
