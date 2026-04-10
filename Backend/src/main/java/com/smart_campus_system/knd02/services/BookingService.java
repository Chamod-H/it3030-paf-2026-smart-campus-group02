package com.smart_campus_system.knd02.services;

import com.smart_campus_system.knd02.models.Booking;
import com.smart_campus_system.knd02.repositories.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getMyBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));
    }

    public Booking createBooking(Booking booking, String userId) {
        booking.setUserId(userId);
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    public Booking updateBooking(String id, Booking updatedData, String userId) {
        Booking existing = getBookingById(id);
        
        // Basic check
        if (!userId.equals(existing.getUserId()) && !userId.equals("ADMIN")) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (updatedData.getPurpose() != null) existing.setPurpose(updatedData.getPurpose());
        if (updatedData.getDate() != null) existing.setDate(updatedData.getDate());
        if (updatedData.getStartTime() != null) existing.setStartTime(updatedData.getStartTime());
        if (updatedData.getEndTime() != null) existing.setEndTime(updatedData.getEndTime());
        if (updatedData.getExpectedAttendees() != null) existing.setExpectedAttendees(updatedData.getExpectedAttendees());
        if (updatedData.getNotes() != null) existing.setNotes(updatedData.getNotes());
        
        return bookingRepository.save(existing);
    }

    public Booking cancelBooking(String id, String userId) {
        Booking existing = getBookingById(id);
        if (!userId.equals(existing.getUserId()) && !userId.equals("ADMIN")) {
            throw new RuntimeException("Unauthorized");
        }
        existing.setStatus("CANCELLED");
        return bookingRepository.save(existing);
    }

    public Booking approveBooking(String id, String adminNote) {
        Booking existing = getBookingById(id);
        existing.setStatus("APPROVED");
        if (adminNote != null) existing.setAdminNote(adminNote);
        return bookingRepository.save(existing);
    }

    public Booking rejectBooking(String id, String adminNote) {
        Booking existing = getBookingById(id);
        existing.setStatus("REJECTED");
        if (adminNote != null) existing.setAdminNote(adminNote);
        return bookingRepository.save(existing);
    }

    public Booking resetToPending(String id) {
        Booking existing = getBookingById(id);
        existing.setStatus("PENDING");
        return bookingRepository.save(existing);
    }

    public Map<String, Object> checkConflict(Map<String, String> params) {
        String resourceId = params.get("resourceId");
        LocalDate date = LocalDate.parse(params.get("date"));
        LocalTime start = LocalTime.parse(params.get("startTime"));
        LocalTime end = LocalTime.parse(params.get("endTime"));
        
        List<Booking> existing = bookingRepository.findByResourceIdAndDateAndStatusIn(
            resourceId, date, Arrays.asList("PENDING", "APPROVED")
        );
        
        boolean conflict = existing.stream().anyMatch(b -> 
            (start.isBefore(b.getEndTime()) && end.isAfter(b.getStartTime()))
        );
        
        return Map.of("conflict", conflict, "details", existing);
    }

    public List<Booking> filterBookings(Map<String, String> params) {
        if (params.containsKey("status")) {
            return bookingRepository.findByStatus(params.get("status"));
        }
        return getAllBookings();
    }
}
