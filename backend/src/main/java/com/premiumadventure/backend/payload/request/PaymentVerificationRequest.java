package com.premiumadventure.backend.payload.request;

import lombok.Data;

@Data
public class PaymentVerificationRequest {
    private String transactionId;
    private String paymentId;
    private String status;
    private String signature;
}
