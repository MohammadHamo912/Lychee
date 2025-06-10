package com.mohammad.lychee.lychee.model;

import java.time.LocalDateTime;

public class Review {
    private int review_id;
    private String review_type; // "product" or "shop"
    private int target_id;
    private int user_id;
    private int rating;
    private String comment;
    private LocalDateTime created_at;

    public int getReview_id() { return review_id; }
    public void setReview_id(int review_id) { this.review_id = review_id; }

    public String getReview_type() { return review_type; }
    public void setReview_type(String review_type) { this.review_type = review_type; }

    public int getTarget_id() { return target_id; }
    public void setTarget_id(int target_id) { this.target_id = target_id; }

    public int getUser_id() { return user_id; }
    public void setUser_id(int user_id) { this.user_id = user_id; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
}
