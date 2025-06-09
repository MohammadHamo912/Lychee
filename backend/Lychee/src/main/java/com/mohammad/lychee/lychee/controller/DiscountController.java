package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Discount;
import com.mohammad.lychee.lychee.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/discounts")
@CrossOrigin(origins = "*")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    @GetMapping
    public List<Discount> getAllDiscounts() {
        try {
            return discountService.getAllDiscounts();
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @PostMapping
    public Discount createDiscount(@RequestBody Discount discount) {
        try {
            return discountService.createDiscount(discount);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    @PutMapping("/{id}/toggle")
    public Map<String, String> toggleDiscount(@PathVariable int id) {
        try {
            discountService.toggleDiscountStatus(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Discount status toggled successfully");
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return error;
        }
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteDiscount(@PathVariable int id) {
        try {
            discountService.deleteDiscount(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Discount deleted successfully");
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return error;
        }
    }
}