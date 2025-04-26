package com.mohammad.lychee.lychee.model;

public class Address {
    private int addressId;
    private String city;
    private String street;
    private String building;

    public Address() {}

    public Address(int addressId, String city, String street, String building) {
        this.addressId = addressId;
        this.city = city;
        this.street = street;
        this.building = building;
    }

    // Getters and setters 👇

    public int getAddressId() {
        return addressId;
    }

    public void setAddressId(int addressId) {
        this.addressId = addressId;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }
}