package com.mohammad.lychee.lychee.repository;

import  com.mohammad.lychee.lychee.model.Address;
import java.util.List;
import java.util.Optional;

public interface AddressRepository {
    List<Address> findAll();
    Optional<Address> findById(Integer id);
    List<Address> findByUserId(Integer userId);
    Address save(Address address);
    void delete(Integer id);
}