//Easter Egg: Ricardo: Gosto de uma mala no comboio

package org.ies.deti.ua.medisync.model;


import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

@Document(collection = "medicine")
public class Patient {

    private enum Gender {
        MALE,
        FEMALE
    }
    @Id
    private String id;

    private String name;
    private String gender;
    private Date birthDate;
    private Date estimatedDischargeDate;
    private Float weight;
    private Float height;
    private Float bmi;
    private List<String> conditions;
    private List<String> observations;
    private List<MedicationAdministration> medicationList;

    public Patient() {
    }

    public Patient(String name, String gender, Date birthDate, Date estimatedDischargeDate, Float weight, Float height, Float bmi, List<String> conditions, List<String> observations) {
        this.name = name;
        this.gender = gender;
        this.birthDate = birthDate;
        this.estimatedDischargeDate = estimatedDischargeDate;
        this.weight = weight;
        this.height = height;
        this.bmi = bmi;
        this.conditions = conditions;
        this.observations = observations;
        this.medicationList = new 
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return this.gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }

    public float getWeight(){
        return weight;
    }
    public void setWeight(float weight){
        this.weight = weight;
    }

    public float getHeight(){
        return height;
    }
    public void setHeight(float height){
        this.height = height;
    }

     public float getBmi(){
        return bmi;
    }
    public void setBmi(float bmi){
        this.bmi = bmi;
    }

    public Date getBirthDate(){
        return birthDate;
    }
    public void setBirthDate(Date birthDate){
        this.birthDate = birthDate;
    }

    public List<String> getConditions(){
        return conditions;
    }
    public void setConditions(List<String> conditions){
        this.conditions = conditions;
    }


    public List<String> getObservations(){
        return observations;
    }
    public void setObservations(List<String> observations){
        this.observations = observations;
    }
}
