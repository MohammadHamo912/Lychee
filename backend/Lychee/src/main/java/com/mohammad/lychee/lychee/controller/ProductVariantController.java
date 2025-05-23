package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.ProductVariant;
import com.mohammad.lychee.lychee.service.ProductVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productvariants")
public class ProductVariantController {

    @Autowired
    private ProductVariantService productVariantService;

    @GetMapping
    public List<ProductVariant> getAllProductVariants() {
        return productVariantService.getAllProductVariants();
    }

    @GetMapping("/{id}")
    public Optional<ProductVariant> getProductVariantById(@PathVariable Integer id) {
        return productVariantService.getProductVariantById(id);
    }

    @GetMapping("/product/{productId}")
    public List<ProductVariant> getProductVariantsByProductId(@PathVariable Integer productId) {
        return productVariantService.getProductVariantsByProductId(productId);
    }

    @GetMapping("/type/{variantType}")
    public List<ProductVariant> getProductVariantsByType(@PathVariable String variantType) {
        return productVariantService.getProductVariantsByType(variantType);
    }

    @PostMapping
    public ProductVariant createProductVariant(@RequestBody ProductVariant productVariant) {
        return productVariantService.createProductVariant(productVariant);
    }

    @PutMapping
    public ProductVariant updateProductVariant(@RequestBody ProductVariant productVariant) {
        return productVariantService.updateProductVariant(productVariant);
    }

    @DeleteMapping("/{id}")
    public void softDeleteProductVariant(@PathVariable Integer id) {
        productVariantService.softDeleteProductVariant(id);
    }
}