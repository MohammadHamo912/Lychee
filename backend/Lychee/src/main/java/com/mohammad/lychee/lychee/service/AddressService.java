package com.mohammad.lychee.lychee.service;
import com.mohammad.lychee.lychee.model.Address;
import java.util.List;
import java.util.Optional;

public interface AddressService {
    List<Address> getAllAddresses();
    Optional<Address> getAddressById(Integer addressId);
    Address createAddress(Address address);
    Address updateAddress(Address address);
    void deleteAddress(Integer addressId);
}