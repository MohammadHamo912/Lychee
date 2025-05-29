package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.Discount;
import com.mohammad.lychee.lychee.repository.DiscountRepository;
import com.mohammad.lychee.lychee.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;

    @Autowired
    public DiscountServiceImpl(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    @Override
    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    @Override
    public Optional<Discount> getDiscountById(Integer discountId) {
        return discountRepository.findById(discountId);
    }

    @Override
    public List<Discount> getValidDiscounts() {
        return discountRepository.findValidDiscounts();
    }

    @Override
    @Transactional
    public Discount createDiscount(Discount discount) {
        return discountRepository.save(discount);
    }

    @Override
    @Transactional
    public Discount updateDiscount(Discount discount) {
        Optional<Discount> existing = discountRepository.findById(discount.getDiscountId());
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Discount with ID " + discount.getDiscountId() + " not found");
        }
        return discountRepository.save(discount);
    }

    @Override
    @Transactional
    public void deleteDiscount(Integer discountId) {
        discountRepository.delete(discountId);
    }
}
