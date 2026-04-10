package com.smart_campus_system.knd02.services;

import com.smart_campus_system.knd02.models.Ticket;
import com.smart_campus_system.knd02.repositories.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getMyTickets(List<String> reporterIdentifiers) {
        return ticketRepository.findByReporterIdIn(reporterIdentifiers);
    }

    public List<Ticket> getAssignedTickets(String technicianId) {
        return ticketRepository.findByTechnicianId(technicianId);
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
    }

    public Ticket createTicket(Ticket ticket, String reporterId) {
        ticket.setReporterId(reporterId);
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketCore(String id, Ticket updatedData) {
        Ticket existing = getTicketById(id);
        
        if (updatedData.getCategory() != null) existing.setCategory(updatedData.getCategory());
        if (updatedData.getPriority() != null) existing.setPriority(updatedData.getPriority());
        if (updatedData.getDescription() != null) existing.setDescription(updatedData.getDescription());
        if (updatedData.getLocation() != null) existing.setLocation(updatedData.getLocation());
        
        existing.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(existing);
    }

    public Ticket assignTechnician(String id, String technicianId, String assignNote) {
        Ticket existing = getTicketById(id);
        existing.setTechnicianId(technicianId);
        existing.setStatus("IN_PROGRESS");
        if (assignNote != null) existing.setAssignNote(assignNote);
        existing.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(existing);
    }

    public Ticket updateStatus(String id, String newStatus) {
        Ticket existing = getTicketById(id);
        existing.setStatus(newStatus.toUpperCase());
        existing.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(existing);
    }

    public Ticket rejectTicket(String id, String reason) {
        Ticket existing = getTicketById(id);
        existing.setStatus("REJECTED");
        existing.setRejectReason(reason);
        existing.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(existing);
    }

    public Ticket resolveTicket(String id, String resolutionNote) {
        Ticket existing = getTicketById(id);
        existing.setStatus("RESOLVED");
        existing.setResolveNote(resolutionNote);
        existing.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(existing);
    }

    public Ticket closeTicket(String id) {
        Ticket existing = getTicketById(id);
        existing.setStatus("CLOSED");
        existing.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(existing);
    }

    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }

    public List<Ticket> filterTickets(Map<String, String> queryParams) {
        if (queryParams.containsKey("status")) {
            return ticketRepository.findByStatus(queryParams.get("status"));
        }
        return getAllTickets();
    }
}
