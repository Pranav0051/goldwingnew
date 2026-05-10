package com.premiumadventure.backend.controller;

import com.premiumadventure.backend.model.Booking;
import com.premiumadventure.backend.payload.request.BookingRequest;
import com.premiumadventure.backend.payload.request.PaymentVerificationRequest;
import com.premiumadventure.backend.payload.response.MessageResponse;
import com.premiumadventure.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest request) {
        try {
            Booking booking = bookingService.createBooking(request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error creating booking: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        boolean isConfirmed = bookingService.verifyAndConfirmPayment(request);
        if (isConfirmed) {
            return ResponseEntity.ok(new MessageResponse("Payment verified and booking confirmed!"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid payment signature!"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        return bookingService.getBookingByBookingId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getMyBookings());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<Booking>> getBookingsByAgent(@PathVariable String agentId) {
        return ResponseEntity.ok(bookingService.getBookingsByAgent(agentId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable String id, @RequestParam String status) {
        try {
            bookingService.updateStatus(id, status);
            return ResponseEntity.ok(new MessageResponse("Status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable String id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok(new MessageResponse("Booking deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
