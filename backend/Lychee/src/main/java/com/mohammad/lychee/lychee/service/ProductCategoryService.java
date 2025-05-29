package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.ProductCategory;
import java.util.List;

public interface ProductCategoryService {
    List<ProductCategory> getAllProductCategories();
    List<ProductCategory> getByProductId(Integer productId);
    List<ProductCategory> getByCategoryId(Integer categoryId);
    ProductCategory createProductCategory(ProductCategory productCategory);
    void deleteProductCategory(Integer productId, Integer categoryId);
}
