package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.ProductVariant;
import com.mohammad.lychee.lychee.repository.ProductVariantRepository;
import com.mohammad.lychee.lychee.service.ProductVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductVariantServiceImpl implements ProductVariantService {
    @Autowired
    private ProductVariantRepository productVariantRepository;
    @Autowired
    public ProductVariantServiceImpl(ProductVariantRepository productVariantRepository) {
        this.productVariantRepository = productVariantRepository;
    }

    @Override
    public List<ProductVariant> getAllProductVariants() {
        return productVariantRepository.findAll();
    }

    @Override
    public Optional<ProductVariant> getProductVariantById(Integer productVariantId) {
        return productVariantRepository.findById(productVariantId);
    }

    @Override
    public List<ProductVariant> getProductVariantsByProductId(Integer productId) {
        return productVariantRepository.findByProductId(productId);
    }

    @Override
    public List<ProductVariant> getProductVariantsBySize(String size) {
        return productVariantRepository.findBySize(size);
    }

    @Override
    public List<ProductVariant> getProductVariantsByColor(String color) {
        return productVariantRepository.findByColor(color);
    }

    @Override
    @Transactional
    public ProductVariant createProductVariant(ProductVariant productVariant) {
        return productVariantRepository.save(productVariant);
    }

    @Override
    @Transactional
    public ProductVariant updateProductVariant(ProductVariant productVariant) {
        Optional<ProductVariant> existingVariant = productVariantRepository.findById(productVariant.getProductVariantId());
        if (existingVariant.isEmpty()) {
            throw new IllegalArgumentException("Product variant with ID " + productVariant.getProductVariantId() + " does not exist");
        }
        return productVariantRepository.save(productVariant);
    }

    @Override
    @Transactional
    public void softDeleteProductVariant(Integer productVariantId) {
        productVariantRepository.softDelete(productVariantId);
    }

    @Override
    public List<ProductVariant> getProductVariantsByType(String variantType) {
        return productVariantRepository.findByVariantType(variantType);
    }
}