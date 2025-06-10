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
        sci.setUser_id(rs.getInt("user_id"));
        sci.setItem_id(rs.getInt("item_id"));
        sci.setQuantity(rs.getInt("quantity"));
        sci.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());
        sci.setUpdated_at(rs.getTimestamp("updated_at").toLocalDateTime());
        sci.setDeleted_at(rs.getTimestamp("deleted_at") != null ? rs.getTimestamp("deleted_at").toLocalDateTime() : null);
        return sci;
    };

    @Override
    public List<ShoppingCartItem> findAll() {
        String sql = "SELECT * FROM shopping_cart_item WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public List<ShoppingCartItem> findByUserId(Integer userId) {
        String sql = "SELECT * FROM shopping_cart_item WHERE user_id = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    @Override
    public Optional<ShoppingCartItem> findByUserIdAndItemId(Integer userId, Integer itemId) {
        try {
            String sql = "SELECT * FROM shopping_cart_item WHERE user_id = ? AND item_id = ? AND deleted_at IS NULL";
            ShoppingCartItem sci = jdbcTemplate.queryForObject(sql, rowMapper, userId, itemId);
            return Optional.ofNullable(sci);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public ShoppingCartItem save(ShoppingCartItem sci) {
        try {
            System.out.println("Repository - Saving cart item: User=" + sci.getUser_id() +
                    ", Item=" + sci.getItem_id() +
                    ", Quantity=" + sci.getQuantity());

            // Insert new item (don't check for existing - service layer handles that)
            String insertSql = "INSERT INTO shopping_cart_item (user_id, item_id, quantity, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())";
            int rowsAffected = jdbcTemplate.update(insertSql,
                    sci.getUser_id(),
                    sci.getItem_id(),
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
            System.out.println("Repository - Updating cart item: User=" + item.getUser_id() +
                    ", Item=" + item.getItem_id() +
                    ", Quantity=" + item.getQuantity());

            String sql = "UPDATE shopping_cart_item SET quantity = ?, updated_at = NOW() WHERE user_id = ? AND item_id = ?";
            int rowsAffected = jdbcTemplate.update(sql, item.getQuantity(), item.getUser_id(), item.getItem_id());

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
        String sql = "DELETE FROM shopping_cart_item WHERE user_id = ? AND item_id = ?";
        jdbcTemplate.update(sql, userId, itemId);
    }

    @Override
    public void deleteAllByUserId(Integer userId) {
        String sql = "DELETE FROM shopping_cart_item WHERE user_id = ?";
        jdbcTemplate.update(sql, userId);
    }

    // NEW METHOD: Get simple cart items with quantities for checkout
    @Override
    public List<CartItem> getCartItemsByUserId(Integer userId) {
        String sql = "SELECT item_id, quantity FROM shopping_cart_item WHERE user_id = ? AND deleted_at IS NULL";

        return jdbcTemplate.query(sql, new Object[]{userId}, (rs, rowNum) ->
                new CartItem(rs.getInt("item_id"), rs.getInt("quantity"))
        );
    }
}