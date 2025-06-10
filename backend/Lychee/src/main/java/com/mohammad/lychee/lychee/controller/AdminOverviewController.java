package com.mohammad.lychee.lychee.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/overview")
public class AdminOverviewController {

    @Autowired
    private JdbcTemplate jdbc;

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> map = new HashMap<>();
        try {
            map.put("users", jdbc.queryForObject("SELECT COUNT(*) FROM `user`", Integer.class));
            map.put("shops", jdbc.queryForObject("SELECT COUNT(*) FROM `store`", Integer.class));
            map.put("orders", jdbc.queryForObject("SELECT COUNT(*) FROM `order`", Integer.class));
            map.put("revenue", jdbc.queryForObject(
                    "SELECT IFNULL(SUM(total_price), 0) FROM `order` WHERE status = 'completed'", Double.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }

    @GetMapping("/order-trends")
    public List<Map<String, Object>> getOrderTrends() {
        String sql = """
            SELECT DATE(created_at) AS date, COUNT(*) AS orders
            FROM `order`
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
        """;
        try {
            return jdbc.query(sql, (rs, rowNum) -> {
                Map<String, Object> row = new HashMap<>();
                row.put("date", rs.getString("date"));
                row.put("orders", rs.getInt("orders"));
                return row;
            });
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    @GetMapping("/order-status")
    public List<Map<String, Object>> getOrderStatus() {
        String sql = """
            SELECT status AS name, COUNT(*) AS value
            FROM `order`
            GROUP BY status
        """;
        try {
            return jdbc.query(sql, (rs, rowNum) -> {
                Map<String, Object> row = new HashMap<>();
                row.put("name", rs.getString("name"));
                row.put("value", rs.getInt("value"));
                return row;
            });
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    @GetMapping("/recent-users")
    public List<Map<String, Object>> getRecentUsers() {
        String sql = """
            SELECT user_id, name
            FROM `user`
            ORDER BY created_at DESC
            LIMIT 5
        """;
        try {
            return jdbc.query(sql, (rs, rowNum) -> Map.of(
                    "id", rs.getInt("user_id"),
                    "name", rs.getString("name")
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    @GetMapping("/recent-shops")
    public List<Map<String, Object>> getRecentShops() {
        String sql = """
            SELECT store_id, name
            FROM `store`
            ORDER BY created_at DESC
            LIMIT 5
        """;
        try {
            return jdbc.query(sql, (rs, rowNum) -> Map.of(
                    "id", rs.getInt("store_id"),
                    "name", rs.getString("name")
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    @GetMapping("/recent-orders")
    public List<Map<String, Object>> getRecentOrders() {
        String sql = """
            SELECT o.order_id AS id, u.name AS customer, o.total_price AS total
            FROM `order` o
            JOIN `User` u ON o.user_id = u.user_id
            ORDER BY o.created_at DESC
            LIMIT 5
        """;
        try {
            return jdbc.query(sql, (rs, rowNum) -> Map.of(
                    "id", rs.getInt("id"),
                    "customer", rs.getString("customer"),
                    "total", rs.getDouble("total")
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
