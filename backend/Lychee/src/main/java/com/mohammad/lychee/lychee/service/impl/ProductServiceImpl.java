package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.Product;
import com.mohammad.lychee.lychee.repository.ProductRepository;
import com.mohammad.lychee.lychee.repository.ProductCategoryRepository;
import com.mohammad.lychee.lychee.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository,
                              ProductCategoryRepository productCategoryRepository) {
        this.productRepository = productRepository;
        this.productCategoryRepository = productCategoryRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> getProductById(Integer productId) {
        return productRepository.findById(productId);
    }

    @Override
    public Optional<Product> getProductByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode);
    }

    @Override
    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Product product) {
        Optional<Product> existingProduct = productRepository.findById(product.getProductId());
        if (existingProduct.isEmpty()) {
            throw new IllegalArgumentException("Product with ID " + product.getProductId() + " does not exist");
        }

        productRepository.save(product);
        return product;
    }

    @Override
    @Transactional
    public void softDeleteProduct(Integer productId) {
        productRepository.softDelete(productId);
    }

    @Override
    public Optional<Product> searchProductsByName(String name) {
        return productRepository.findByName(name);
    }

    @Override
    public List<Product> getProductsByCategory(Integer categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
}