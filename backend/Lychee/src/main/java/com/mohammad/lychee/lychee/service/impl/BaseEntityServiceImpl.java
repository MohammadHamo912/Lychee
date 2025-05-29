/*package com.mohammad.lychee.lychee.service.impl;

import com.mohammad.lychee.lychee.model.BaseEntity;
import com.mohammad.lychee.lychee.repository.BaseEntityRepository;
import com.mohammad.lychee.lychee.service.BaseEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BaseEntityServiceImpl<T extends BaseEntity> implements BaseEntityService {

    private final BaseEntityRepository baseEntityRepository;

    @Autowired
    public BaseEntityServiceImpl(BaseEntityRepository baseEntityRepository) {
        this.baseEntityRepository = baseEntityRepository;
    }

    @Override
    public List<T> getAll() {
        return baseEntityRepository.findAll();
    }

    @Override
    public Optional<T> getById(Integer id) {
        return baseEntityRepository.findById(id);
    }


    @Override
    public BaseEntity update(BaseEntity entity) {
        return null;
    }

    @Override
    public void softDelete(Integer id) {

    }

    @Override
    public T create(T entity) {
         return baseEntityRepository.save(entity);
    }

    @Override
    @Transactional
    public User updateUser(User user) {
        // Check if user exists
        Optional<User> existingUser = userRepository.findById(user.getUserId());
        if (existingUser.isEmpty()) {
            throw new IllegalArgumentException("User with ID " + user.getUserId() + " does not exist");
        }

        userRepository.save(user);
        return user;
    }

    @Override
    @Transactional
    public void softDeleteUser(Integer userId) {
        userRepository.softDelete(userId);
    }

}*/