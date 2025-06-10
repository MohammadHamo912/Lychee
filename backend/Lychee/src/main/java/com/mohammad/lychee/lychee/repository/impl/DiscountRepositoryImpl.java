package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Discount;
import com.mohammad.lychee.lychee.repository.DiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class DiscountRepositoryImpl implements DiscountRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Custom RowMapper to handle the specific column names from your database
    private final RowMapper<Discount> discountRowMapper = new RowMapper<Discount>() {
        @Override
        public Discount mapRow(ResultSet rs, int rowNum) throws SQLException {
            Discount discount = new Discount();
            discount.setDiscount_id(rs.getInt("discount_id"));
            discount.setDiscount_percentage(rs.getBigDecimal("discount_percentage"));
            discount.setCode(rs.getString("code"));

            // Handle nullable dates
            Date startDate = rs.getDate("start_date");
            if (startDate != null) {
                discount.setStart_date(startDate.toLocalDate());
            }

            Date endDate = rs.getDate("end_date");
            if (endDate != null) {
                discount.setEnd_date(endDate.toLocalDate());
            }

            discount.setActive(rs.getBoolean("active"));
            return discount;
        }
    };

    @Override
    public List<Discount> findAll() {
        String sql = "SELECT discount_id, discount_percentage, code, start_date, end_date, active FROM discount";
        return jdbcTemplate.query(sql, discountRowMapper);
    }

    @Override
    public Optional<Discount> findById(Integer discountId) {
        String sql = "SELECT discount_id, discount_percentage, code, start_date, end_date, active FROM discount WHERE discount_id = ?";
        List<Discount> results = jdbcTemplate.query(sql, discountRowMapper, discountId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    @Override
    public Optional<Discount> findByCode(String code) {
        String sql = "SELECT discount_id, discount_percentage, code, start_date, end_date, active FROM discount WHERE code = ?";
        List<Discount> results = jdbcTemplate.query(sql, discountRowMapper, code);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    @Override
    public List<Discount> findAllActive() {
        String sql = "SELECT discount_id, discount_percentage, code, start_date, end_date, active FROM discount WHERE active = true";
        return jdbcTemplate.query(sql, discountRowMapper);
    }

    @Override
    public List<Discount> findValidDiscounts() {
        String sql = """
            SELECT discount_id, discount_percentage, code, start_date, end_date, active 
            FROM discount 
            WHERE active = true 
            AND (start_date IS NULL OR start_date <= CURDATE())
            AND (end_date IS NULL OR end_date >= CURDATE())
        """;
        return jdbcTemplate.query(sql, discountRowMapper);
    }

    @Override
    public Discount save(Discount discount) {
        if (discount.getDiscount_id() == 0) {
            // INSERT - creating new discount
            String sql = """
                INSERT INTO discount (discount_percentage, code, start_date, end_date, active)
                VALUES (?, ?, ?, ?, ?)
            """;

            KeyHolder keyHolder = new GeneratedKeyHolder();

            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"discount_id"});
                ps.setBigDecimal(1, discount.getDiscount_percentage());
                ps.setString(2, discount.getCode());
                ps.setDate(3, discount.getStart_date() != null ? Date.valueOf(discount.getStart_date()) : null);
                ps.setDate(4, discount.getEnd_date() != null ? Date.valueOf(discount.getEnd_date()) : null);
                ps.setBoolean(5, discount.isActive());
                return ps;
            }, keyHolder);

            // Set the generated ID back to the discount object
            if (keyHolder.getKey() != null) {
                discount.setDiscount_id(keyHolder.getKey().intValue());
            }
        } else {
            // UPDATE - updating existing discount
            String sql = """
                UPDATE discount 
                SET discount_percentage = ?, code = ?, start_date = ?, end_date = ?, active = ?
                WHERE discount_id = ?
            """;

            jdbcTemplate.update(sql,
                    discount.getDiscount_percentage(),
                    discount.getCode(),
                    discount.getStart_date() != null ? Date.valueOf(discount.getStart_date()) : null,
                    discount.getEnd_date() != null ? Date.valueOf(discount.getEnd_date()) : null,
                    discount.isActive(),
                    discount.getDiscount_id()
            );
        }
        return discount;
    }

    @Override
    public void toggleActive(Integer discountId) {
        String sql = "UPDATE discount SET active = NOT active WHERE discount_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, discountId);
        if (rowsAffected == 0) {
            throw new RuntimeException("Discount with ID " + discountId + " not found");
        }
    }

    @Override
    public void deleteById(Integer discountId) {
        String sql = "DELETE FROM discount WHERE discount_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, discountId);
        if (rowsAffected == 0) {
            throw new RuntimeException("Discount with ID " + discountId + " not found");
        }
    }

    @Override
    public boolean existsByCode(String code) {
        String sql = "SELECT COUNT(*) FROM discount WHERE code = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, code);
        return count != null && count > 0;
    }

    @Override
    public List<Discount> findTop3ByOrderByDiscountPercentageDesc() {
        String sql = """
            SELECT discount_id, discount_percentage, code, start_date, end_date, active 
            FROM discount 
            WHERE active = true 
            AND (start_date IS NULL OR start_date <= CURDATE())
            AND (end_date IS NULL OR end_date >= CURDATE())
            ORDER BY discount_percentage DESC 
            LIMIT 3
        """;
        return jdbcTemplate.query(sql, discountRowMapper);
    }
}