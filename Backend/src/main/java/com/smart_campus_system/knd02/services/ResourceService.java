package com.smart_campus_system.knd02.services;

import com.smart_campus_system.knd02.models.Resource;
import com.smart_campus_system.knd02.repositories.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(String id, Resource resourceData) {
        Resource existing = getResourceById(id);
        
        if (resourceData.getName() != null) existing.setName(resourceData.getName());
        if (resourceData.getType() != null) existing.setType(resourceData.getType());
        if (resourceData.getDescription() != null) existing.setDescription(resourceData.getDescription());
        if (resourceData.getCapacity() != null) existing.setCapacity(resourceData.getCapacity());
        if (resourceData.getQuantity() != null) existing.setQuantity(resourceData.getQuantity());
        if (resourceData.getLocation() != null) existing.setLocation(resourceData.getLocation());
        if (resourceData.getStatus() != null) existing.setStatus(resourceData.getStatus());
        if (resourceData.getAvailabilitySummary() != null) existing.setAvailabilitySummary(resourceData.getAvailabilitySummary());
        if (resourceData.getImageUrl() != null) existing.setImageUrl(resourceData.getImageUrl());
        
        return resourceRepository.save(existing);
    }

    public void deleteResource(String id) {
        Resource existing = getResourceById(id);
        resourceRepository.delete(existing);
    }

    public Resource updateResourceStatus(String id, String status) {
        Resource existing = getResourceById(id);
        existing.setStatus(status);
        return resourceRepository.save(existing);
    }

    public List<Resource> filterResources(Map<String, String> queryParams) {
        // Simplified fallback for search and filters.
        if (queryParams.containsKey("type")) {
            return resourceRepository.findByType(queryParams.get("type"));
        }
        if (queryParams.containsKey("status")) {
            return resourceRepository.findByStatus(queryParams.get("status"));
        }
        return getAllResources();
    }
}
