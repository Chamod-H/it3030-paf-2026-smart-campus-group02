package com.smart_campus_system.knd02.repositories;

import com.smart_campus_system.knd02.models.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByStatus(String status);
    List<Booking> findByResourceIdAndDateAndStatusIn(String resourceId, LocalDate date, List<String> statuses);
}
