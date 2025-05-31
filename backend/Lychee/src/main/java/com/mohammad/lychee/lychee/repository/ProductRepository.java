package com.mohammad.lychee.lychee.repository;

import com.mohammad.lychee.lychee.model.Product;

import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    List<Product> findAll();
    List<Product> findByProductIdIn(List<Integer> productIds);

    Optional<Product> findById(Integer id);
    Optional<Product> findByName(String name);
    Optional<Product> findByBarcode(String barcode);
    List<Product> findByCategoryId(Integer categoryId);
    List<Product> findAllById(Iterable<Integer> ids);
    Product save(Product product);
    void delete(Integer id);
    void softDelete(Integer id);
    boolean existsById(Integer id);
}
