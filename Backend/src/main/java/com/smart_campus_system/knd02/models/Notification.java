package com.smart_campus_system.knd02.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    
    private String userId; // The recipient
    private String type; // e.g., BROADCAST, SYSTEM, BOOKING_UPDATE
    private String title;
    private String message;
    
    @Builder.Default
    private boolean read = false;
    
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
