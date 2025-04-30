package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.ShoppingCartItem;
import com.mohammad.lychee.lychee.repository.ShoppingCartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ShoppingCartItemRepositoryImpl implements ShoppingCartItemRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ShoppingCartItemRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ShoppingCartItem> rowMapper = (rs, rowNum) -> {
        ShoppingCartItem sci = new ShoppingCartItem();
        sci.setUserId(rs.getInt("User_ID"));
        sci.setItemId(rs.getInt("Item_ID"));
        sci.setQuantity(rs.getInt("quantity"));
        sci.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        sci.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        sci.setDeletedAt(rs.getTimestamp("deleted_at") != null ? rs.getTimestamp("deleted_at").toLocalDateTime() : null);
        return sci;
    };

    @Override
    public List<ShoppingCartItem> findAll() {
        String sql = "SELECT * FROM ShoppingCartItem";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public List<ShoppingCartItem> findByUserId(Integer userId) {
        String sql = "SELECT * FROM ShoppingCartItem WHERE User_ID = ?";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    @Override
    public Optional<ShoppingCartItem> findByUserIdAndItemId(Integer userId, Integer itemId) {
        try {
            String sql = "SELECT * FROM ShoppingCartItem WHERE User_ID = ? AND Item_ID = ?";
            ShoppingCartItem sci = jdbcTemplate.queryForObject(sql, rowMapper, userId, itemId);
            return Optional.ofNullable(sci);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public ShoppingCartItem save(ShoppingCartItem sci) {
        String sql = "INSERT INTO ShoppingCartItem (User_ID, Item_ID, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                sci.getUserId(),
                sci.getItemId(),
                sci.getQuantity(),
                sci.getCreatedAt(),
                sci.getUpdatedAt()
        );
        return sci;
    }
    @Override
    public ShoppingCartItem update(ShoppingCartItem item) {
        String sql = "UPDATE shopping_cart_item SET quantity = ?, updated_at = NOW() WHERE user_id = ? AND product_variant_id = ?";
        jdbcTemplate.update(sql, item.getQuantity(), item.getUserId(), item.getProductVariantId());
        return item;
    }

    @Override
    public void deleteByUserIdAndItemId(Integer userId, Integer itemId) {
        String sql = "DELETE FROM ShoppingCartItem WHERE User_ID = ? AND Item_ID = ?";
        jdbcTemplate.update(sql, userId, itemId);
    }

    @Override
    public void deleteAllByUserId(Integer userId) {
        String sql = "DELETE FROM ShoppingCartItem WHERE User_ID = ?";
        jdbcTemplate.update(sql, userId);
    }
}
