package com.mohammad.lychee.lychee.repository;

import  com.mohammad.lychee.lychee.model.Address;
import java.util.List;
import java.util.Optional;

public interface AddressRepository {
    List<Address> findAll();
    Optional<Address> findById(Integer id);
    Address save(Address address);
    void delete(Integer id);
    Address update(Address address);
}