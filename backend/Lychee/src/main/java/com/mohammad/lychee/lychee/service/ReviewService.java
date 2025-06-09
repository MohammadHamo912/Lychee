package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.Review;
import java.util.List;
import java.util.Map;

public interface ReviewService {
    void addReview(Review review);
    List<Review> getReviewsByTypeAndTarget(String type, int targetId);
    List<Review> getReviewsByUserId(int userId);
    public void deleteReview(int reviewId);


}
