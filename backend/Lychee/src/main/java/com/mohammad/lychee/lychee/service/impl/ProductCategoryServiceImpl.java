package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.ProductCategory;
import com.mohammad.lychee.lychee.repository.ProductCategoryRepository;
import com.mohammad.lychee.lychee.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductCategoryServiceImpl implements ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;

    @Autowired
    public ProductCategoryServiceImpl(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    @Override
    public List<ProductCategory> getAllProductCategories() {
        return productCategoryRepository.findAll();
    }

    @Override
    public List<ProductCategory> getByProductId(Integer productId) {
        return productCategoryRepository.findByProductId(productId);
    }

    @Override
    public List<ProductCategory> getByCategoryId(Integer categoryId) {
        return productCategoryRepository.findByCategoryId(categoryId);
    }

    @Override
    @Transactional
    public ProductCategory createProductCategory(ProductCategory productCategory) {
        return productCategoryRepository.save(productCategory);
    }

    @Override
    @Transactional
    public void deleteProductCategory(Integer productId, Integer categoryId) {
        productCategoryRepository.delete(productId, categoryId);
    }
}
