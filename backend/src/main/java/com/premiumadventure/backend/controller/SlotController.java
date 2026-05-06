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
@CrossOrigin(origins = "*")
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
    public ResponseEntity<List<Map<String, Object>>> getAvailability(@RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
        
        List<FlightSlot> slots = slotRepository.findAll();
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
                if (slot.getTime().equals(b.getSlot())) {
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
        
        // Sort slots by time (naive approach, assumes HH:MM AM/PM)
        availability.sort((a, b) -> ((String)a.get("time")).compareTo((String)b.get("time")));
        
        return ResponseEntity.ok(availability);
    }
}
