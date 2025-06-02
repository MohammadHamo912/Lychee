package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.ProductCategory;
import com.mohammad.lychee.lychee.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productcategories")
public class ProductCategoryController {

    private final ProductCategoryService productCategoryService;

    @Autowired
    public ProductCategoryController(ProductCategoryService productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    @GetMapping
    public List<ProductCategory> getAllProductCategories() {
        return productCategoryService.getAllProductCategories();
    }

    @GetMapping("/product/{productId}")
    public List<ProductCategory> getCategoriesByProductId(@PathVariable Integer productId) {
        return productCategoryService.getByProductId(productId);
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductCategory> getProductsByCategoryId(@PathVariable Integer categoryId) {
        return productCategoryService.getByCategoryId(categoryId);
    }

    @PostMapping
    public ResponseEntity<ProductCategory> createProductCategory(@RequestBody ProductCategory productCategory) {
        try {
            ProductCategory created = productCategoryService.createProductCategory(productCategory);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/product/{productId}/category/{categoryId}")
    public ResponseEntity<Void> deleteProductCategory(
            @PathVariable Integer productId,
            @PathVariable Integer categoryId) {
        try {
            productCategoryService.deleteProductCategory(productId, categoryId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/product/{productId}/categories")
    public ResponseEntity<List<ProductCategory>> addCategoriesToProduct(
            @PathVariable Integer productId,
            @RequestBody List<Integer> categoryIds) {
        try {
            List<ProductCategory> created = categoryIds.stream()
                    .map(categoryId -> productCategoryService.createProductCategory(
                            new ProductCategory(productId, categoryId)))
                    .toList();
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/category/{categoryId}/products")
    public ResponseEntity<List<ProductCategory>> addProductsToCategory(
            @PathVariable Integer categoryId,
            @RequestBody List<Integer> productIds) {
        try {
            List<ProductCategory> created = productIds.stream()
                    .map(productId -> productCategoryService.createProductCategory(
                            new ProductCategory(productId, categoryId)))
                    .toList();
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}