package com.hotel.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotNull private Long roomId;
    @NotNull private Long bookingId;
    @Min(1) @Max(5) @NotNull private Integer rating;
    private String comment;
}
