package com.hotel.service;

import com.hotel.dto.request.BookingRequest;
import com.hotel.dto.response.BookingResponse;
import com.hotel.entity.*;
import com.hotel.exception.BadRequestException;
import com.hotel.exception.ConflictException;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public BookingResponse createBooking(BookingRequest request, Long customerId) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("Check-out must be after check-in");
        }
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        if (room.getStatus() != RoomStatus.AVAILABLE) {
            throw new BadRequestException("Room is not available");
        }
        if (bookingRepository.existsConflictingBooking(request.getRoomId(),
                request.getCheckInDate(), request.getCheckOutDate())) {
            throw new ConflictException("Room is already booked for selected dates");
        }
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal price = room.getCurrentPrice() != null ? room.getCurrentPrice() : room.getBasePrice();
        BigDecimal totalAmount = price.multiply(BigDecimal.valueOf(nights));

        Booking booking = Booking.builder()
                .bookingReference("BK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .customer(customer).room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numberOfGuests(request.getNumberOfGuests())
                .totalAmount(totalAmount)
                .paidAmount(BigDecimal.ZERO)
                .status(BookingStatus.PENDING)
                .specialRequests(request.getSpecialRequests())
                .build();

        booking = bookingRepository.save(booking);
        emailService.sendBookingConfirmation(customer, booking);
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse confirmBooking(Long id) {
        Booking b = getEntity(id);
        b.setStatus(BookingStatus.CONFIRMED);
        return toResponse(bookingRepository.save(b));
    }

    @Transactional
    public BookingResponse checkIn(Long id) {
        Booking b = getEntity(id);
        if (b.getStatus() != BookingStatus.CONFIRMED)
            throw new BadRequestException("Booking must be confirmed before check-in");
        b.setStatus(BookingStatus.CHECKED_IN);
        b.setCheckedInAt(LocalDateTime.now());
        b.getRoom().setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(b.getRoom());
        return toResponse(bookingRepository.save(b));
    }

    @Transactional
    public BookingResponse checkOut(Long id) {
        Booking b = getEntity(id);
        if (b.getStatus() != BookingStatus.CHECKED_IN)
            throw new BadRequestException("Booking must be checked in first");
        b.setStatus(BookingStatus.CHECKED_OUT);
        b.setCheckedOutAt(LocalDateTime.now());
        b.getRoom().setStatus(RoomStatus.AVAILABLE);
        roomRepository.save(b.getRoom());
        emailService.sendCheckoutConfirmation(b.getCustomer(), b);
        return toResponse(bookingRepository.save(b));
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, Long userId) {
        Booking b = getEntity(id);
        if (!b.getCustomer().getId().equals(userId))
            throw new BadRequestException("Unauthorized to cancel this booking");
        if (b.getStatus() == BookingStatus.CHECKED_IN || b.getStatus() == BookingStatus.CHECKED_OUT)
            throw new BadRequestException("Cannot cancel an active or completed booking");
        b.setStatus(BookingStatus.CANCELLED);
        emailService.sendCancellationEmail(b.getCustomer(), b);
        return toResponse(bookingRepository.save(b));
    }

    public BookingResponse getBookingById(Long id) { return toResponse(getEntity(id)); }

    public BookingResponse getBookingByReference(String ref) {
        return toResponse(bookingRepository.findByBookingReference(ref)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + ref)));
    }

    public Page<BookingResponse> getCustomerBookings(Long customerId, Pageable pageable) {
        return bookingRepository.findByCustomerId(customerId, pageable).map(this::toResponse);
    }

    public Page<BookingResponse> getAllBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable).map(this::toResponse);
    }

    public Page<BookingResponse> getBookingsByStatus(String status, Pageable pageable) {
        return bookingRepository.findByStatus(BookingStatus.valueOf(status.toUpperCase()), pageable)
                .map(this::toResponse);
    }

    private Booking getEntity(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));
    }

    public BookingResponse toResponse(Booking b) {
        long nights = ChronoUnit.DAYS.between(b.getCheckInDate(), b.getCheckOutDate());
        return BookingResponse.builder()
                .id(b.getId()).bookingReference(b.getBookingReference())
                .customerId(b.getCustomer().getId())
                .customerName(b.getCustomer().getFirstName() + " " + b.getCustomer().getLastName())
                .customerEmail(b.getCustomer().getEmail())
                .roomId(b.getRoom().getId()).roomNumber(b.getRoom().getRoomNumber())
                .roomType(b.getRoom().getRoomType().name())
                .hotelName(b.getRoom().getHotel().getName()).hotelCity(b.getRoom().getHotel().getCity())
                .checkInDate(b.getCheckInDate()).checkOutDate(b.getCheckOutDate())
                .numberOfNights((int) nights).numberOfGuests(b.getNumberOfGuests())
                .totalAmount(b.getTotalAmount()).paidAmount(b.getPaidAmount())
                .status(b.getStatus().name()).specialRequests(b.getSpecialRequests())
                .checkedInAt(b.getCheckedInAt()).checkedOutAt(b.getCheckedOutAt())
                .createdAt(b.getCreatedAt()).build();
    }
}
