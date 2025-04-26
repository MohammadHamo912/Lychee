package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.Product;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> getAllProducts();
    Optional<Product> getProductById(Integer productId);
    Optional<Product> getProductByBarcode(String barcode);
    Product createProduct(Product product);
    Product updateProduct(Product product);
    void softDeleteProduct(Integer productId);
    Optional<Product> searchProductsByName(String name);
    List<Product> getProductsByCategory(Integer categoryId);
}