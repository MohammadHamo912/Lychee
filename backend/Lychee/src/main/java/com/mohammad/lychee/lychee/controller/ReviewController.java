package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Review;
import com.mohammad.lychee.lychee.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Review review) {
        reviewService.addReview(review);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{type}/{targetId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable String type,
                                                   @PathVariable int targetId) {
        return ResponseEntity.ok(reviewService.getReviewsByTypeAndTarget(type, targetId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable int userId) {
        List<Review> userReviews = reviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(userReviews);
    }
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable int reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }

}
