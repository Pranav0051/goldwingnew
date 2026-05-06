package com.premiumadventure.backend.repository;

import com.premiumadventure.backend.model.Booking;
import com.premiumadventure.backend.model.GUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(GUser GUser);

    Optional<Booking> findByBookingId(String bookingId);

    Optional<Booking> findByTransactionId(String transactionId);

    List<Booking> findByAgentRef(String agentRef);

    List<Booking> findByBookingDateAndStatusIn(LocalDate bookingDate, List<com.premiumadventure.backend.model.BookingStatus> statuses);
}
