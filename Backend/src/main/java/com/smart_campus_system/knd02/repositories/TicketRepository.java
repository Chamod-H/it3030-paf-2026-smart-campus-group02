package com.smart_campus_system.knd02.repositories;

import com.smart_campus_system.knd02.models.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByReporterId(String reporterId);
    List<Ticket> findByReporterIdIn(List<String> reporterIds);
    List<Ticket> findByTechnicianId(String technicianId);
    List<Ticket> findByStatus(String status);
}
