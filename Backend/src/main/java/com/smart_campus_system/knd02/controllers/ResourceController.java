package com.smart_campus_system.knd02.controllers;

import com.smart_campus_system.knd02.models.Resource;
import com.smart_campus_system.knd02.services.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
// CORS is handled by SecurityConfig + CorsConfig globally
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PostMapping
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        return ResponseEntity.ok(resourceService.createResource(resource));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable String id, @RequestBody Resource resource) {
        return ResponseEntity.ok(resourceService.updateResource(id, resource));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Resource>> searchResources(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(resourceService.filterResources(params));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Resource>> filterResources(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(resourceService.filterResources(params));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Resource> updateResourceStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(resourceService.updateResourceStatus(id, newStatus));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<?> getResourceAvailability(@PathVariable String id) {
        // Mock availability for now
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(Map.of(
            "resourceId", resource.getId(),
            "availability", resource.getAvailabilitySummary()
        ));
    }
}
