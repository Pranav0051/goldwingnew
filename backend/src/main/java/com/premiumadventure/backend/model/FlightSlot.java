package com.premiumadventure.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "flight_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String time; // e.g. "06:00 AM"

    private Integer capacity; // e.g. 20
}
