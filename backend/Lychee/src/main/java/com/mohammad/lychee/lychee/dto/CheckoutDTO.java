package com.mohammad.lychee.lychee.dto;

public class CheckoutDTO {
    private Integer userId;
    private ShippingAddressDTO shippingAddress;
    private String orderNotes;

    private String paymentMethod;


    // Constructors
    public CheckoutDTO() {}

    // Inner DTOs
    public static class ShippingAddressDTO {
        private String city;
        private String street;
        private String building;

        // Constructors
        public ShippingAddressDTO() {}

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getStreet() { return street; }
        public void setStreet(String street) { this.street = street; }

        public String getBuilding() { return building; }
        public void setBuilding(String building) { this.building = building; }
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


    public String getOrderNotes() { return orderNotes; }
    public void setOrderNotes(String orderNotes) { this.orderNotes = orderNotes; }
    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

}
