package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.Discount;
import com.mohammad.lychee.lychee.repository.DiscountRepository;
import com.mohammad.lychee.lychee.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;

    @Autowired
    public DiscountServiceImpl(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Discount> getDiscountById(Integer discountId) {
        if (discountId == null || discountId <= 0) {
            throw new IllegalArgumentException("Discount ID must be a positive number");
        }
        return discountRepository.findById(discountId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Discount> getDiscountByCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("Discount code cannot be null or empty");
        }
        return discountRepository.findByCode(code.trim());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Discount> getActiveDiscounts() {
        return discountRepository.findAllActive();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Discount> getValidDiscounts() {
        return discountRepository.findValidDiscounts();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Discount> getTopDiscountsForCarousel() {
        return discountRepository.findTop3ByOrderByDiscountPercentageDesc();
    }

    @Override
    public Discount createDiscount(Discount discount) {
        validateDiscountForCreation(discount);

        // Ensure it's a new discount (no ID set)
        discount.setDiscountId(0);

        return discountRepository.save(discount);
    }

    @Override
    public Discount updateDiscount(Discount discount) {
        if (discount.getDiscountId() <= 0) {
            throw new IllegalArgumentException("Discount ID must be provided for update");
        }

        // Check if discount exists
        Optional<Discount> existing = discountRepository.findById(discount.getDiscountId());
        if (existing.isEmpty()) {
            throw new RuntimeException("Discount with ID " + discount.getDiscountId() + " not found");
        }

        validateDiscountForUpdate(discount);

        return discountRepository.save(discount);
    }

    @Override
    public void toggleDiscountStatus(Integer discountId) {
        if (discountId == null || discountId <= 0) {
            throw new IllegalArgumentException("Discount ID must be a positive number");
        }

        // Check if discount exists
        if (discountRepository.findById(discountId).isEmpty()) {
            throw new RuntimeException("Discount with ID " + discountId + " not found");
        }

        discountRepository.toggleActive(discountId);
    }

    @Override
    public void deleteDiscount(Integer discountId) {
        if (discountId == null || discountId <= 0) {
            throw new IllegalArgumentException("Discount ID must be a positive number");
        }

        // Check if discount exists
        if (discountRepository.findById(discountId).isEmpty()) {
            throw new RuntimeException("Discount with ID " + discountId + " not found");
        }

        discountRepository.deleteById(discountId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isCodeAvailable(String code) {
        if (code == null || code.trim().isEmpty()) {
            return false;
        }
        return !discountRepository.existsByCode(code.trim());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Discount> validateDiscountCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return Optional.empty();
        }

        Optional<Discount> discount = discountRepository.findByCode(code.trim());

        // Check if discount exists and is currently valid
        if (discount.isPresent() && discount.get().isCurrentlyValid()) {
            return discount;
        }

        return Optional.empty();
    }

    // Private validation methods
    private void validateDiscountForCreation(Discount discount) {
        if (discount == null) {
            throw new IllegalArgumentException("Discount cannot be null");
        }

        validateDiscountCommon(discount);

        // Check if code already exists
        if (!isCodeAvailable(discount.getCode())) {
            throw new IllegalArgumentException("Discount code '" + discount.getCode() + "' already exists");
        }
    }

    private void validateDiscountForUpdate(Discount discount) {
        if (discount == null) {
            throw new IllegalArgumentException("Discount cannot be null");
        }

        validateDiscountCommon(discount);

        // Check if code already exists for another discount
        Optional<Discount> existingWithCode = discountRepository.findByCode(discount.getCode());
        if (existingWithCode.isPresent() &&
                existingWithCode.get().getDiscountId() != discount.getDiscountId()) {
            throw new IllegalArgumentException("Discount code '" + discount.getCode() + "' already exists");
        }
    }

    private void validateDiscountCommon(Discount discount) {
        // Validate code
        if (discount.getCode() == null || discount.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Discount code cannot be null or empty");
        }

        // Validate percentage
        if (discount.getDiscountPercentage() == null ||
                discount.getDiscountPercentage().doubleValue() <= 0 ||
                discount.getDiscountPercentage().doubleValue() > 100) {
            throw new IllegalArgumentException("Discount percentage must be between 0 and 100");
        }

        // Validate dates
        if (discount.getStartDate() != null && discount.getEndDate() != null) {
            if (discount.getStartDate().isAfter(discount.getEndDate())) {
                throw new IllegalArgumentException("Start date cannot be after end date");
            }
        }

        // Validate end date is not in the past (only for active discounts)
        if (discount.isActive() && discount.getEndDate() != null &&
                discount.getEndDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot create/update active discount with end date in the past");
        }
    }
}