package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Store;
import com.mohammad.lychee.lychee.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@Repository
public class StoreRepositoryImpl implements StoreRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public StoreRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Store> storeRowMapper = (rs, rowNum) -> {
        Store store = new Store();
        store.setStore_id(rs.getInt("store_id"));
        store.setShopowner_id(rs.getInt("shopowner_id"));
        store.setAddress_id(rs.getInt("address_id"));
        store.setName(rs.getString("name"));
        store.setDescription(rs.getString("description"));
        store.setCreated_at(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
        store.setUpdated_at(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
        store.setDeleted_at(rs.getTimestamp("deleted_at") != null ? rs.getTimestamp("deleted_at").toLocalDateTime() : null);
        store.setLogo_url(rs.getString("logo_url"));


        return store;
    };

    @Override
    public List<Store> findAll() {
        String sql = "SELECT * FROM store WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, storeRowMapper);
    }

    @Override
    public Optional<Store> findById(Integer id) {
        try {
            String sql = "SELECT * FROM store WHERE store_id = ? AND deleted_at IS NULL";
            Store store = jdbcTemplate.queryForObject(sql, storeRowMapper, id);
            return Optional.ofNullable(store);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Store> findByShopOwnerId(Integer shopOwnerId) {
        String sql = """
              SELECT s.*, a.address_id AS a_id, a.city, a.street, a.building
              FROM store s
              JOIN address a ON s.address_id = a.address_id
              WHERE s.ShopOwner_ID = ? AND s.deleted_at IS NULL
                """;
        return jdbcTemplate.query(sql, storeRowMapper, shopOwnerId);
    }

    @Override
    public List<Store> findByNameContaining(String name){
        String sql = "SELECT * FROM store WHERE name = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql,storeRowMapper,name);
    }
    @Override
    public Store save(Store store) {

        if (store.getStore_id() == 0) {
            return insert(store);
        } else {
            return update(store);
        }
    }

    private Store insert(Store store) {
        String sql = "INSERT INTO store (shopowner_id, address_id, name, description) VALUES (?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, store.getShopowner_id());
            ps.setInt(2, store.getAddress_id());
            ps.setString(3, store.getName());

            if (store.getDescription() != null) {
                ps.setString(4, store.getDescription());
            } else {
                ps.setNull(4, java.sql.Types.VARCHAR);
            }

            return ps;
        }, keyHolder);

        store.setStore_id(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return store;
    }

    private Store update(Store store) {
        String sql = "UPDATE store SET shopowner_id = ?, address_id = ?, name = ?, description = ?,logo_url = ?, " +
                "updated_at = ? WHERE store_id = ?";

        jdbcTemplate.update(sql,
                store.getShopowner_id(),
                store.getAddress_id(),
                store.getName(),
                store.getDescription(),
                store.getLogo_url(),
                Timestamp.valueOf(LocalDateTime.now()),
                store.getStore_id());

        return findById(store.getStore_id()).orElse(store);
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM store WHERE store_id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void softDelete(Integer id) {
        String sql = "UPDATE store SET deleted_at = ? WHERE store_id = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }
    @Override
    public Optional<Map<String, Object>> getStoreMetrics(int storeId) {
        String sql = """
                SELECT 
                    (SELECT COUNT(DISTINCT o.order_id)
                     FROM order_item oi
                     JOIN item i ON oi.item_id = i.item_id
                     JOIN `order` o ON oi.order_id = o.order_id
                     WHERE i.store_id = ?) AS totalOrders,

                    (SELECT COUNT(*) FROM item i
                     WHERE i.store_id = ?) AS totalProducts,

                    (SELECT SUM(p.amount) FROM payment_transaction p
                     JOIN `order` o ON o.order_id=p.order_id
                     JOIN `order_item` oi ON oi.order_id=o.order_id
                     JOIN `item` i ON i.item_id=oi.item_id
                     WHERE i.store_id=? AND p.status LIKE "payed") AS totalSales,
                     
                    (SELECT AVG(Rating) 
                     FROM review 
                     WHERE Review_Type LIKE "shop" AND Target_ID=?) AS storeRating
                """;

        try {
            System.out.println("Fetching metrics for store ID: " + storeId);
            Map<String, Object> result = jdbcTemplate.queryForMap(sql, storeId, storeId, storeId, storeId);
            System.out.println("Metrics result: " + result);
            return Optional.of(result);
        } catch (Exception e) {
            System.err.println("Error in getStoreMetrics(): " + e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public List<Map<String, Object>> getSalesChartData(int storeId, String period) {
        String sql = """
        SELECT DATE(o.created_at) as date,
               SUM(oi.quantity * oi.price_at_purchase) as total
        FROM order_item oi
        JOIN item i ON oi.item_id = i.item_id
        JOIN `order` o ON o.order_id = oi.order_id
        WHERE i.store_id = ?
        GROUP BY DATE(o.created_at)
        ORDER BY DATE(o.created_at)
    """;

        return jdbcTemplate.query(sql, new Object[]{storeId}, (rs, rowNum) -> {
            Map<String, Object> row = new HashMap<>();
            row.put("date", rs.getDate("date").toString());
            row.put("total", rs.getBigDecimal("total"));
            return row;
        });
    }
    @Override
    public List<Map<String, Object>> getReviewsByStoreId(int storeId) {
        String sql = """
        SELECT r.Review_ID AS id, r.Rating, r.Comment, r.Created_At AS date,
               u.name AS customer, s.name AS storeName
        FROM review r
        JOIN `user` u ON r.user_id = u.user_id
        JOIN store s ON r.Target_ID = s.store_id
        WHERE r.Review_Type = 'shop' AND s.store_id = ?
        ORDER BY r.Created_At DESC
    """;

        return jdbcTemplate.query(sql, new Object[]{storeId}, (rs, rowNum) -> {
            Map<String, Object> row = new HashMap<>();
            row.put("id", rs.getInt("id"));
            row.put("rating", rs.getInt("rating"));
            row.put("comment", rs.getString("comment"));
            row.put("date", rs.getTimestamp("date").toLocalDateTime().toLocalDate().toString());
            row.put("customer", rs.getString("customer"));
            row.put("storeName", rs.getString("storeName"));
            return row;
        });
    }
}