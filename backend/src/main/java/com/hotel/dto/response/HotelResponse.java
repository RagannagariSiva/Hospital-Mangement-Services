package com.hotel.dto.response;

import lombok.*;
import java.util.Set;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class HotelResponse {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String country;
    private String phone;
    private String email;
    private Integer starRating;
    private String imageUrl;
    private Set<String> amenities;
    private boolean active;
    private int totalRooms;
    private int availableRooms;
    private Double averageRating;
}
