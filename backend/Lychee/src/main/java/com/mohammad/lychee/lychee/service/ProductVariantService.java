package com.mohammad.lychee.lychee.service;

<<<<<<< HEAD

=======
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
import com.mohammad.lychee.lychee.model.ProductVariant;
import java.util.List;
import java.util.Optional;

public interface ProductVariantService {
    List<ProductVariant> getAllProductVariants();
    Optional<ProductVariant> getProductVariantById(Integer productVariantId);
    List<ProductVariant> getProductVariantsByProductId(Integer productId);
<<<<<<< HEAD
    ProductVariant createProductVariant(ProductVariant productVariant);
    ProductVariant updateProductVariant(ProductVariant productVariant);
    void softDeleteProductVariant(Integer productVariantId);
    List<ProductVariant> getProductVariantsByType(String variantType);
=======
    List<ProductVariant> getProductVariantsBySize(String size);
    List<ProductVariant> getProductVariantsByColor(String color);
    ProductVariant createProductVariant(ProductVariant productVariant);
    ProductVariant updateProductVariant(ProductVariant productVariant);
    void softDeleteProductVariant(Integer productVariantId);
>>>>>>> d1474035a0413c9afbf4e465f915032571632aad
}