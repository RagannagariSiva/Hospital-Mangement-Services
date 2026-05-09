package com.hotel.service;

import com.hotel.entity.Booking;
import com.hotel.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    public void sendBookingConfirmation(User user, Booking booking) {
        log.info("Email [BOOKING CONFIRMATION] to: {}", user.getEmail());
    }

    public void sendBookingConfirmation(String to, String guestName, String bookingRef, String checkIn, String checkOut, String roomName, double totalAmount) {
        log.info("Email [BOOKING CONFIRMATION] to: {}", to);
    }

    public void sendCheckoutConfirmation(User user, Booking booking) {
        log.info("Email [CHECKOUT] to: {}", user.getEmail());
    }

    public void sendCancellationEmail(User user, Booking booking) {
        log.info("Email [CANCELLATION] to: {}", user.getEmail());
    }

    public void sendCancellationEmail(String to, String guestName, String bookingRef) {
        log.info("Email [CANCELLATION] to: {}", to);
    }

    public void sendWelcomeEmail(String to, String firstName) {
        log.info("Email [WELCOME] to: {}", to);
    }

    public void sendPasswordResetEmail(String to, String resetToken) {
        log.info("Email [PASSWORD RESET] to: {}", to);
    }

    public void sendCheckInReminder(String to, String guestName, String hotelName) {
        log.info("Email [CHECK-IN REMINDER] to: {}", to);
    }
}
