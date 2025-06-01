package com.mohammad.lychee.lychee.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

    @Autowired
    private JdbcTemplate jdbc;

    @GetMapping
    public List<Map<String, Object>> getAllDiscounts() {
        String sql = "SELECT Discount_ID, code, discountType, discountValue, start_date, end_date, active FROM discount";
        try {
            return jdbc.query(sql, (rs, rowNum) -> Map.of(
                    "id", rs.getInt("Discount_ID"),
                    "code", rs.getString("code"),
                    "type", rs.getString("discountType"),
                    "value", rs.getDouble("discountValue"),
                    "startDate", rs.getDate("start_date") != null ? rs.getDate("start_date").toString() : null,
                    "endDate", rs.getDate("end_date") != null ? rs.getDate("end_date").toString() : null,
                    "active", rs.getBoolean("active")
            ));
        } catch (Exception e) {
            e.printStackTrace();  // You’ll see it in your backend console
            return List.of();     // Return empty list instead of 500
        }
    }


    @PostMapping
    public void createDiscount(@RequestBody Map<String, Object> discount) {
        jdbc.update("""
            INSERT INTO discount (discountType, discountValue, code, start_date, end_date, active)
            VALUES (?, ?, ?, ?, ?, ?)
        """,
                discount.get("type"),
                discount.get("value"),
                discount.get("code"),
                discount.get("startDate"),
                discount.get("endDate"),
                true
        );
    }

    @PutMapping("/{id}/toggle")
    public void toggleDiscount(@PathVariable int id) {
        jdbc.update("UPDATE discount SET active = NOT active WHERE Discount_ID = ?", id);
    }

    @DeleteMapping("/{id}")
    public void deleteDiscount(@PathVariable int id) {
        jdbc.update("DELETE FROM discount WHERE Discount_ID = ?", id);
    }
}
