package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Wishlist;
import com.mohammad.lychee.lychee.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class WishlistRepositoryImpl implements WishlistRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public WishlistRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Wishlist> rowMapper = (rs, rowNum) -> {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser_id(rs.getInt("user_id"));
        wishlist.setItem_id(rs.getInt("item_id"));
        wishlist.setAdded_at(rs.getTimestamp("added_at").toLocalDateTime());
        return wishlist;
    };

    @Override
    public List<Wishlist> findAll() {
        return jdbcTemplate.query("SELECT * FROM wishlist_table", rowMapper);
    }

    @Override
    public List<Wishlist> findByUserId(Integer userId) {
        String sql = """
                   SELECT
                       w.user_id,
                       w.item_id,
                       w.added_at,
                       p.name AS product_name,
                       p.logo_url AS product_logo,
                       i.price
                   FROM wishlist_table w
                   JOIN item i ON w.item_id = i.item_id
                   JOIN product_variant pv ON i.product_variant_id = pv.product_variant_id
                   JOIN product p ON pv.product_id = p.product_id
                   WHERE w.user_id = ?
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Wishlist wishlist = new Wishlist();
            wishlist.setUser_id(rs.getInt("user_id"));
            wishlist.setItem_id(rs.getInt("item_id"));
            wishlist.setAdded_at(rs.getTimestamp("added_at").toLocalDateTime());
            return wishlist;
        }, userId);

    }


    @Override
    public void addWishlistItem(Integer userId, Integer itemId) {
        jdbcTemplate.update("INSERT INTO wishlist_table (user_id, item_id) VALUES (?, ?)", userId, itemId);
    }

    @Override
    public void removeWishlistItem(Integer userId, Integer itemId) {
        jdbcTemplate.update("DELETE FROM wishlist_table WHERE user_id = ? AND item_id = ?", userId, itemId);
    }

    @Override
    public Optional<Wishlist> findByUserIdAndItemId(Integer userId, Integer itemId) {
        try {
            Wishlist wishlist = jdbcTemplate.queryForObject(
                    "SELECT * FROM wishlist_table WHERE user_id = ? AND item_id = ?",
                    rowMapper, userId, itemId
            );
            return Optional.ofNullable(wishlist);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public void deleteAllByUserId(Integer userId) {
        jdbcTemplate.update("DELETE FROM wishlist_table WHERE user_id = ?", userId);
    }
}
