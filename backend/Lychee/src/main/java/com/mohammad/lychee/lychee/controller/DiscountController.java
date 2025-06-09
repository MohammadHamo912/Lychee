package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Discount;
import com.mohammad.lychee.lychee.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    @GetMapping("/carousel")
    public List<Discount> getTopDiscountsForCarousel() {
        try {
            return discountService.getTopDiscountsForCarousel();
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }
    @GetMapping("/validate/{code}")
    public ResponseEntity<Map<String, Object>> validateDiscountCode(@PathVariable String code) {
        try {
            Optional<Discount> discount = discountService.validateDiscountCode(code);
            Map<String, Object> response = new HashMap<>();

            if (discount.isPresent()) {
                Discount validDiscount = discount.get();
                response.put("valid", true);
                response.put("discount", validDiscount);
                response.put("message", "Discount code is valid");
                return ResponseEntity.ok(response);
            } else {
                response.put("valid", false);
                response.put("message", "Invalid or expired discount code");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("valid", false);
            error.put("message", "Error validating discount code");
            return ResponseEntity.badRequest().body(error);
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