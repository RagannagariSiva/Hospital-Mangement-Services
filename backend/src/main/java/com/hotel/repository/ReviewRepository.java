package com.hotel.repository;

import com.hotel.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRoomId(Long roomId);
    Page<Review> findByRoomId(Long roomId, Pageable pageable);
    boolean existsByUserIdAndBookingId(Long userId, Long bookingId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.room.id = :roomId")
    Double getAverageRatingByRoomId(@Param("roomId") Long roomId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.room.hotel.id = :hotelId")
    Double getAverageRatingByHotelId(@Param("hotelId") Long hotelId);
}
