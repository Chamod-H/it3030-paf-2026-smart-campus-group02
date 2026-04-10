package com.smart_campus_system.knd02.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Ticket {
    @Id
    private String id;
    
    private String reporterId;
    private String technicianId;
    
    private String category; // e.g. ELECTRICAL, PLUMBING, IT
    private String priority; // e.g. LOW, MEDIUM, HIGH, URGENT
    private String description;
    
    private String location;
    private String imageUrl;
    
    @Builder.Default
    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    
    // Notes injected dynamically during workflow
    private String assignNote;
    private String resolveNote;
    private String rejectReason;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
