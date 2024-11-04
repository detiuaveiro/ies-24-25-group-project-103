package org.ies.deti.ua.medisync.model;

public class VisitorDTO {
    private String name;
    private String phoneNumber;

    public VisitorDTO() {}

    public VisitorDTO(String name, String phoneNumber) {
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
