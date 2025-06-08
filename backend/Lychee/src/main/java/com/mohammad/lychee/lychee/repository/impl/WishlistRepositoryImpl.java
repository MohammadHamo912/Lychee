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
        wishlist.setItemId(rs.getInt("Item_ID"));
        wishlist.setAddedAt(rs.getTimestamp("added_at").toLocalDateTime());
        wishlist.setName(rs.getString("product_name"));
        wishlist.setImageUrl(rs.getString("product_logo"));
        wishlist.setPrice(rs.getDouble("price"));
        return wishlist;
    };

    @Override
    public List<Wishlist> findAll() {
        return jdbcTemplate.query("SELECT * FROM Wishlist_Table", rowMapper);
    }

    @Override
    public List<Wishlist> findByUserId(Integer userId) {
        String sql = """
                   SELECT
                       w.User_ID,
                       w.Item_ID,
                       w.added_at,
                       p.name AS product_name,
                       p.logo_url AS product_logo,
                       i.price
                   FROM Wishlist_Table w
                   JOIN Item i ON w.Item_ID = i.Item_ID
                   JOIN ProductVariant pv ON i.Product_Variant_ID = pv.Product_Variant_ID
                   JOIN Product p ON pv.Product_ID = p.Product_ID
                   WHERE w.User_ID = ?
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Wishlist wishlist = new Wishlist();
            wishlist.setUserId(rs.getInt("User_ID"));
            wishlist.setItemId(rs.getInt("Item_ID"));
            wishlist.setAddedAt(rs.getTimestamp("added_at").toLocalDateTime());
            wishlist.setName(rs.getString("product_name"));
            wishlist.setImageUrl(rs.getString("product_logo"));
            wishlist.setPrice(rs.getDouble("price"));
            return wishlist;
        }, userId);

    }


    @Override
    public void addWishlistItem(Integer userId, Integer itemId) {
        jdbcTemplate.update("INSERT INTO Wishlist_Table (User_ID, Item_ID) VALUES (?, ?)", userId, itemId);
    }

    @Override
    public void removeWishlistItem(Integer userId, Integer itemId) {
        jdbcTemplate.update("DELETE FROM Wishlist_Table WHERE User_ID = ? AND Item_ID = ?", userId, itemId);
    }

    @Override
    public Optional<Wishlist> findByUserIdAndItemId(Integer userId, Integer itemId) {
        try {
            Wishlist wishlist = jdbcTemplate.queryForObject(
                    "SELECT * FROM Wishlist_Table WHERE User_ID = ? AND Item_ID = ?",
                    rowMapper, userId, itemId
            );
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
