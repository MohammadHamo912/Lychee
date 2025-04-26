package com.mohammad.lychee.lychee.repository;
import com.mohammad.lychee.lychee.model.Product;
import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    List<Product> findAll();
    Optional<Product> findById(Integer id);
    Optional<Product> findByBarcode(String barcode);
    List<Product> findByCategoryId(Integer categoryId);
    Product save(Product product);
    void delete(Integer id);
    void softDelete(Integer id);
}