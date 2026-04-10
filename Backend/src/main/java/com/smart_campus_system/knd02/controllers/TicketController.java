package com.smart_campus_system.knd02.controllers;

import com.smart_campus_system.knd02.models.Ticket;
import com.smart_campus_system.knd02.security.CustomUserDetails;
import com.smart_campus_system.knd02.services.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /**
     * Extracts the MongoDB user _id from the authenticated principal.
     */
    private String getCurrentUserId(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUser().getId();
        }
        return authentication.getName();
    }

    /**
     * Extracts the user's explicit Email from the authenticated principal.
     */
    private String getCurrentUserEmail(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUser().getEmail();
        }
        return authentication.getName();
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(@RequestParam Map<String, String> params) {
        if (params.isEmpty()) {
            return ResponseEntity.ok(ticketService.getAllTickets());
        }
        return ResponseEntity.ok(ticketService.filterTickets(params));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(Authentication authentication) {
        List<String> identifiers = java.util.Arrays.asList(
            getCurrentUserId(authentication),
            getCurrentUserEmail(authentication)
        );
        return ResponseEntity.ok(ticketService.getMyTickets(identifiers));
    }

    @GetMapping("/my-assigned")
    public ResponseEntity<List<Ticket>> getTechnicianTickets(Authentication authentication) {
        return ResponseEntity.ok(ticketService.getAssignedTickets(getCurrentUserId(authentication)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Ticket> createTicketWithFile(
            @RequestPart("ticketData") Ticket ticket,
            @RequestPart(value = "file", required = false) MultipartFile file,
            Authentication authentication) {
        try {
            if (file != null && !file.isEmpty()) {
                // Save file to uploads/ directory next to the running jar
                String uploadsDir = "uploads";
                Path uploadPath = Paths.get(uploadsDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                String extension = "";
                String originalName = file.getOriginalFilename();
                if (originalName != null && originalName.contains(".")) {
                    extension = originalName.substring(originalName.lastIndexOf("."));
                }
                String fileName = UUID.randomUUID().toString() + extension;
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath);
                ticket.setImageUrl("/uploads/" + fileName);
            }
            return ResponseEntity.ok(ticketService.createTicket(ticket, getCurrentUserEmail(authentication)));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping(consumes = {"application/json"})
    public ResponseEntity<Ticket> createTicketJson(@RequestBody Ticket ticket, Authentication authentication) {
        return ResponseEntity.ok(ticketService.createTicket(ticket, getCurrentUserEmail(authentication)));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable String id, @RequestBody Ticket ticket) {
        return ResponseEntity.ok(ticketService.updateTicketCore(id, ticket));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, payload.get("technicianId"), payload.get("note")));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.updateStatus(id, payload.get("status")));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<Ticket> rejectTicket(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.rejectTicket(id, payload.get("reason")));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<Ticket> resolveTicket(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(ticketService.resolveTicket(id, payload.get("resolutionNote")));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<Ticket> closeTicket(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.closeTicket(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}
