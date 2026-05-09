package com.hotel.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull private Long bookingId;
    @NotBlank private String paymentMethod;
    private String transactionId;
}
