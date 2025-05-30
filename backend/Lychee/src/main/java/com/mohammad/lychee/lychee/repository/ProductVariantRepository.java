package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.ProductVariant;
import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository {
    List<ProductVariant> findAll();
    Optional<ProductVariant> findById(Integer id);
<<<<<<< HEAD
    List<ProductVariant> findByVariantType(String variantType);
=======
    List<ProductVariant> findBySize(String size);
    List<ProductVariant> findByColor(String color);
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
    List<ProductVariant> findByProductId(Integer productId);
    ProductVariant save(ProductVariant productVariant);
    void delete(Integer id);
    void softDelete(Integer id);
}