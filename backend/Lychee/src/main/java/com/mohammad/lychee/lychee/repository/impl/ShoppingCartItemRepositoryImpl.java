package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.ShoppingCartItem;
import com.mohammad.lychee.lychee.repository.ShoppingCartItemRepository;
import com.mohammad.lychee.lychee.service.impl.CheckoutServiceImpl.CartItem;
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
        String sql = "SELECT * FROM ShoppingCartItem WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public List<ShoppingCartItem> findByUserId(Integer userId) {
        String sql = "SELECT * FROM ShoppingCartItem WHERE User_ID = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    @Override
    public Optional<ShoppingCartItem> findByUserIdAndItemId(Integer userId, Integer itemId) {
        try {
            String sql = "SELECT * FROM ShoppingCartItem WHERE User_ID = ? AND Item_ID = ? AND deleted_at IS NULL";
            ShoppingCartItem sci = jdbcTemplate.queryForObject(sql, rowMapper, userId, itemId);
            return Optional.ofNullable(sci);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public ShoppingCartItem save(ShoppingCartItem sci) {
        try {
            System.out.println("Repository - Saving cart item: User=" + sci.getUserId() +
                    ", Item=" + sci.getItemId() +
                    ", Quantity=" + sci.getQuantity());

            // Insert new item (don't check for existing - service layer handles that)
            String insertSql = "INSERT INTO ShoppingCartItem (User_ID, Item_ID, quantity, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())";
            int rowsAffected = jdbcTemplate.update(insertSql,
                    sci.getUserId(),
                    sci.getItemId(),
                    sci.getQuantity()
            );

            if (rowsAffected > 0) {
                System.out.println("Repository - Successfully inserted cart item");
                return sci;
            } else {
                throw new RuntimeException("Repository - Failed to insert cart item - no rows affected");
            }
        } catch (Exception e) {
            System.err.println("Repository - Error saving cart item: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public ShoppingCartItem update(ShoppingCartItem item) {
        try {
            System.out.println("Repository - Updating cart item: User=" + item.getUserId() +
                    ", Item=" + item.getItemId() +
                    ", Quantity=" + item.getQuantity());

            String sql = "UPDATE ShoppingCartItem SET quantity = ?, updated_at = NOW() WHERE User_ID = ? AND Item_ID = ?";
            int rowsAffected = jdbcTemplate.update(sql, item.getQuantity(), item.getUserId(), item.getItemId());

            if (rowsAffected == 0) {
                throw new RuntimeException("Repository - Cart item not found for update");
            }

            System.out.println("Repository - Successfully updated cart item");
            return item;
        } catch (Exception e) {
            System.err.println("Repository - Error updating cart item: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
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

    // NEW METHOD: Get simple cart items with quantities for checkout
    @Override
    public List<CartItem> getCartItemsByUserId(Integer userId) {
        String sql = "SELECT Item_ID, quantity FROM ShoppingCartItem WHERE User_ID = ? AND deleted_at IS NULL";

        return jdbcTemplate.query(sql, new Object[]{userId}, (rs, rowNum) ->
                new CartItem(rs.getInt("Item_ID"), rs.getInt("quantity"))
        );
    }
}