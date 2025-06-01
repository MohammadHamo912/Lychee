package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.Store;
import com.mohammad.lychee.lychee.repository.StoreRepository;
import com.mohammad.lychee.lychee.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.*;

@Service
public class StoreServiceImpl implements StoreService {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    private final StoreRepository storeRepository;

    @Autowired
    public StoreServiceImpl(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    @Override
    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }

    @Override
    public Optional<Store> getStoreById(Integer storeId) {
        return storeRepository.findById(storeId);
    }

    @Override
    public List<Store> getStoresByShopOwnerId(Integer shopOwnerId) {
        return storeRepository.findByShopOwnerId(shopOwnerId);
    }

    @Override
    @Transactional
    public Store createStore(Store store) {
        return storeRepository.save(store);
    }

    @Override
    @Transactional
    public Store updateStore(Store store) {
        Optional<Store> existingStore = storeRepository.findById(store.getStoreId());
        if (existingStore.isEmpty()) {
            throw new IllegalArgumentException("Store with ID " + store.getStoreId() + " does not exist");
        }

        storeRepository.save(store);
        return store;
    }

    @Override
    @Transactional
    public void softDeleteStore(Integer storeId) {
        storeRepository.softDelete(storeId);
    }

    @Override
    public List<Store> searchStoresByName(String name) {
        return storeRepository.findByNameContaining(name);
    }
    @Override
    public Map<String, Object> getStoreMetrics(Integer storeId) {
        Map<String, Object> metrics = new HashMap<>();

        try {
            Double totalSales = jdbcTemplate.queryForObject("""
            SELECT SUM(oi.price_at_purchase * oi.quantity)
            FROM OrderItem oi
            JOIN Item i ON oi.item_id = i.item_id
            WHERE i.store_id = ?
        """, new Object[]{storeId}, Double.class);

            Integer totalOrders = jdbcTemplate.queryForObject("""
            SELECT COUNT(DISTINCT o.order_id)
            FROM OrderItem oi
            JOIN Orders o ON oi.order_id = o.order_id
            JOIN Item i ON oi.item_id = i.item_id
            WHERE i.store_id = ?
        """, new Object[]{storeId}, Integer.class);

            Integer totalProducts = jdbcTemplate.queryForObject("""
            SELECT COUNT(DISTINCT i.Item_ID)
            FROM Item i
            WHERE i.Store_ID = ?
        """, new Object[]{storeId}, Integer.class);

            metrics.put("totalSales", totalSales != null ? totalSales : 0);
            metrics.put("totalOrders", totalOrders != null ? totalOrders : 0);
            metrics.put("totalProducts", totalProducts != null ? totalProducts : 0);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return metrics;
    }
    @Override
    public List<Map<String, Object>> getSalesData(Integer storeId, String timeframe) {
        String groupBy;
        switch (timeframe) {
            case "7days" -> groupBy = "DATE(o.created_at)";
            case "6months", "2023", "2024" -> groupBy = "DATE_FORMAT(o.created_at, '%b')";
            default -> groupBy = "DATE(o.created_at)";
        }

        String sql = String.format("""
        SELECT 
            %s AS label, 
            SUM(oi.price_at_purchase * oi.quantity) AS total
        FROM OrderItem oi
        JOIN Orders o ON oi.order_id = o.order_id
        JOIN Item i ON oi.item_id = i.item_id
        WHERE i.store_id = ?
        GROUP BY label
        ORDER BY o.created_at
    """, groupBy);

        try {
            return jdbcTemplate.query(sql, new Object[]{storeId}, (rs, rowNum) -> {
                Map<String, Object> row = new HashMap<>();
                row.put("date", rs.getString("label"));
                row.put("total", rs.getDouble("total"));
                return row;
            });
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }


    @Override
    public List<Map<String, Object>> getStoreReviewsAsMap(Integer storeId) {
        String sql = """
        SELECT 
            p.name AS productName,
            u.name AS customer,
            r.rating,
            r.comment,
            DATE(r.created_at) AS date
        FROM Review r
        JOIN Product p ON r.product_id = p.product_id
        JOIN Users u ON r.user_id = u.user_id
        JOIN ProductVariant pv ON pv.product_id = p.product_id
        JOIN Item i ON i.product_variant_id = pv.product_variant_id
        WHERE i.store_id = ?
        ORDER BY r.created_at DESC
    """;

        try {
            return jdbcTemplate.query(sql, new Object[]{storeId}, (rs, rowNum) -> {
                Map<String, Object> row = new HashMap<>();
                row.put("productName", rs.getString("productName"));
                row.put("customer", rs.getString("customer"));
                row.put("rating", rs.getInt("rating"));
                row.put("comment", rs.getString("comment"));
                row.put("date", rs.getDate("date").toString());
                return row;
            });
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}