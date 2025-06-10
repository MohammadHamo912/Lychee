package com.mohammad.lychee.lychee.dto;

public class CheckoutDTO {
    private Integer user_id;
    private ShippingAddressDTO shipping_address;
    private String order_notes;

    private String payment_method;


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
        private Integer order_id;
        private String message;
        private String transaction_reference;

        // Constructors
        public CheckoutResponseDTO() {}

        public CheckoutResponseDTO(boolean success, Integer order_id, String message) {
            this.success = success;
            this.order_id = order_id;
            this.message = message;
        }

        // Getters and Setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public Integer getOrder_id() { return order_id; }
        public void setOrder_id(Integer order_id) { this.order_id = order_id; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getTransaction_reference() { return transaction_reference; }
        public void setTransaction_reference(String transaction_reference) { this.transaction_reference = transaction_reference; }
    }

    // Main DTO Getters and Setters
    public Integer getUser_id() { return user_id; }
    public void setUser_id(Integer user_id) { this.user_id = user_id; }

    public ShippingAddressDTO getShipping_address() { return shipping_address; }
    public void setShipping_address(ShippingAddressDTO shipping_address) { this.shipping_address = shipping_address; }


    public String getOrder_notes() { return order_notes; }
    public void setOrder_notes(String order_notes) { this.order_notes = order_notes; }
    public String getPayment_method() {
        return payment_method;
    }

    public void setPayment_method(String payment_method) {
        this.payment_method = payment_method;
    }

}
