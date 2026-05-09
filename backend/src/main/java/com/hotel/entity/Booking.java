package com.hotel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_booking_customer", columnList = "customer_id"),
    @Index(name = "idx_booking_room", columnList = "room_id"),
    @Index(name = "idx_booking_ref", columnList = "bookingReference"),
    @Index(name = "idx_booking_dates", columnList = "checkInDate,checkOutDate")
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String bookingReference;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private User customer;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private Room room;
    @Column(nullable = false) private LocalDate checkInDate;
    @Column(nullable = false) private LocalDate checkOutDate;
    private Integer numberOfGuests;
    @Column(precision = 10, scale = 2) private BigDecimal totalAmount;
    @Column(precision = 10, scale = 2) private BigDecimal paidAmount;
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;
    private String specialRequests;
    private LocalDateTime checkedInAt;
    private LocalDateTime checkedOutAt;
    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private Payment payment;
}
