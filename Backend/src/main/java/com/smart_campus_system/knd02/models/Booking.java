package com.smart_campus_system.knd02.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Booking {
    @Id
    private String id;
    
    private String resourceId; 
    private String userId; // The requester
    
    private String purpose;
    private Integer expectedAttendees;
    private Integer quantity;  // Used for Equipment bookings instead of expectedAttendees
    private String notes;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    
    // e.g., PENDING, APPROVED, REJECTED, CANCELLED
    @Builder.Default
    private String status = "PENDING";
    
    // Notes injected by admin upon rejection or approval
    private String adminNote;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
