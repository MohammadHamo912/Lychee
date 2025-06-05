package com.mohammad.lychee.lychee.dto;

import java.math.BigDecimal;
import java.util.List;

public class CheckoutDTO {
    private Integer userId;
    private ShippingAddressDTO shippingAddress;
    private BillingAddressDTO billingAddress;
    private PaymentDataDTO paymentData;
    private String orderNotes;
    private ContactInfoDTO contactInfo;
    private Boolean subscribeToNewsletter;
    private List<CartItemDTO> cartItems;

    // Constructors
    public CheckoutDTO() {}

    // Inner DTOs
    public static class ShippingAddressDTO {
        private String firstName;
        private String lastName;
        private String address;
        private String apartmentUnit;
        private String city;
        private String street;
        private String building;

        // Constructors
        public ShippingAddressDTO() {}

        // Getters and Setters
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getApartmentUnit() { return apartmentUnit; }
        public void setApartmentUnit(String apartmentUnit) { this.apartmentUnit = apartmentUnit; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getStreet() { return street; }
        public void setStreet(String street) { this.street = street; }

        public String getBuilding() { return building; }
        public void setBuilding(String building) { this.building = building; }
    }

    public static class BillingAddressDTO {
        private String firstName;
        private String lastName;
        private String address;
        private String apartmentUnit;
        private String city;
        private String street;
        private String building;
        private Boolean sameAsShipping;

        // Constructors
        public BillingAddressDTO() {}

        // Getters and Setters
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getApartmentUnit() { return apartmentUnit; }
        public void setApartmentUnit(String apartmentUnit) { this.apartmentUnit = apartmentUnit; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getStreet() { return street; }
        public void setStreet(String street) { this.street = street; }

        public String getBuilding() { return building; }
        public void setBuilding(String building) { this.building = building; }

        public Boolean getSameAsShipping() { return sameAsShipping; }
        public void setSameAsShipping(Boolean sameAsShipping) { this.sameAsShipping = sameAsShipping; }
    }

    public static class PaymentDataDTO {
        private String paymentMethod;
        private String cardName;
        private String cardNumber;
        private String expiryDate;
        private String cvv;

        // Constructors
        public PaymentDataDTO() {}

        // Getters and Setters
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

        public String getCardName() { return cardName; }
        public void setCardName(String cardName) { this.cardName = cardName; }

        public String getCardNumber() { return cardNumber; }
        public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

        public String getExpiryDate() { return expiryDate; }
        public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

        public String getCvv() { return cvv; }
        public void setCvv(String cvv) { this.cvv = cvv; }
    }

    public static class ContactInfoDTO {
        private String email;
        private String phone;

        // Constructors
        public ContactInfoDTO() {}

        // Getters and Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    public static class CartItemDTO {
        private Integer itemId;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal discount;
        private String name;

        // Constructors
        public CartItemDTO() {}

        // Getters and Setters
        public Integer getItemId() { return itemId; }
        public void setItemId(Integer itemId) { this.itemId = itemId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public BigDecimal getDiscount() { return discount; }
        public void setDiscount(BigDecimal discount) { this.discount = discount; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class CheckoutResponseDTO {
        private boolean success;
        private Integer orderId;
        private String message;
        private String transactionReference;

        // Constructors
        public CheckoutResponseDTO() {}

        public CheckoutResponseDTO(boolean success, Integer orderId, String message) {
            this.success = success;
            this.orderId = orderId;
            this.message = message;
        }

        // Getters and Setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public Integer getOrderId() { return orderId; }
        public void setOrderId(Integer orderId) { this.orderId = orderId; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getTransactionReference() { return transactionReference; }
        public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }
    }

    // Main DTO Getters and Setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public ShippingAddressDTO getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(ShippingAddressDTO shippingAddress) { this.shippingAddress = shippingAddress; }

    public BillingAddressDTO getBillingAddress() { return billingAddress; }
    public void setBillingAddress(BillingAddressDTO billingAddress) { this.billingAddress = billingAddress; }

    public PaymentDataDTO getPaymentData() { return paymentData; }
    public void setPaymentData(PaymentDataDTO paymentData) { this.paymentData = paymentData; }

    public String getOrderNotes() { return orderNotes; }
    public void setOrderNotes(String orderNotes) { this.orderNotes = orderNotes; }

    public ContactInfoDTO getContactInfo() { return contactInfo; }
    public void setContactInfo(ContactInfoDTO contactInfo) { this.contactInfo = contactInfo; }

    public Boolean getSubscribeToNewsletter() { return subscribeToNewsletter; }
    public void setSubscribeToNewsletter(Boolean subscribeToNewsletter) { this.subscribeToNewsletter = subscribeToNewsletter; }

    public List<CartItemDTO> getCartItems() { return cartItems; }
    public void setCartItems(List<CartItemDTO> cartItems) { this.cartItems = cartItems; }
}