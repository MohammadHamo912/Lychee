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
    public List<Product> batchLoadProducts(List<Integer> productIds) {
        return productRepository.findByProductIdIn(productIds);
    }
    @Override
    public Optional<Product> getProductByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode);
    }

    @Override
    public List<Product> getProductByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    @Override
    public Optional<Product> searchProductsByName(String name) {
        return productRepository.findByName(name);
    }

    @Override
    public List<Product> getProductsByCategory(Integer categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    public List<Product> getProductsByIds(List<Integer> ids) {
        return productRepository.findAllById(ids);
    }

    @Override
    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Product product) {
        if (!productRepository.existsById(product.getProductId())) {
            throw new IllegalArgumentException("Product with ID " + product.getProductId() + " does not exist.");
        }
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void softDeleteProduct(Integer productId) {
        productRepository.softDelete(productId);
    }
}
