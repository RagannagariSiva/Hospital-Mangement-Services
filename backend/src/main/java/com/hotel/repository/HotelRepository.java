package com.hotel.repository;

import com.hotel.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    Page<Hotel> findByActiveTrue(Pageable pageable);
    List<Hotel> findByActiveTrue();

    @Query("SELECT h FROM Hotel h WHERE h.active = true " +
           "AND (:city IS NULL OR LOWER(h.city) LIKE LOWER(CONCAT('%',:city,'%'))) " +
           "AND (:country IS NULL OR LOWER(h.country) LIKE LOWER(CONCAT('%',:country,'%')))")
    Page<Hotel> searchHotels(@Param("city") String city, @Param("country") String country, Pageable pageable);
}
