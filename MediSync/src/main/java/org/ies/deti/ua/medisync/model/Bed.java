package org.ies.deti.ua.medisync.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bed")
public class Bed {

    @Id
    private String id;
    private int bedNumber;          // Bed number within a room
    @DBRef
    private Patient assignedPatient; // Reference to a Patient entity (nullable if empty)

    // Constructors
    public Bed() {}

    public Bed(int bedNumber) {
        this.bedNumber = bedNumber;
        this.assignedPatient = null; // Initially empty
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getBedNumber() {
        return bedNumber;
    }

    public void setBedNumber(int bedNumber) {
        this.bedNumber = bedNumber;
    }

    public Patient getAssignedPatient() {
        return assignedPatient;
    }

    public void setAssignedPatient(Patient assignedPatient) {
        this.assignedPatient = assignedPatient;
    }
}
