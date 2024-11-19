package org.ies.deti.ua.medisync.dto;

import org.ies.deti.ua.medisync.model.PatientWithVitals;

public class BedWithPatientDTO {
    private Long bedId;
    private String bedName; // Or bedNumber if applicable
    private PatientWithVitals patient;

    // Constructor
    public BedWithPatientDTO(Long bedId, String bedName, PatientWithVitals patient) {
        this.bedId = bedId;
        this.bedName = bedName;
        this.patient = patient;
    }

    // Getters and setters
    public Long getBedId() {
        return bedId;
    }

    public void setBedId(Long bedId) {
        this.bedId = bedId;
    }

    public String getBedName() {
        return bedName;
    }

    public void setBedName(String bedName) {
        this.bedName = bedName;
    }

    public PatientWithVitals getPatient() {
        return patient;
    }

    public void setPatient(PatientWithVitals patient) {
        this.patient = patient;
    }
}
