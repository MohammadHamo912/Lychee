package com.mohammad.lychee.lychee.repository.impl;

import com.mohammad.lychee.lychee.model.Address;
import com.mohammad.lychee.lychee.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class AddressRepositoryImpl implements AddressRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public AddressRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Address> addressRowMapper = (rs, rowNum) -> {
        Address address = new Address();
        address.setAddressId(rs.getInt("Address_ID"));
        address.setCity(rs.getString("city"));
        address.setStreet(rs.getString("street"));
        address.setBuilding(rs.getString("building"));
        return address;
    };

    @Override
    public List<Address> findAll() {
        String sql = "SELECT * FROM Address";
        return jdbcTemplate.query(sql, addressRowMapper);
    }

    @Override
    public Optional<Address> findById(Integer id) {
        try {
            String sql = "SELECT * FROM Address WHERE Address_ID = ?";
            Address address = jdbcTemplate.queryForObject(sql, addressRowMapper, id);
            return Optional.ofNullable(address);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }


    @Override
    public Address save(Address address) {
        if (address.getAddressId() == 0) {
            return insert(address);
        } else {
            return update(address);
        }
    }

    private Address insert(Address address) {
        String sql = "INSERT INTO Address (city, street, building) VALUES (?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, address.getCity());
            ps.setString(2, address.getStreet());
            ps.setString(3, address.getBuilding());
            return ps;
        }, keyHolder);

        address.setAddressId(Objects.requireNonNull(keyHolder.getKey()).intValue());
        return address;
    }

    @Override
    public Address update(Address address) {
        String sql = "UPDATE Address SET city = ?, street = ?, building = ? WHERE Address_ID = ?";
        jdbcTemplate.update(sql, address.getCity(), address.getStreet(), address.getBuilding(), address.getAddressId());
        return address;
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM Address WHERE Address_ID = ?";
        jdbcTemplate.update(sql, id);
    }
}
