package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.ProductCategory;
import java.util.List;
import java.util.Optional;

public interface ProductCategoryRepository {
    List<ProductCategory> findAll();
    Optional<ProductCategory> findByProductIdAndCategoryId(Integer productId, Integer categoryId);
    List<ProductCategory> findByProductId(Integer productId);
    List<ProductCategory> findByCategoryId(Integer categoryId);
    ProductCategory save(ProductCategory productCategory);
    void delete(Integer productId, Integer categoryId);
}