package com.hotel.repository;

import com.hotel.entity.Room;
import com.hotel.entity.RoomStatus;
import com.hotel.entity.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotelId(Long hotelId);
    Page<Room> findByHotelId(Long hotelId, Pageable pageable);
    long countByHotelId(Long hotelId);
    long countByHotelIdAndStatus(Long hotelId, RoomStatus status);
    long countByStatus(RoomStatus status);

    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.status = 'AVAILABLE' " +
           "AND r.id NOT IN (SELECT b.room.id FROM Booking b " +
           "WHERE b.status NOT IN ('CANCELLED','CHECKED_OUT') " +
           "AND b.checkInDate < :checkOut AND b.checkOutDate > :checkIn)")
    List<Room> findAvailableRooms(@Param("hotelId") Long hotelId,
                                   @Param("checkIn") LocalDate checkIn,
                                   @Param("checkOut") LocalDate checkOut);

    @Query("SELECT r FROM Room r WHERE r.status = 'AVAILABLE' " +
           "AND (:type IS NULL OR r.roomType = :type) " +
           "AND (:maxPrice IS NULL OR r.currentPrice <= :maxPrice) " +
           "AND (:capacity IS NULL OR r.capacity >= :capacity) " +
           "AND r.id NOT IN (SELECT b.room.id FROM Booking b " +
           "WHERE b.status NOT IN ('CANCELLED','CHECKED_OUT') " +
           "AND b.checkInDate < :checkOut AND b.checkOutDate > :checkIn)")
    Page<Room> searchAvailableRooms(@Param("type") RoomType type,
                                     @Param("maxPrice") BigDecimal maxPrice,
                                     @Param("capacity") Integer capacity,
                                     @Param("checkIn") LocalDate checkIn,
                                     @Param("checkOut") LocalDate checkOut,
                                     Pageable pageable);
}
