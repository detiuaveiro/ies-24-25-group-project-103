package org.ies.deti.ua.medisync.model;


import jakarta.persistence.*;

@Entity
public class Visitor {
    @Id
    private String phoneNumber;

    @ManyToOne
    private Patient patient;

    public Visitor() {}

    public Visitor(String phoneNumber, Patient patient) {
        this.phoneNumber = phoneNumber;
        this.patient = patient;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}
