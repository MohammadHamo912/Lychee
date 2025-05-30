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

<<<<<<< HEAD
    @GetMapping("/type/{variantType}")
    public List<ProductVariant> getProductVariantsByType(@PathVariable String variantType) {
        return productVariantService.getProductVariantsByType(variantType);
=======
    @GetMapping("/size/{size}")
    public List<ProductVariant> getProductVariantsBySize(@PathVariable String size) {
        return productVariantService.getProductVariantsBySize(size);
    }

    @GetMapping("/color/{color}")
    public List<ProductVariant> getProductVariantsByColor(@PathVariable String color) {
        return productVariantService.getProductVariantsByColor(color);
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
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