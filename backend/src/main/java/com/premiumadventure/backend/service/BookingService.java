package com.premiumadventure.backend.service;

import com.premiumadventure.backend.model.*;
import com.premiumadventure.backend.payload.request.BookingRequest;
import com.premiumadventure.backend.payload.request.PaymentVerificationRequest;
import com.premiumadventure.backend.repository.BookingRepository;
import com.premiumadventure.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RazorpayService razorpayService;

    @Transactional
    public Booking createBooking(BookingRequest request) throws Exception {
        Booking booking = new Booking();
        booking.setBookingId("GW-" + (100000 + new Random().nextInt(900000)));
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setCustomerCity(request.getCustomerCity());
        booking.setCategory(request.getCategory());
        booking.setPackageId(request.getPackageId());
        booking.setPackageName(request.getPackageName());
        booking.setBookingDate(LocalDate.parse(request.getBookingDate()));
        booking.setSlot(request.getSlot());
        booking.setLocation(request.getLocation());
        booking.setPersons(request.getPassengers().size());
        booking.setTotalAmount(request.getAmount());
        booking.setAgentRef(request.getAgentRef());
        booking.setPaymentMethod(request.getPaymentMethod());

        if ("POINTS".equalsIgnoreCase(request.getPaymentMethod())) {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                String username = ((UserDetails) principal).getUsername();
                GUser GUser = userRepository.findByUsername(username).orElseThrow(() -> new Exception("GUser not found"));
                if (GUser.getWalletBalance() < request.getAmount()) {
                    throw new Exception("Insufficient points balance. You have " + GUser.getWalletBalance() + " points.");
                }
                GUser.setWalletBalance(GUser.getWalletBalance() - request.getAmount());
                userRepository.save(GUser);

                booking.setStatus(BookingStatus.CONFIRMED);
                booking.setPaymentId("POINTS-" + System.currentTimeMillis());
            } else {
                throw new Exception("Authentication required for Points payment.");
            }
        } else if (request.getPaymentId() != null && !request.getPaymentId().isEmpty()) {
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setPaymentId(request.getPaymentId());
            creditCommission(booking);
        } else {
            booking.setStatus(BookingStatus.PENDING);
        }

        // Map passengers
        Booking finalBooking = booking;
        List<Passenger> passengers = request.getPassengers().stream().map(pDto -> {
            Passenger p = new Passenger();
            p.setName(pDto.getName());
            p.setAge(pDto.getAge());
            p.setWeight(pDto.getWeight());
            p.setGender(pDto.getGender());
            p.setBooking(finalBooking);
            return p;
        }).collect(Collectors.toList());
        booking.setPassengers(passengers);

        // Associate with logged-in GUser if available
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            userRepository.findByUsername(username).ifPresent(booking::setUser);
        }

        // Create Razorpay Order
        if (request.getPaymentId() == null || request.getPaymentId().isEmpty()) {
            if (request.getPaymentMethod() == null || request.getPaymentMethod().equals("ONLINE") || request.getPaymentMethod().equalsIgnoreCase("Razorpay") || request.getPaymentMethod().equalsIgnoreCase("UPI") || request.getPaymentMethod().equalsIgnoreCase("Card")) {
                try {
                    com.razorpay.Order order = razorpayService.createOrder(
                        booking.getTotalAmount(), 
                        "INR", 
                        booking.getBookingId()
                    );
                    booking.setTransactionId(order.get("id").toString());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        return bookingRepository.save(booking);
    }

    @Transactional
    public boolean verifyAndConfirmPayment(PaymentVerificationRequest request) {
        boolean isValid = false;
        try {
            isValid = razorpayService.verifyPaymentSignature(
                request.getTransactionId(), // orderId
                request.getPaymentId(),
                request.getSignature() // signature
            );
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (isValid) {
            bookingRepository.findByTransactionId(request.getTransactionId()).ifPresent(booking -> {
                booking.setStatus(BookingStatus.CONFIRMED);
                booking.setPaymentId(request.getPaymentId() != null ? request.getPaymentId() : "FED-PAY-" + System.currentTimeMillis());
                bookingRepository.save(booking);
                creditCommission(booking);
            });
            return true;
        }
        return false;
    }

    public List<Booking> getMyBookings() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            GUser GUser = userRepository.findByUsername(username).orElseThrow();
            return bookingRepository.findByUser(GUser);
        }
        return List.of();
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByAgent(String agentRef) {
        return bookingRepository.findByAgentRef(agentRef);
    }

    public Optional<Booking> getBookingByBookingId(String bookingId) {
        return bookingRepository.findByBookingId(bookingId);
    }

    @Transactional
    public void updateStatus(String bookingId, String status) {
        bookingRepository.findByBookingId(bookingId).ifPresent(booking -> {
            BookingStatus oldStatus = booking.getStatus();
            BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());
            booking.setStatus(newStatus);
            bookingRepository.save(booking);
            
            if (oldStatus != BookingStatus.CONFIRMED && newStatus == BookingStatus.CONFIRMED) {
                creditCommission(booking);
            }
        });
    }

    private void creditCommission(Booking booking) {
        if (booking.getAgentRef() != null && !booking.getAgentRef().isEmpty()) {
            // Points are earned on non-POINTS payments
            if (!"POINTS".equalsIgnoreCase(booking.getPaymentMethod())) {
                userRepository.findByAgentId(booking.getAgentRef()).ifPresent(agent -> {
                    double commission = (booking.getPersons() != null ? booking.getPersons() : 1) * 200.0;
                    agent.setWalletBalance(agent.getWalletBalance() + commission);
                    userRepository.save(agent);
                });
            }
        }
    }

    @Transactional
    public void deleteBooking(String bookingId) {
        bookingRepository.findByBookingId(bookingId).ifPresent(booking -> {
            bookingRepository.delete(booking);
        });
    }
}
