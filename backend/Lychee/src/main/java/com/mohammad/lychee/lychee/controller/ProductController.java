package com.mohammad.lychee.lychee.controller;

import com.mohammad.lychee.lychee.model.Product;
import com.mohammad.lychee.lychee.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Optional<Product> getProductById(@PathVariable Integer id) {
        return productService.getProductById(id);
    }

    @GetMapping("/barcode/{barcode}")
    public Optional<Product> getProductByBarcode(@PathVariable String barcode) {
        return productService.getProductByBarcode(barcode);
    }

    @GetMapping("/name/{name}")
    public Optional<Product> searchProductByName(@PathVariable String name) {
        return productService.searchProductsByName(name);
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Integer categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    @PutMapping
    public Product updateProduct(@RequestBody Product product) {
        return productService.updateProduct(product);
    }

    @DeleteMapping("/{id}")
    public void softDeleteProduct(@PathVariable Integer id) {
        productService.softDeleteProduct(id);
    }
}
