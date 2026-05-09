package com.hotel.service;

import com.hotel.dto.request.RoomRequest;
import com.hotel.dto.response.RoomResponse;
import com.hotel.entity.*;
import com.hotel.exception.BadRequestException;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomService {

    private final RoomRepository    roomRepository;
    private final HotelRepository   hotelRepository;
    private final ReviewRepository  reviewRepository;

    public Page<RoomResponse> getRoomsByHotel(Long hotelId, Pageable pageable) {
        return roomRepository.findByHotelId(hotelId, pageable).map(this::toResponse);
    }

    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + id));
        return toResponse(room);
    }

    public List<RoomResponse> getAvailableRooms(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn))
            throw new BadRequestException("Check-out must be after check-in");
        return roomRepository.findAvailableRooms(hotelId, checkIn, checkOut)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Page<RoomResponse> searchRooms(String type, BigDecimal maxPrice, Integer capacity,
                                           LocalDate checkIn, LocalDate checkOut, Pageable pageable) {
        RoomType roomType = (type != null && !type.isBlank()) ? RoomType.valueOf(type.toUpperCase()) : null;
        return roomRepository.searchAvailableRooms(roomType, maxPrice, capacity, checkIn, checkOut, pageable)
                .map(this::toResponse);
    }

    @Transactional
    @CacheEvict(value = "rooms", allEntries = true)
    public RoomResponse createRoom(RoomRequest request) {
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found: " + request.getHotelId()));
        Room room = Room.builder()
                .hotel(hotel)
                .roomNumber(request.getRoomNumber())
                .roomType(RoomType.valueOf(request.getRoomType().toUpperCase()))
                .capacity(request.getCapacity())
                .basePrice(request.getBasePrice())
                .currentPrice(request.getBasePrice())
                .floorNumber(request.getFloorNumber() != null ? request.getFloorNumber() : 1)
                .imageUrl(request.getImageUrl())
                .description(request.getDescription())
                .amenities(request.getAmenities() != null ? request.getAmenities() : new java.util.HashSet<>())
                .status(RoomStatus.AVAILABLE)
                .build();
        return toResponse(roomRepository.save(room));
    }

    @Transactional
    @CacheEvict(value = "rooms", allEntries = true)
    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + id));
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(RoomType.valueOf(request.getRoomType().toUpperCase()));
        room.setCapacity(request.getCapacity());
        room.setBasePrice(request.getBasePrice());
        if (request.getFloorNumber() != null) room.setFloorNumber(request.getFloorNumber());
        if (request.getImageUrl()    != null) room.setImageUrl(request.getImageUrl());
        if (request.getDescription() != null) room.setDescription(request.getDescription());
        if (request.getAmenities()   != null) room.setAmenities(request.getAmenities());
        return toResponse(roomRepository.save(room));
    }

    @Transactional
    public RoomResponse updateRoomStatus(Long id, String status) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + id));
        room.setStatus(RoomStatus.valueOf(status.toUpperCase()));
        return toResponse(roomRepository.save(room));
    }

    /** Dynamic pricing — runs every hour */
    @Scheduled(fixedRate = 3_600_000)
    @Transactional
    public void applyDynamicPricing() {
        List<Hotel> hotels = hotelRepository.findByActiveTrue();
        for (Hotel hotel : hotels) {
            long total = roomRepository.countByHotelId(hotel.getId());
            if (total == 0) continue;
            long occupied = roomRepository.countByHotelIdAndStatus(hotel.getId(), RoomStatus.OCCUPIED);
            double rate   = (double) occupied / total;
            List<Room> rooms = roomRepository.findByHotelId(hotel.getId());
            for (Room room : rooms) {
                BigDecimal base = room.getBasePrice();
                BigDecimal newPrice;
                if (rate > 0.7)      newPrice = base.multiply(BigDecimal.valueOf(1.20));
                else if (rate < 0.3) newPrice = base.multiply(BigDecimal.valueOf(0.90));
                else                 newPrice = base;
                room.setCurrentPrice(newPrice.setScale(2, RoundingMode.HALF_UP));
            }
            roomRepository.saveAll(rooms);
        }
        log.debug("Dynamic pricing applied to {} hotels", hotels.size());
    }

    public RoomResponse toResponse(Room room) {
        Double avgRating = reviewRepository.getAverageRatingByRoomId(room.getId());
        int reviewCount  = reviewRepository.findByRoomId(room.getId()).size();
        return RoomResponse.builder()
                .id(room.getId())
                .hotelId(room.getHotel().getId())
                .hotelName(room.getHotel().getName())
                .hotelCity(room.getHotel().getCity())
                .roomNumber(room.getRoomNumber())
                .roomType(room.getRoomType().name())
                .capacity(room.getCapacity())
                .basePrice(room.getBasePrice())
                .currentPrice(room.getCurrentPrice())
                .floorNumber(room.getFloorNumber())
                .imageUrl(room.getImageUrl())
                .description(room.getDescription())
                .amenities(room.getAmenities())
                .status(room.getStatus().name())
                .averageRating(avgRating)
                .reviewCount(reviewCount)
                .build();
    }
}
