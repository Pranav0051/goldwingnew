package com.premiumadventure.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String bookingId; // e.g., GW-123456

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private GUser user;

    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerCity;

    private String category; // SINGLE, COUPLE, FAMILY, etc.
    private String packageId;
    private String packageName;

    private LocalDate bookingDate;
    private String slot; // e.g., 06:00 AM

    private String location;
    private Integer persons;
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private String paymentId;
    private String transactionId;
    private String agentRef;
    private String paymentMethod;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Passenger> passengers = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
