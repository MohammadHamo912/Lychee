package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Review;
import com.mohammad.lychee.lychee.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class ReviewRepositoryImpl implements ReviewRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Review> rowMapper = (rs, rowNum) -> {
        Review review = new Review();
        review.setReviewId(rs.getInt("Review_ID"));
        review.setReviewType(rs.getString("Review_Type"));
        review.setTargetId(rs.getInt("Target_ID"));
        review.setUserId(rs.getInt("User_ID"));
        review.setRating(rs.getInt("Rating"));
        review.setComment(rs.getString("Comment"));
        Timestamp ts = rs.getTimestamp("Created_At");
        if (ts != null) review.setCreatedAt(ts.toLocalDateTime());
        return review;
    };

    @Override
    public void addReview(Review review) {
        String sql = """
            INSERT INTO Review (Review_Type, Target_ID, User_ID, Rating, Comment)
            VALUES (?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql, review.getReviewType(), review.getTargetId(),
                review.getUserId(), review.getRating(), review.getComment());
    }
    @Override
    public List<Review> getReviewsByUserId(int userId) {
        String sql = """
        SELECT r.*, 
               CASE 
                   WHEN r.Review_Type = 'product' THEN p.name
                   WHEN r.Review_Type = 'shop' THEN s.name
                   ELSE NULL
               END AS targetName
        FROM Review r
        LEFT JOIN Product p ON r.Review_Type = 'product' AND r.Target_ID = p.Product_ID
        LEFT JOIN Store s ON r.Review_Type = 'shop' AND r.Target_ID = s.Store_ID
        WHERE r.User_ID = ?
    """;

        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    @Override
    public List<Review> getReviewsByTypeAndTarget(String type, int targetId) {
        String sql = "SELECT * FROM Review WHERE Review_Type = ? AND Target_ID = ?";
        return jdbcTemplate.query(sql, rowMapper, type, targetId);
    }
    @Override
    public void deleteReview(int reviewId) {
        String sql = "DELETE FROM Review WHERE Review_ID = ?";
        jdbcTemplate.update(sql, reviewId);
    }

}
