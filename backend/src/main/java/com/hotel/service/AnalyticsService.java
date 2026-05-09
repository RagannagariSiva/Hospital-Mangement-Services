package com.hotel.service;

import com.hotel.dto.response.AnalyticsDashboard;
import com.hotel.entity.RoomStatus;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final BookingRepository bookingRepository;
    private final UserRepository    userRepository;
    private final RoomRepository    roomRepository;

    public AnalyticsDashboard getDashboard() {
        BigDecimal totalRevenue   = bookingRepository.getTotalRevenue();
        BigDecimal monthlyRevenue = bookingRepository.getMonthlyRevenue();
        long totalBookings  = bookingRepository.count();
        long activeBookings = bookingRepository.countActiveBookings();
        long totalUsers     = userRepository.count();
        long totalRooms     = roomRepository.count();
        long occupiedRooms  = roomRepository.countByStatus(RoomStatus.OCCUPIED);
        double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0;

        List<Object[]> monthlyRaw = bookingRepository.getMonthlyStats();
        List<Map<String, Object>> revenueByMonth = new ArrayList<>();
        for (Object[] row : monthlyRaw) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("month",    row[0]);
            m.put("year",     row[1]);
            m.put("bookings", row[2]);
            m.put("revenue",  row[3] != null ? row[3] : BigDecimal.ZERO);
            revenueByMonth.add(m);
        }

        List<Object[]> statusRaw = bookingRepository.getBookingsByStatus();
        List<Map<String, Object>> bookingsByStatus = new ArrayList<>();
        for (Object[] row : statusRaw) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("status", row[0].toString());
            m.put("count",  row[1]);
            bookingsByStatus.add(m);
        }

        return AnalyticsDashboard.builder()
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .totalBookings(totalBookings)
                .activeBookings(activeBookings)
                .totalUsers(totalUsers)
                .totalRooms(totalRooms)
                .occupancyRate(Math.round(occupancyRate * 10.0) / 10.0)
                .revenueByMonth(revenueByMonth)
                .bookingsByStatus(bookingsByStatus)
                .build();
    }
}
