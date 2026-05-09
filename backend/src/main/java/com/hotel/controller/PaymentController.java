package com.hotel.controller;

import com.hotel.dto.request.PaymentRequest;
import com.hotel.dto.response.ApiResponse;
import com.hotel.dto.response.PaymentResponse;
import com.hotel.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> process(@Valid @RequestBody PaymentRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Payment processed", paymentService.processPayment(req)));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentByBooking(bookingId)));
    }
}
