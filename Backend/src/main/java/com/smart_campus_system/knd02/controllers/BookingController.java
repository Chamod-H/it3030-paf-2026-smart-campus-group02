package com.smart_campus_system.knd02.controllers;

import com.smart_campus_system.knd02.models.Booking;
import com.smart_campus_system.knd02.services.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    private String getCurrentUserId(Authentication authentication) {
        return authentication.getName();
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings(@RequestParam Map<String, String> params) {
        if (params.isEmpty()) {
            return ResponseEntity.ok(bookingService.getAllBookings());
        }
        return ResponseEntity.ok(bookingService.filterBookings(params));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getMyBookings(getCurrentUserId(authentication)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking, Authentication authentication) {
        return ResponseEntity.ok(bookingService.createBooking(booking, getCurrentUserId(authentication)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable String id, @RequestBody Booking booking, Authentication authentication) {
        return ResponseEntity.ok(bookingService.updateBooking(id, booking, getCurrentUserId(authentication)));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable String id, Authentication authentication) {
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().toUpperCase().contains("ADMIN"));
        String passedId = isAdmin ? "ADMIN" : getCurrentUserId(authentication);
        return ResponseEntity.ok(bookingService.cancelBooking(id, passedId));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<Booking> approveBooking(@PathVariable String id, @RequestBody(required = false) Map<String, String> payload) {
        String adminNote = payload != null ? payload.get("adminNote") : null;
        return ResponseEntity.ok(bookingService.approveBooking(id, adminNote));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<Booking> rejectBooking(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String rejectReason = payload.get("rejectReason");
        return ResponseEntity.ok(bookingService.rejectBooking(id, rejectReason));
    }

    @PatchMapping("/{id}/pending")
    public ResponseEntity<Booking> resetToPending(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.resetToPending(id));
    }

    @PostMapping("/check-conflict")
    public ResponseEntity<Map<String, Object>> checkConflict(@RequestBody Map<String, String> params) {
        return ResponseEntity.ok(bookingService.checkConflict(params));
    }
}
