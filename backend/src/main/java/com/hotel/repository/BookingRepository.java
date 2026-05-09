package com.hotel.repository;

import com.hotel.entity.Booking;
import com.hotel.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingReference(String ref);
    Page<Booking> findByCustomerId(Long customerId, Pageable pageable);
    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.room.id = :roomId " +
           "AND b.status NOT IN ('CANCELLED','CHECKED_OUT') " +
           "AND b.checkInDate < :checkOut AND b.checkOutDate > :checkIn")
    boolean existsConflictingBooking(@Param("roomId") Long roomId,
                                     @Param("checkIn") LocalDate checkIn,
                                     @Param("checkOut") LocalDate checkOut);

    @Query("SELECT COALESCE(SUM(b.totalAmount),0) FROM Booking b WHERE b.status='CHECKED_OUT'")
    BigDecimal getTotalRevenue();

    @Query("SELECT COALESCE(SUM(b.totalAmount),0) FROM Booking b WHERE b.status='CHECKED_OUT' " +
           "AND MONTH(b.createdAt)=MONTH(CURRENT_DATE) AND YEAR(b.createdAt)=YEAR(CURRENT_DATE)")
    BigDecimal getMonthlyRevenue();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status IN ('CONFIRMED','CHECKED_IN')")
    long countActiveBookings();

    @Query("SELECT MONTH(b.createdAt), YEAR(b.createdAt), COUNT(b), SUM(b.totalAmount) " +
           "FROM Booking b WHERE b.status='CHECKED_OUT' " +
           "GROUP BY YEAR(b.createdAt), MONTH(b.createdAt) ORDER BY YEAR(b.createdAt) DESC, MONTH(b.createdAt) DESC")
    List<Object[]> getMonthlyStats();

    @Query("SELECT b.status, COUNT(b) FROM Booking b GROUP BY b.status")
    List<Object[]> getBookingsByStatus();
}
