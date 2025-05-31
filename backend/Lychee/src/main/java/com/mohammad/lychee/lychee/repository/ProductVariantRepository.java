package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.ProductVariant;
import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository {
    List<ProductVariant> findAll();
    Optional<ProductVariant> findById(Integer id);
    List<ProductVariant> findByProductVariantIdIn(List<Integer> variantIds);

    List<ProductVariant> findBySize(String size);
    List<ProductVariant> findByColor(String color);
    List<ProductVariant> findByProductId(Integer productId);
    ProductVariant save(ProductVariant productVariant);
    void delete(Integer id);
    void softDelete(Integer id);

    boolean existsById(Integer id);
}