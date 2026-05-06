package com.premiumadventure.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class FederalBankService {

    @Value("${federalbank.merchant.id:}")
    private String merchantId;

    @Value("${federalbank.access.code:}")
    private String accessCode;

    @Value("${federalbank.working.key:}")
    private String workingKey;

    @Value("${federalbank.payment.url:https://uat.paymentgateway.com/transaction}")
    private String paymentUrl;

    /**
     * Generate AES Encrypted Payload for Federal Bank Payment Gateway (Mocking standard Worldline/CCAvenue params layout commonly used by banks)
     */
    public String createEncryptedRequest(String bookingId, Double amount, String redirectUrl, String cancelUrl) throws Exception {
        if (workingKey == null || workingKey.isEmpty()) {
            return "MOCK_FEDERAL_PAYLOAD_" + bookingId;
        }

        String plainText = "merchant_id=" + merchantId + 
                           "&order_id=" + bookingId + 
                           "&amount=" + amount + 
                           "&currency=INR" + 
                           "&redirect_url=" + redirectUrl + 
                           "&cancel_url=" + cancelUrl;

        return encrypt(plainText, workingKey);
    }

    /**
     * Verify payment status returned by Federal Bank callback
     */
    public boolean verifyPaymentSignature(String encryptedResponse) throws Exception {
        if (workingKey == null || workingKey.isEmpty()) {
            return true; // Mock success
        }
        
        String decryptedResponse = decrypt(encryptedResponse, workingKey);
        // Typical structure parses decryptedResponse and checks status=success
        return decryptedResponse.contains("status=Success") || decryptedResponse.contains("status=Y");
    }

    private String encrypt(String raw, String key) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(key.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);
        byte[] encrypted = cipher.doFinal(raw.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }

    private String decrypt(String encrypted, String key) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(key.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, keySpec);
        byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(encrypted));
        return new String(decrypted);
    }

    public String getPaymentUrl() {
        return paymentUrl;
    }
    
    public String getMerchantId() {
        return merchantId;
    }

    public String getAccessCode() {
        return accessCode;
    }
}
