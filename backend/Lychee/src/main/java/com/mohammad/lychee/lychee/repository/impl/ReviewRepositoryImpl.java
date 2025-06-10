package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Review;
import com.mohammad.lychee.lychee.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Repository
public class ReviewRepositoryImpl implements ReviewRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Review> rowMapper = (rs, rowNum) -> {
        Review review = new Review();
        review.setReview_id(rs.getInt("review_id"));
        review.setReview_type(rs.getString("review_type"));
        review.setTarget_id(rs.getInt("target_id"));
        review.setUser_id(rs.getInt("user_id"));
        review.setRating(rs.getInt("rating"));
        review.setComment(rs.getString("comment"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) review.setCreated_at(ts.toLocalDateTime());
        return review;
    };

    @Override
    public Review addReview(Review review) {
        String sql = """
        INSERT INTO review (review_type, target_id, user_id, rating, comment, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, review.getReview_type());
            ps.setInt(2, review.getTarget_id());
            ps.setInt(3, review.getUser_id());
            ps.setInt(4, review.getRating());
            ps.setString(5, review.getComment());
            ps.setTimestamp(6, Timestamp.valueOf(LocalDateTime.now()));
            return ps;
        }, keyHolder);

        review.setReview_id(Objects.requireNonNull(keyHolder.getKey()).intValue());
        review.setCreated_at(LocalDateTime.now());
        return review;
    }

    @Override
    public List<Review> getReviewsByUserId(int userId) {
        String sql = """
        SELECT r.*, 
               CASE 
                   WHEN r.review_type = 'product' THEN p.name
                   WHEN r.review_type = 'shop' THEN s.name
                   ELSE NULL
               END AS targetName
        FROM review r
        LEFT JOIN product p ON r.review_type = 'product' AND r.target_id = p.product_id
        LEFT JOIN store s ON r.review_type = 'shop' AND r.target_id = s.store_id
        WHERE r.user_id = ?
    """;

        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    @Override
    public List<Review> getReviewsByTypeAndTarget(String type, int targetId) {
        String sql = "SELECT * FROM review WHERE review_type = ? AND target_id = ?";
        return jdbcTemplate.query(sql, rowMapper, type, targetId);
    }

    @Override
    public void deleteReview(int reviewId) {
        String sql = "DELETE FROM review WHERE review_id = ?";
        jdbcTemplate.update(sql, reviewId);
    }
}