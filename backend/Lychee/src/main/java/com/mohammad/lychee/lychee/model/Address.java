package com.mohammad.lychee.lychee.model;

public class Address {
    private int address_id;
    private String city;
    private String street;
    private String building;

    public Address() {}

    public Address(int address_id, String city, String street, String building) {
        this.address_id = address_id;
        this.city = city;
        this.street = street;
        this.building = building;
    }

    // Getters and setters 👇

    public int getAddress_id() {
        return address_id;
    }

    public void setAddress_id(int address_id) {
        this.address_id = address_id;
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