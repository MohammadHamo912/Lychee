package com.mohammad.lychee.lychee.model;

import java.time.LocalDateTime;

public class Review {
    private int reviewId;
    private String reviewType; // "product" or "shop"
    private int targetId;
    private int userId;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private String targetName;

    public String getTargetName() {
        return targetName;
    }
    public void setTargetName(String targetName) {
        this.targetName = targetName;
    }

    public int getReviewId() { return reviewId; }
    public void setReviewId(int reviewId) { this.reviewId = reviewId; }

    public String getReviewType() { return reviewType; }
    public void setReviewType(String reviewType) { this.reviewType = reviewType; }

    public int getTargetId() { return targetId; }
    public void setTargetId(int targetId) { this.targetId = targetId; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
