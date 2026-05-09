package com.hotel.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.Set;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RoomResponse {
    private Long id;
    private Long hotelId;
    private String hotelName;
    private String hotelCity;
    private String roomNumber;
    private String roomType;
    private Integer capacity;
    private BigDecimal basePrice;
    private BigDecimal currentPrice;
    private Integer floorNumber;
    private String imageUrl;
    private String description;
    private Set<String> amenities;
    private String status;
    private Double averageRating;
    private int reviewCount;
}
