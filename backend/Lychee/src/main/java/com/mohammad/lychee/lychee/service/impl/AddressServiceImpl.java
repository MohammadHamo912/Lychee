package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.Address;
import com.mohammad.lychee.lychee.repository.AddressRepository;
import com.mohammad.lychee.lychee.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;

    @Autowired
    public AddressServiceImpl(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Override
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    @Override
    public Optional<Address> getAddressById(Integer addressId) {
        return addressRepository.findById(addressId);
    }

    @Override
    @Transactional
    public Address createAddress(Address address) {
        return addressRepository.save(address);
    }

    @Override
    @Transactional
    public Address updateAddress(Address address) {
        Optional<Address> existingAddress = addressRepository.findById(address.getAddress_id());
        if (existingAddress.isEmpty()) {
            throw new IllegalArgumentException("Address with ID " + address.getAddress_id() + " does not exist");
        }

        addressRepository.save(address);
        return address;
    }

    @Override
    @Transactional
    public void deleteAddress(Integer addressId) {
        addressRepository.delete(addressId);
    }


}