package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.ProductFeature;
import com.mohammad.lychee.lychee.repository.ProductFeatureRepository;
import com.mohammad.lychee.lychee.service.ProductFeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductFeatureServiceImpl implements ProductFeatureService {

    private final ProductFeatureRepository productFeatureRepository;

    @Autowired
    public ProductFeatureServiceImpl(ProductFeatureRepository productFeatureRepository) {
        this.productFeatureRepository = productFeatureRepository;
    }

    @Override
    public List<ProductFeature> getAllProductFeatures() {
        return productFeatureRepository.findAll();
    }

    @Override
    public List<ProductFeature> getByProductId(Integer productId) {
        return productFeatureRepository.findByProductId(productId);
    }

    @Override
    public Optional<ProductFeature> getFeatureById(Integer featureId) {
        return productFeatureRepository.findById(featureId);
    }

    @Override
    @Transactional
    public ProductFeature createProductFeature(ProductFeature productFeature) {
        return productFeatureRepository.save(productFeature);
    }

    @Override
    @Transactional
    public ProductFeature updateProductFeature(ProductFeature productFeature) {
        Optional<ProductFeature> existing = productFeatureRepository.findById(productFeature.getFeatureId());
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("ProductFeature with ID " + productFeature.getFeatureId() + " not found");
        }
        return productFeatureRepository.save(productFeature);
    }

    @Override
    @Transactional
    public void deleteProductFeature(Integer featureId) {
        productFeatureRepository.delete(featureId);
    }
}
