package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.Category;
import com.mohammad.lychee.lychee.repository.CategoryRepository;
import com.mohammad.lychee.lychee.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<Category> getCategoryById(Integer categoryId) {
        return categoryRepository.findById(categoryId);
    }

    @Override
    public List<Category> getSubcategories(Integer parentId) {
        return categoryRepository.findSubcategories(parentId);
    }

    @Override
    @Transactional
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Category updateCategory(Category category) {
        Optional<Category> existing = categoryRepository.findById(category.getCategory_id());
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Category with ID " + category.getCategory_id() + " not found");
        }
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Integer categoryId) {
        categoryRepository.delete(categoryId);
    }
}
