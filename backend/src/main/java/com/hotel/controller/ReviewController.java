package com.hotel.controller;

import com.hotel.dto.request.ReviewRequest;
import com.hotel.dto.response.ApiResponse;
import com.hotel.dto.response.ReviewResponse;
import com.hotel.security.UserPrincipal;
import com.hotel.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> create(@Valid @RequestBody ReviewRequest req,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success("Review submitted",
                reviewService.createReview(req, principal.getId())));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getRoomReviews(roomId)));
    }
}
