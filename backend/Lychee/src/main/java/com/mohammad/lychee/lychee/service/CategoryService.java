package com.mohammad.lychee.lychee.service;

import com.mohammad.lychee.lychee.model.Category;
import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<Category> getAllCategories();
    Optional<Category> getCategoryById(Integer categoryId);
    List<Category> getSubcategories(Integer parentId);
    Category createCategory(Category category);
    Category updateCategory(Category category);
    void deleteCategory(Integer categoryId);
}
