package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Review;
import java.util.List;

public interface ReviewRepository {
    void addReview(Review review);
    List<Review> getReviewsByTypeAndTarget(String type, int targetId);
    List<Review> getReviewsByUserId(int userId);
    public void deleteReview(int reviewId);

}
