package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.ProductFeature;
import java.util.List;
import java.util.Optional;

public interface ProductFeatureRepository {
    List<ProductFeature> findAll();
    Optional<ProductFeature> findById(Integer id);
    List<ProductFeature> findByProductId(Integer productId);
    ProductFeature save(ProductFeature productFeature);
    void delete(Integer id);
}