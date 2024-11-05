package org.ies.deti.ua.medisync.model;

public class PatientWithVitals {
    private Patient patient;
    private Vitals vitals;

    public PatientWithVitals() {}

    public PatientWithVitals(Patient patient, Vitals vitals) {
        this.patient = patient;
        this.vitals = vitals;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Vitals getVitals() {
        return vitals;
    }

    public void setVitals(Vitals vitals) {
        this.vitals = vitals;
    }

    @Override
    public String toString() {
        return "PatientWithVitals{" +
                "patient=" + patient +
                ", vitals=" + vitals +
                '}';
    }
    
}
