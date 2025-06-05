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
        wishlist.setUserId(rs.getInt("User_ID"));
        wishlist.setProductVariantId(rs.getInt("Product_Variant_ID"));
        return wishlist;
    };

    @Override
    public List<Wishlist> findAll() {
        return jdbcTemplate.query("SELECT * FROM Wishlist_Table", rowMapper);
    }

    @Override
    public List<Wishlist> findByUserId(Integer userId) {
        return jdbcTemplate.query("SELECT * FROM Wishlist_Table WHERE User_ID = ?", rowMapper, userId);
    }

    @Override
    public void addWishlistItem(Integer userId, Integer productVariantId) {
        jdbcTemplate.update("INSERT INTO Wishlist_Table (User_ID, Product_Variant_ID) VALUES (?, ?)", userId, productVariantId);
    }

    @Override
    public void removeWishlistItem(Integer userId, Integer productVariantId) {
        jdbcTemplate.update("DELETE FROM Wishlist_Table WHERE User_ID = ? AND Product_Variant_ID = ?", userId, productVariantId);
    }

    @Override
    public Optional<Wishlist> findByUserIdAndProductVariantId(Integer userId, Integer productVariantId) {
        try {
            Wishlist wishlist = jdbcTemplate.queryForObject("SELECT * FROM Wishlist_Table WHERE User_ID = ? AND Product_Variant_ID = ?",
                    rowMapper, userId, productVariantId);
            return Optional.ofNullable(wishlist);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public void deleteAllByUserId(Integer userId) {
        jdbcTemplate.update("DELETE FROM Wishlist_Table WHERE User_ID = ?", userId);
    }
}
