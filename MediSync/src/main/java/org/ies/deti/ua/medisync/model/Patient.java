package org.ies.deti.ua.medisync.model;

import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "patient")
public class Patient {

    public enum Gender {
        MALE,
        FEMALE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Temporal(TemporalType.DATE)
    @Column(name = "birth_date")
    private Date birthDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "estimated_discharge_date")
    private Date estimatedDischargeDate;

    @Column(name = "weight")
    private Float weight;

    @Column(name = "height")
    private Float height;

    @ElementCollection
    @Column(name = "conditions")
    private List<String> conditions;

    @ElementCollection
    @Column(name = "observations")
    private List<String> observations;

    @OneToMany(mappedBy = "patient")
    private List<Medication> medicationList;

    @OneToOne(mappedBy = "assignedPatient", optional = false)
    private Bed bed;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor assignedDoctor;

    public Patient() {}

    public Patient(String name, Gender gender, Date birthDate, Date estimatedDischargeDate, Float weight, Float height, List<String> conditions, List<String> observations, List<Medication> medicationList, Bed bed, Doctor assignedDoctor) {
        this.name = name;
        this.gender = gender;
        this.birthDate = birthDate;
        this.estimatedDischargeDate = estimatedDischargeDate;
        this.weight = weight;
        this.height = height;
        this.conditions = conditions;
        this.observations = observations;
        this.medicationList = medicationList;
        this.bed = bed;
        this.assignedDoctor = assignedDoctor;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Gender getGender() {
        return this.gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Float getWeight() {
        return weight;
    }

    public void setWeight(Float weight) {
        this.weight = weight;
    }

    public Float getHeight() {
        return height;
    }

    public void setHeight(Float height) {
        this.height = height;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public Date getEstimatedDischargeDate() {
        return estimatedDischargeDate;
    }

    public void setEstimatedDischargeDate(Date estimatedDischargeDate) {
        this.estimatedDischargeDate = estimatedDischargeDate;
    }

    public List<String> getConditions() {
        return conditions;
    }

    public void setConditions(List<String> conditions) {
        this.conditions = conditions;
    }

    public List<String> getObservations() {
        return observations;
    }

    public void setObservations(List<String> observations) {
        this.observations = observations;
    }

    public List<Medication> getMedicationList() {
        return medicationList;
    }

    public void setMedicationList(List<Medication> medicationList) {
        this.medicationList = medicationList;
    }

    public Bed getBed() {
        return bed;
    }

    public void setBed(Bed bed) {
        this.bed = bed;
    }

    public Doctor getAssignedDoctor() {
        return assignedDoctor;
    }

    public void setAssignedDoctor(Doctor assignedDoctor) {
        this.assignedDoctor = assignedDoctor;
    }
}
