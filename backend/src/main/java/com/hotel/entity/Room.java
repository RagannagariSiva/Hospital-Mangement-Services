package com.hotel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "rooms", indexes = {
    @Index(name = "idx_room_hotel", columnList = "hotel_id"),
    @Index(name = "idx_room_type", columnList = "roomType"),
    @Index(name = "idx_room_status", columnList = "status")
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Room {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private Hotel hotel;
    @Column(nullable = false) private String roomNumber;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private RoomType roomType;
    private Integer capacity;
    @Column(precision = 10, scale = 2) private BigDecimal basePrice;
    @Column(precision = 10, scale = 2) private BigDecimal currentPrice;
    private Integer floorNumber;
    private String imageUrl;
    @Column(columnDefinition = "TEXT") private String description;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "room_amenities", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "amenity")
    private Set<String> amenities = new HashSet<>();
    @Enumerated(EnumType.STRING)
    private RoomStatus status = RoomStatus.AVAILABLE;
    @CreationTimestamp private LocalDateTime createdAt;
    @UpdateTimestamp private LocalDateTime updatedAt;
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private List<Booking> bookings;
}
