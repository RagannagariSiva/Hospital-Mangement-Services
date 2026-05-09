package com.hotel.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.Set;

@Data
public class HotelRequest {
    @NotBlank private String name;
    private String description;
    @NotBlank private String address;
    @NotBlank private String city;
    @NotBlank private String country;
    private String phone;
    private String email;
    @Min(1) @Max(5) private Integer starRating;
    private String imageUrl;
    private Set<String> amenities;
}
