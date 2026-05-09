package com.hotel.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Set;

@Data
public class RoomRequest {
    @NotNull private Long hotelId;
    @NotBlank private String roomNumber;
    @NotNull private String roomType;
    @Min(1) private Integer capacity;
    @NotNull @DecimalMin("0.0") private BigDecimal basePrice;
    private Integer floorNumber;
    private String imageUrl;
    private String description;
    private Set<String> amenities;
}
