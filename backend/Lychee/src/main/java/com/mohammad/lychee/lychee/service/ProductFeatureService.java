package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.ProductFeature;
import java.util.List;
import java.util.Optional;

public interface ProductFeatureService {
    List<ProductFeature> getAllProductFeatures();
    List<ProductFeature> getByProductId(Integer productId);
    Optional<ProductFeature> getFeatureById(Integer featureId);
    ProductFeature createProductFeature(ProductFeature productFeature);
    ProductFeature updateProductFeature(ProductFeature productFeature);
    void deleteProductFeature(Integer featureId);
}
