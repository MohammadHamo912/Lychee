package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.dto.ItemCreationRequest;
import com.mohammad.lychee.lychee.dto.ItemCreationResponse;
import com.mohammad.lychee.lychee.model.*;
import com.mohammad.lychee.lychee.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/item-management")
@CrossOrigin(origins = "http://localhost:3000")
public class ItemManagementController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductVariantService productVariantService;

    @Autowired
    private ItemService itemService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private JdbcTemplate jdbcTemplate; // Add this for direct database operations

    @PostMapping("/create-item")
    public ResponseEntity<?> createCompleteItem(@RequestBody ItemCreationRequest request) {
        try {
            // Validate required fields
            if (request.getProductName() == null || request.getProductName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Product name is required"));
            }

            if (request.getPrice() == null || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(createErrorResponse("Valid price is required"));
            }

            if (request.getStoreId() == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("store ID is required"));
            }

            // Step 1: Handle Category
            Category category = null;
            if (request.getCategoryId() != null) {
                category = categoryService.getCategoryById(request.getCategoryId()).orElse(null);
                if (category == null) {
                    return ResponseEntity.badRequest().body(createErrorResponse("Category not found"));
                }
            } else if (request.getNewCategoryName() != null && !request.getNewCategoryName().trim().isEmpty()) {
                // Create new category
                if (request.getParentCategoryId() == null) {
                    return ResponseEntity.badRequest().body(createErrorResponse("Parent category is required for new categories"));
                }

                Category parentCategory = categoryService.getCategoryById(request.getParentCategoryId()).orElse(null);
                if (parentCategory == null) {
                    return ResponseEntity.badRequest().body(createErrorResponse("Parent category not found"));
                }

                // Validate that parent is a main category (level 0) or second level (level 1)
                if (parentCategory.getLevel() > 1) {
                    return ResponseEntity.badRequest().body(createErrorResponse("Cannot create subcategory under level 2+ category"));
                }

                Category newCategory = new Category();
                newCategory.setName(request.getNewCategoryName().trim());
                newCategory.setParent_id(request.getParentCategoryId());
                newCategory.setLevel(parentCategory.getLevel() + 1);

                category = categoryService.createCategory(newCategory);
            }

            // Step 2: Handle Product
            Product product = null;

            // Check if product exists by barcode
            if (request.getBarcode() != null && !request.getBarcode().trim().isEmpty()) {
                product = productService.getProductByBarcode(request.getBarcode()).orElse(null);
            }

            // If product doesn't exist, create it
            if (product == null) {
                product = new Product();
                product.setName(request.getProductName().trim());
                product.setDescription(request.getDescription());
                product.setBarcode(request.getBarcode());
                product.setBrand(request.getBrand());
                product.setLogo_url(request.getImageUrl());

                product = productService.createProduct(product);

                // Link product to category if provided
                if (category != null) {
                    // You'll need to add this method to ProductService or create a ProductCategoryService
                    linkProductToCategory(product.getProduct_id(), category.getCategory_id());
                }
            }

            // Step 3: Handle ProductVariant
            ProductVariant variant = null;

            // Check if variant exists for this product with same size/color
            String size = request.getSize() != null ? request.getSize() : "default";
            String color = request.getColor() != null ? request.getColor() : "default";

            List<ProductVariant> existingVariants = productVariantService.getProductVariantsByProductId(product.getProduct_id());
            variant = existingVariants.stream()
                    .filter(v -> size.equals(v.getSize()) && color.equals(v.getColor()))
                    .findFirst()
                    .orElse(null);

            // If variant doesn't exist, create it
            if (variant == null) {
                variant = new ProductVariant();
                variant.setProduct_id(product.getProduct_id());
                variant.setSize(size);
                variant.setColor(color);

                variant = productVariantService.createProductVariant(variant);
            }

            // Step 4: Check if Item already exists for this store and variant
            List<Item> existingItems = itemService.getItemsByProductVariantId(variant.getProduct_variant_id());
            Item existingItem = existingItems.stream()
                    .filter(item -> item.getStore_id() == request.getStoreId())
                    .findFirst()
                    .orElse(null);

            if (existingItem != null) {
                return ResponseEntity.badRequest().body(createErrorResponse("Item already exists for this store and product variant"));
            }

            // Step 5: Create Item
            Item item = new Item();
            item.setStore_id(request.getStoreId());
            item.setProduct_variant_id(variant.getProduct_variant_id());
            item.setPrice(request.getPrice());
            item.setStock_quantity(request.getStock_quantity() != null ? request.getStock_quantity() : 0);
            item.setDiscount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);

            item = itemService.createItem(item);

            // Prepare response
            ItemCreationResponse response = new ItemCreationResponse();
            response.setSuccess(true);
            response.setMessage("Item created successfully");
            response.setItemId(item.getItem_id());
            response.setProductId(product.getProduct_id());
            response.setVariantId(variant.getProduct_variant_id());
            response.setCategoryId(category != null ? category.getCategory_id() : null);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to create item: " + e.getMessage()));
        }
    }

    /**
     * Get all main categories (level 0)
     */
    @GetMapping("/main-categories")
    public ResponseEntity<List<Category>> getMainCategories() {
        List<Category> mainCategories = categoryService.getAllCategories().stream()
                .filter(category -> category.getLevel() == 0)
                .toList();
        return ResponseEntity.ok(mainCategories);
    }

    /**
     * Get subcategories for a parent category
     */
    @GetMapping("/categories/{parentId}/subcategories")
    public ResponseEntity<List<Category>> getSubcategories(@PathVariable Integer parentId) {
        List<Category> subcategories = categoryService.getSubcategories(parentId);
        return ResponseEntity.ok(subcategories);
    }

    /**
     * Check if product exists by barcode
     */
    @GetMapping("/check-product")
    public ResponseEntity<?> checkProduct(@RequestParam String barcode) {
        try {
            Optional<Product> product = productService.getProductByBarcode(barcode);
            Map<String, Object> response = new HashMap<>();

            if (product.isPresent()) {
                response.put("exists", true);
                response.put("product", product.get());

                // Get variants for this product
                List<ProductVariant> variants = productVariantService.getProductVariantsByProductId(product.get().getProduct_id());
                response.put("variants", variants);
            } else {
                response.put("exists", false);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error checking product: " + e.getMessage()));
        }
    }

    /**
     * Check if variant exists for a product
     */
    @GetMapping("/check-variant")
    public ResponseEntity<?> checkVariant(@RequestParam Integer productId,
                                          @RequestParam String size,
                                          @RequestParam String color) {
        try {
            List<ProductVariant> variants = productVariantService.getProductVariantsByProductId(productId);
            ProductVariant existingVariant = variants.stream()
                    .filter(v -> size.equals(v.getSize()) && color.equals(v.getColor()))
                    .findFirst()
                    .orElse(null);

            Map<String, Object> response = new HashMap<>();
            response.put("exists", existingVariant != null);
            if (existingVariant != null) {
                response.put("variant", existingVariant);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error checking variant: " + e.getMessage()));
        }
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }

    /**
     * Helper method to link product to category
     */
    private void linkProductToCategory(Integer productId, Integer categoryId) {
        try {
            // Check if the link already exists
            String checkSql = "SELECT COUNT(*) FROM product_category WHERE product_id = ? AND category_id = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, productId, categoryId);

            if (count == 0) {
                // Insert the new relationship
                String insertSql = "INSERT INTO product_category (product_id, category_id) VALUES (?, ?)";
                jdbcTemplate.update(insertSql, productId, categoryId);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to link product to category", e);
        }
    }
}