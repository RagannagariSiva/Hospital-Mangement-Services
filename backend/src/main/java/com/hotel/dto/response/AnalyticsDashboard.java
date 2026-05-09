package com.hotel.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AnalyticsDashboard {
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private Long totalBookings;
    private Long activeBookings;
    private Long totalUsers;
    private Long totalRooms;
    private Double occupancyRate;
    private List<Map<String, Object>> revenueByMonth;
    private List<Map<String, Object>> bookingsByStatus;
    private List<Map<String, Object>> topHotels;
}
