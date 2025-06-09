package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.dto.ItemCreationRequest;
import com.mohammad.lychee.lychee.dto.ItemCreationResponse;
import com.mohammad.lychee.lychee.model.*;
import com.mohammad.lychee.lychee.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    /**
     * Create a complete item (handles Product, ProductVariant, Category, and Item creation)
     */
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
                return ResponseEntity.badRequest().body(createErrorResponse("Store ID is required"));
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
                newCategory.setParentId(request.getParentCategoryId());
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
//                    productService.linkProductToCategory(product.getProductId(), category.getCategoryId());
                }
            }

            // Step 3: Handle ProductVariant
            ProductVariant variant = null;

            // Check if variant exists for this product with same size/color
            String size = request.getSize() != null ? request.getSize() : "default";
            String color = request.getColor() != null ? request.getColor() : "default";

            List<ProductVariant> existingVariants = productVariantService.getProductVariantsByProductId(product.getProductId());
            variant = existingVariants.stream()
                    .filter(v -> size.equals(v.getSize()) && color.equals(v.getColor()))
                    .findFirst()
                    .orElse(null);

            // If variant doesn't exist, create it
            if (variant == null) {
                variant = new ProductVariant();
                variant.setProductId(product.getProductId());
                variant.setSize(size);
                variant.setColor(color);

                variant = productVariantService.createProductVariant(variant);
            }

            // Step 4: Check if Item already exists for this store and variant
            List<Item> existingItems = itemService.getItemsByProductVariantId(variant.getProductVariantId());
            Item existingItem = existingItems.stream()
                    .filter(item -> item.getStoreId() == request.getStoreId())
                    .findFirst()
                    .orElse(null);

            if (existingItem != null) {
                return ResponseEntity.badRequest().body(createErrorResponse("Item already exists for this store and product variant"));
            }

            // Step 5: Create Item
            Item item = new Item();
            item.setStoreId(request.getStoreId());
            item.setProductVariantId(variant.getProductVariantId());
            item.setPrice(request.getPrice());
            item.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);
            item.setDiscount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);

            item = itemService.createItem(item);

            // Prepare response
            ItemCreationResponse response = new ItemCreationResponse();
            response.setSuccess(true);
            response.setMessage("Item created successfully");
            response.setItemId(item.getItemId());
            response.setProductId(product.getProductId());
            response.setVariantId(variant.getProductVariantId());
            response.setCategoryId(category != null ? category.getCategoryId() : null);

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
                List<ProductVariant> variants = productVariantService.getProductVariantsByProductId(product.get().getProductId());
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
}