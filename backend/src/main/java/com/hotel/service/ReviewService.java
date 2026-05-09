package com.hotel.service;

import com.hotel.dto.request.ReviewRequest;
import com.hotel.dto.response.ReviewResponse;
import com.hotel.entity.*;
import com.hotel.exception.ConflictException;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public ReviewResponse createReview(ReviewRequest request, Long userId) {
        if (reviewRepository.existsByUserIdAndBookingId(userId, request.getBookingId())) {
            throw new ConflictException("You have already reviewed this booking");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Review review = Review.builder()
                .user(user).room(room).booking(booking)
                .rating(request.getRating()).comment(request.getComment())
                .build();
        return toResponse(reviewRepository.save(review));
    }

    public List<ReviewResponse> getRoomReviews(Long roomId) {
        return reviewRepository.findByRoomId(roomId).stream().map(this::toResponse).toList();
    }

    private ReviewResponse toResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .userName(r.getUser().getFirstName() + " " + r.getUser().getLastName())
                .roomId(r.getRoom().getId())
                .roomNumber(r.getRoom().getRoomNumber())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
