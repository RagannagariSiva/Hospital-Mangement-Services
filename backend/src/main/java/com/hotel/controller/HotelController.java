package com.hotel.controller;

import com.hotel.dto.request.HotelRequest;
import com.hotel.dto.response.ApiResponse;
import com.hotel.dto.response.HotelResponse;
import com.hotel.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<HotelResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        Page<HotelResponse> hotels = hotelService.getAllHotels(
                PageRequest.of(page, size, Sort.by(sortBy)));
        return ResponseEntity.ok(ApiResponse.success(hotels));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<HotelResponse>>> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<HotelResponse> hotels = hotelService.searchHotels(city, country,
                PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(hotels));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HotelResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(hotelService.getHotelById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<HotelResponse>> create(@Valid @RequestBody HotelRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Hotel created", hotelService.createHotel(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<HotelResponse>> update(@PathVariable Long id,
                                                              @Valid @RequestBody HotelRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Hotel updated", hotelService.updateHotel(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok(ApiResponse.success("Hotel deleted", null));
    }
}
