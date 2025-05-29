package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Discount;
import com.mohammad.lychee.lychee.repository.DiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class DiscountRepositoryImpl implements DiscountRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<Discount> findAll() {
        String sql = "SELECT * FROM discount";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Discount.class));
    }

    @Override
    public Optional<Discount> findById(Integer discountId) {
        String sql = "SELECT * FROM discount WHERE id = ?";
        List<Discount> results = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Discount.class), discountId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    @Override
    public List<Discount> findValidDiscounts() {
        String sql = "SELECT * FROM discount WHERE expiration_date > ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Discount.class), LocalDate.now());
    }

    @Override
    public Discount save(Discount discount) {
        if (discount.getDiscountId() == 0) {
            // INSERT
            String sql = "INSERT INTO discount (code, percentage, expiration_date) VALUES (?, ?, ?)";
            jdbcTemplate.update(sql, discount.getDiscountId(), discount.getDiscountValue(), discount.getExpirationDate());
        } else {
            // UPDATE
            String sql = "UPDATE discount SET code = ?, percentage = ?, expiration_date = ? WHERE id = ?";
            jdbcTemplate.update(sql, discount.getDiscountId(), discount.getDiscountValue(), discount.getExpirationDate(), discount.getDiscountId());
        }
        return discount;
    }

    @Override
    public void delete(Integer discountId) {
        String sql = "DELETE FROM discount WHERE id = ?";
        jdbcTemplate.update(sql, discountId);
    }
}
