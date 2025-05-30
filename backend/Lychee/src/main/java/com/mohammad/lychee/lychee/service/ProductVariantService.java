package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.ProductVariant;
import java.util.List;
import java.util.Optional;

public interface ProductVariantService {
    List<ProductVariant> getAllProductVariants();
    Optional<ProductVariant> getProductVariantById(Integer productVariantId);
    List<ProductVariant> getProductVariantsByProductId(Integer productId);
    List<ProductVariant> getProductVariantsBySize(String size);
    List<ProductVariant> getProductVariantsByColor(String color);
    ProductVariant createProductVariant(ProductVariant productVariant);
    ProductVariant updateProductVariant(ProductVariant productVariant);
    void softDeleteProductVariant(Integer productVariantId);
    List<ProductVariant> batchLoadProductVariants(List<Integer> variantIds);


}