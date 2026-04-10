package com.smart_campus_system.knd02.services;

import com.smart_campus_system.knd02.models.Notification;
import com.smart_campus_system.knd02.repositories.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getMyNotifications(String userId, Boolean unreadOnly) {
        if (Boolean.TRUE.equals(unreadOnly)) {
            return notificationRepository.findByUserIdAndReadOrderByTimestampDesc(userId, false);
        }
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndRead(userId, false);
    }

    public Notification markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
            
        // Basic security check
        if (!notification.getUserId().equals(userId) && !userId.equals("ADMIN")) {
            throw new RuntimeException("Unauthorized");
        }
        
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndReadOrderByTimestampDesc(userId, false);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    // Admin function to broadcast
    public Notification generateAlert(String userId, String type, String title, String message) {
        Notification n = Notification.builder()
            .userId(userId)
            .type(type)
            .title(title)
            .message(message)
            .read(false)
            .build();
        return notificationRepository.save(n);
    }
}
