package com.hotel.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequest {
    @NotNull private Long roomId;
    @NotNull private LocalDate checkInDate;
    @NotNull private LocalDate checkOutDate;
    @Min(1) private Integer numberOfGuests;
    private String specialRequests;
}
