package com.smart_campus_system.knd02.controllers;

import com.smart_campus_system.knd02.models.Notification;
import com.smart_campus_system.knd02.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Helper to get current user ID (email/username depending on UserDetails impl)
    private String getCurrentUserId(Authentication authentication) {
        return authentication.getName(); 
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(
            @RequestParam(required = false) Boolean unreadOnly,
            Authentication authentication) {
        String userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(notificationService.getMyNotifications(userId, unreadOnly));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        String userId = getCurrentUserId(authentication);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id, Authentication authentication) {
        String userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(notificationService.markAsRead(id, userId));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication authentication) {
        String userId = getCurrentUserId(authentication);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}
