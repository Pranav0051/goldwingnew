package com.premiumadventure.backend.repository;

import com.premiumadventure.backend.model.FlightSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SlotRepository extends JpaRepository<FlightSlot, Long> {
    Optional<FlightSlot> findByTime(String time);
}
