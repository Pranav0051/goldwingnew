package com.premiumadventure.backend.controller;

import com.premiumadventure.backend.model.Booking;
import com.premiumadventure.backend.model.BookingStatus;
import com.premiumadventure.backend.model.FlightSlot;
import com.premiumadventure.backend.repository.BookingRepository;
import com.premiumadventure.backend.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/slots")
public class SlotController {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping
    public ResponseEntity<List<FlightSlot>> getAllSlots() {
        return ResponseEntity.ok(slotRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<FlightSlot> addOrUpdateSlot(@RequestBody FlightSlot slot) {
        Optional<FlightSlot> existing = slotRepository.findByTime(slot.getTime());
        if (existing.isPresent()) {
            FlightSlot update = existing.get();
            update.setCapacity(slot.getCapacity());
            return ResponseEntity.ok(slotRepository.save(update));
        }
        return ResponseEntity.ok(slotRepository.save(slot));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id) {
        slotRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/availability")
    public ResponseEntity<?> getAvailability(@RequestParam String date) {
        try {
            LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
            
            List<FlightSlot> slots = slotRepository.findAll();
            if (slots.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            List<BookingStatus> activeStatuses = Arrays.asList(
                BookingStatus.PENDING, 
                BookingStatus.PAID, 
                BookingStatus.CONFIRMED,
                BookingStatus.COMPLETED
            );
            
            List<Booking> bookingsForDate = bookingRepository.findByBookingDateAndStatusIn(localDate, activeStatuses);
            
            List<Map<String, Object>> availability = new ArrayList<>();
            
            for (FlightSlot slot : slots) {
                int bookedSeats = 0;
                for (Booking b : bookingsForDate) {
                    if (slot.getTime() != null && slot.getTime().equals(b.getSlot())) {
                        bookedSeats += b.getPersons() != null ? b.getPersons() : 0;
                    }
                }
                int availableSeats = Math.max(0, slot.getCapacity() - bookedSeats);
                
                Map<String, Object> map = new HashMap<>();
                map.put("id", slot.getId());
                map.put("time", slot.getTime());
                map.put("totalSeats", slot.getCapacity());
                map.put("bookedSeats", bookedSeats);
                map.put("availableSeats", availableSeats);
                availability.add(map);
            }
            
            // Sort slots by time (Handling AM/PM correctly)
            availability.sort((a, b) -> {
                String t1 = (String) a.get("time");
                String t2 = (String) b.get("time");
                if (t1 == null || t2 == null) return 0;
                return parseTime(t1).compareTo(parseTime(t2));
            });
            
            return ResponseEntity.ok(availability);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date format or processing error: " + e.getMessage());
        }
    }

    private java.time.LocalTime parseTime(String timeStr) {
        try {
            return java.time.LocalTime.parse(timeStr, DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH));
        } catch (Exception e) {
            return java.time.LocalTime.MIDNIGHT;
        }
    }
}
