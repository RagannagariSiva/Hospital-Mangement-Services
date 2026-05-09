package com.hotel.service;

import com.hotel.dto.request.HotelRequest;
import com.hotel.dto.response.HotelResponse;
import com.hotel.entity.Hotel;
import com.hotel.entity.RoomStatus;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.ReviewRepository;
import com.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository  roomRepository;
    private final ReviewRepository reviewRepository;

    @Cacheable(value = "hotels", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<HotelResponse> getAllHotels(Pageable pageable) {
        return hotelRepository.findByActiveTrue(pageable).map(this::toResponse);
    }

    public Page<HotelResponse> searchHotels(String city, String country, Pageable pageable) {
        return hotelRepository.searchHotels(city, country, pageable).map(this::toResponse);
    }

    public HotelResponse getHotelById(Long id) {
        return toResponse(hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found: " + id)));
    }

    @Transactional @CacheEvict(value = "hotels", allEntries = true)
    public HotelResponse createHotel(HotelRequest req) {
        Hotel hotel = Hotel.builder()
                .name(req.getName()).description(req.getDescription())
                .address(req.getAddress()).city(req.getCity()).country(req.getCountry())
                .phone(req.getPhone()).email(req.getEmail())
                .starRating(req.getStarRating()).imageUrl(req.getImageUrl())
                .amenities(req.getAmenities()).active(true).build();
        return toResponse(hotelRepository.save(hotel));
    }

    @Transactional @CacheEvict(value = "hotels", allEntries = true)
    public HotelResponse updateHotel(Long id, HotelRequest req) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found: " + id));
        hotel.setName(req.getName()); hotel.setDescription(req.getDescription());
        hotel.setAddress(req.getAddress()); hotel.setCity(req.getCity()); hotel.setCountry(req.getCountry());
        hotel.setPhone(req.getPhone()); hotel.setEmail(req.getEmail());
        hotel.setStarRating(req.getStarRating()); hotel.setImageUrl(req.getImageUrl());
        hotel.setAmenities(req.getAmenities());
        return toResponse(hotelRepository.save(hotel));
    }

    @Transactional @CacheEvict(value = "hotels", allEntries = true)
    public void deleteHotel(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found: " + id));
        hotel.setActive(false);
        hotelRepository.save(hotel);
    }

    private HotelResponse toResponse(Hotel h) {
        long total     = roomRepository.countByHotelId(h.getId());
        long available = roomRepository.countByHotelIdAndStatus(h.getId(), RoomStatus.AVAILABLE);
        Double avgRating = reviewRepository.getAverageRatingByHotelId(h.getId());
        return HotelResponse.builder()
                .id(h.getId()).name(h.getName()).description(h.getDescription())
                .address(h.getAddress()).city(h.getCity()).country(h.getCountry())
                .phone(h.getPhone()).email(h.getEmail()).starRating(h.getStarRating())
                .imageUrl(h.getImageUrl()).amenities(h.getAmenities()).active(h.isActive())
                .totalRooms((int) total).availableRooms((int) available)
                .averageRating(avgRating).build();
    }
}
