package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.ProductVariant;
import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository {
    List<ProductVariant> findAll();
    Optional<ProductVariant> findById(Integer id);
    List<ProductVariant> findByProductId(Integer productId);
    ProductVariant save(ProductVariant productVariant);
    void delete(Integer id);
    void softDelete(Integer id);
}