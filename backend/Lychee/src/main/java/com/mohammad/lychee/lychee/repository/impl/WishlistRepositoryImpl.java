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
        Wishlist wi = new Wishlist();
        wi.setUserId(rs.getInt("User_ID"));
        wi.setProductVariantId(rs.getInt("Product_Variant_ID"));
        return wi;
    };

    @Override
    public List<Wishlist> findAll() {
        String sql = "SELECT * FROM Wishlist_Table";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public List<Wishlist> findByUserId(Integer userId) {
        String sql = "SELECT * FROM Wishlist_Table WHERE User_ID = ?";
        return jdbcTemplate.query(sql, rowMapper, userId);
    }

    @Override
    public void addWishlistItem(Integer userId, Integer productVariantId) {
        String sql = "INSERT INTO Wishlist_Table (User_ID, Product_Variant_ID) VALUES (?, ?)";
        jdbcTemplate.update(sql, userId, productVariantId);
    }

    @Override
    public void removeWishlistItem(Integer userId, Integer productVariantId) {
        String sql = "DELETE FROM Wishlist_Table WHERE User_ID = ? AND Product_Variant_ID = ?";
        jdbcTemplate.update(sql, userId, productVariantId);
    }

    @Override
    public Optional<Wishlist> findByUserIdAndProductVariantId(Integer userId, Integer productVariantId) {
        try {
            String sql = "SELECT * FROM Wishlist_Table WHERE User_ID = ? AND Product_Variant_ID = ?";
            Wishlist item = jdbcTemplate.queryForObject(sql, rowMapper, userId, productVariantId);
            return Optional.ofNullable(item);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
    @Override
    public void deleteAllByUserId(Integer userId) {
        String sql = "DELETE FROM Wishlist_Table WHERE User_ID = ?";
        jdbcTemplate.update(sql, userId);
    }

}
