package org.ies.deti.ua.medisync.model;

import jakarta.persistence.*;

@Entity(name = "Code")
public class Code {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String code;
    private String phoneNumber;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Patient patient;

    public Code() {
    }

    public Code(String code, String phoneNumber, Patient patient) {
        this.code = code;
        this.phoneNumber = phoneNumber;
        this.patient = patient;
    }

    public String getCode() {
        return code;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}
