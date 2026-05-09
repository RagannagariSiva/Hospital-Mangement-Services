package com.hotel.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews", indexes = {
    @Index(name = "idx_review_room", columnList = "room_id"),
    @Index(name = "idx_review_user", columnList = "user_id")
})
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private Room room;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private Booking booking;
    @Column(nullable = false) private Integer rating;
    @Column(columnDefinition = "TEXT") private String comment;
    @CreationTimestamp private LocalDateTime createdAt;
}
