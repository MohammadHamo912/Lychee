package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.ProductVariant;
import com.mohammad.lychee.lychee.service.ProductVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productvariants")
public class ProductVariantController {

    private final ProductVariantService productVariantService;

    @Autowired
    public ProductVariantController(ProductVariantService productVariantService) {
        this.productVariantService = productVariantService;
    }

    @GetMapping
    public List<ProductVariant> getAllProductVariants() {
        return productVariantService.getAllProductVariants();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductVariant> getProductVariantById(@PathVariable Integer id) {
        return productVariantService.getProductVariantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/batch-load")
    public List<ProductVariant> batchLoadProductVariants(@RequestBody List<Integer> variantIds) {
        return productVariantService.batchLoadProductVariants(variantIds);
    }
    @GetMapping("/product/{productId}")
    public List<ProductVariant> getProductVariantsByProductId(@PathVariable Integer productId) {
        return productVariantService.getProductVariantsByProductId(productId);
    }




    @GetMapping("/size/{size}")
    public List<ProductVariant> getProductVariantsBySize(@PathVariable String size) {
        return productVariantService.getProductVariantsBySize(size);
    }

    @GetMapping("/color/{color}")
    public List<ProductVariant> getProductVariantsByColor(@PathVariable String color) {
        return productVariantService.getProductVariantsByColor(color);
    }

    @PostMapping
    public ResponseEntity<ProductVariant> createProductVariant(@RequestBody ProductVariant productVariant) {
        ProductVariant created = productVariantService.createProductVariant(productVariant);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductVariant> updateProductVariant(@PathVariable Integer id,
                                                               @RequestBody ProductVariant productVariant) {
        productVariant.setProduct_variant_id(id);
        ProductVariant updated = productVariantService.updateProductVariant(productVariant);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteProductVariant(@PathVariable Integer id) {
        productVariantService.softDeleteProductVariant(id);
        return ResponseEntity.noContent().build();
    }
}
