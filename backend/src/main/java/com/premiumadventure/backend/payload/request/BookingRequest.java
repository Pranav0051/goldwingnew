package com.premiumadventure.backend.payload.request;

import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerCity;
    private String category;
    private String packageId;
    private String packageName;
    private String bookingDate;
    private String slot;
    private String location;
    private Double amount;
    private String paymentMethod;
    private String paymentId;
    private String agentRef;
    private List<PassengerDTO> passengers;

    @Data
    public static class PassengerDTO {
        private String name;
        private Integer age;
        private Integer weight;
        private String gender;
    }
}
