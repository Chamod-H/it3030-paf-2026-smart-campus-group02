package com.smart_campus_system.knd02.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Resource {
    @Id
    private String id;
    private String name;
    private String type; // e.g., LAB, LECTURE_HALL
    private String description;
    private Integer capacity;
    private Integer quantity;
    private String location;
    private String status; // e.g., ACTIVE, MAINTENANCE
    private String availabilitySummary;
    private String imageUrl;
}
