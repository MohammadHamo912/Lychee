package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.Review;
import com.mohammad.lychee.lychee.repository.ReviewRepository;
import com.mohammad.lychee.lychee.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;


    @Override
    public Review addReview(Review review) {
       return reviewRepository.addReview(review);
    }

    @Override
    public List<Review> getReviewsByTypeAndTarget(String type, int targetId) {
        return reviewRepository.getReviewsByTypeAndTarget(type, targetId);
    }
    @Override
    public List<Review> getReviewsByUserId(int userId) {
        return reviewRepository.getReviewsByUserId(userId);
    }
    @Override
    public void deleteReview(int reviewId) {
        reviewRepository.deleteReview(reviewId);
    }

}

