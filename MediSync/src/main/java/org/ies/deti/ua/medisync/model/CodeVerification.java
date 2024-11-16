package org.ies.deti.ua.medisync.model;

public class CodeVerification {
    private String code;
    private String phoneNumber;

    public CodeVerification() {
    }

    public CodeVerification(String code, String phoneNumber) {
        this.code = code;
        this.phoneNumber = phoneNumber;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
