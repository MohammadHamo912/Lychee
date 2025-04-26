package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Category;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository {
    List<Category> findAll();
    Optional<Category> findById(Integer id);
    List<Category> findByParentId(Integer parentId);
    List<Category> findRootCategories();
    Category save(Category category);
    void delete(Integer id);
}