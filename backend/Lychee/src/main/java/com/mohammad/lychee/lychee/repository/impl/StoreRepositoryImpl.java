package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Address;
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
        store.setStoreId(rs.getInt("Store_ID"));
        store.setShopOwnerId(rs.getInt("ShopOwner_ID"));
        store.setAddressId(rs.getInt("Address_ID"));
        store.setName(rs.getString("name"));
        store.setDescription(rs.getString("description"));
        store.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
        store.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
        store.setDeletedAt(rs.getTimestamp("deleted_at") != null ? rs.getTimestamp("deleted_at").toLocalDateTime() : null);
        store.setLogo_url(rs.getString("logo_url"));

        // 👇 Set Address object
        Address address = new Address();
        address.setAddressId(rs.getInt("a_id")); // alias to avoid conflict
        address.setCity(rs.getString("city"));
        address.setStreet(rs.getString("street"));
        address.setBuilding(rs.getString("building"));

        store.setAddress(address);

        return store;
    };

    @Override
    public List<Store> findAll() {
        String sql = "SELECT * FROM Store WHERE deleted_at IS NULL";
        return jdbcTemplate.query(sql, storeRowMapper);
    }

    @Override
    public Optional<Store> findById(Integer id) {
        try {
            String sql = "SELECT * FROM Store WHERE Store_ID = ? AND deleted_at IS NULL";
            Store store = jdbcTemplate.queryForObject(sql, storeRowMapper, id);
            return Optional.ofNullable(store);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Store> findByShopOwnerId(Integer shopOwnerId) {
        String sql = """
              SELECT s.*, a.Address_ID AS a_id, a.city, a.street, a.building
              FROM Store s
              JOIN Address a ON s.Address_ID = a.Address_ID
              WHERE s.ShopOwner_ID = ? AND s.deleted_at IS NULL
                """;
        return jdbcTemplate.query(sql, storeRowMapper, shopOwnerId);
    }

    @Override
    public List<Store> findByNameContaining(String name){
        String sql = "SELECT * FROM Store WHERE ShopName = ? AND deleted_at IS NULL";
        return jdbcTemplate.query(sql,storeRowMapper,name);
    }
    @Override
    public Store save(Store store) {
        return update(store);
        /*
        if (store.getStoreId() == null) {
            return insert(store);
        } else {
            return update(store);
        }*/
    }

    private Store insert(Store store) {
        String sql = "INSERT INTO Store (ShopOwner_ID, Address_ID, name, description) VALUES (?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, store.getShopOwnerId());
            ps.setInt(2, store.getAddressId());
            ps.setString(3, store.getName());

            if (store.getDescription() != null) {
                ps.setString(4, store.getDescription());
            } else {
                ps.setNull(4, java.sql.Types.VARCHAR);
            }

            return ps;
        }, keyHolder);

        store.setStoreId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return store;
    }

    private Store update(Store store) {
        String sql = "UPDATE Store SET ShopOwner_ID = ?, Address_ID = ?, name = ?, description = ?,logo_url = ?, " +
                "updated_at = ? WHERE Store_ID = ?";

        jdbcTemplate.update(sql,
                store.getShopOwnerId(),
                store.getAddressId(),
                store.getName(),
                store.getDescription(),
                store.getLogo_url(),
                Timestamp.valueOf(LocalDateTime.now()),
                store.getStoreId());

        return findById(store.getStoreId()).orElse(store);
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM Store WHERE Store_ID = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void softDelete(Integer id) {
        String sql = "UPDATE Store SET deleted_at = ? WHERE Store_ID = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }
    @Override
    public Optional<Map<String, Object>> getStoreMetrics(int storeId) {
        String sql = """
        SELECT 
            (SELECT COUNT(*) FROM orderitem oi 
             JOIN Item i ON oi.item_id = i.Item_ID 
             WHERE i.Store_ID = ?) AS totalOrders,

            (SELECT COUNT(*) FROM Item i 
             WHERE i.Store_ID = ?) AS totalProducts,

            (SELECT COALESCE(SUM(oi.quantity * oi.price_at_purchase), 0)
             FROM orderitem oi 
             JOIN Item i ON oi.item_id = i.Item_ID 
             WHERE i.Store_ID = ?) AS totalSales
    """;

        try {
            System.out.println("📊 Fetching metrics for store ID: " + storeId);
            Map<String, Object> result = jdbcTemplate.queryForMap(sql, storeId, storeId, storeId);
            System.out.println("✅ Metrics result: " + result);
            return Optional.of(result);
        } catch (Exception e) {
            System.err.println("❌ Error in getStoreMetrics(): " + e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public List<Map<String, Object>> getSalesChartData(int storeId, String period) {
        String sql = """
        SELECT DATE(o.created_at) as date,
               SUM(oi.quantity * oi.price_at_purchase) as total
        FROM orderitem oi
        JOIN Item i ON oi.item_id = i.Item_ID
        JOIN `Order` o ON o.Order_ID = oi.order_id
        WHERE i.Store_ID = ?
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

}