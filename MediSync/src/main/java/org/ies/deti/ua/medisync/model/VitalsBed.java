package org.ies.deti.ua.medisync.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class VitalsBed {
    @JsonProperty("bed_id")
    private String bedId;

    @JsonProperty("heart_rate")
    private String heartRate;

    @JsonProperty("oxygen_saturation")
    private String oxygenSaturation;

    @JsonProperty("blood_pressure")
    private String[] bloodPressure;

    @JsonProperty("temperature")
    private String temperature;

    public VitalsBed() {
    }

    public VitalsBed(String bedId, String heartRate, String oxygenSaturation, String[] bloodPressure, String temperature) {
        this.bedId = bedId;
        this.heartRate = heartRate;
        this.oxygenSaturation = oxygenSaturation;
        this.bloodPressure = bloodPressure;
        this.temperature = temperature;
    }

    public String getBedId() {
        return bedId;
    }

    public void setBedId(String bedId) {
        this.bedId = bedId;
    }

    public String getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(String heartRate) {
        this.heartRate = heartRate;
    }

    public String getOxygenSaturation() {
        return oxygenSaturation;
    }

    public void setOxygenSaturation(String oxygenSaturation) {
        this.oxygenSaturation = oxygenSaturation;
    }

    public String[] getBloodPressure() {
        return bloodPressure;
    }

    public void setBloodPressure(String[] bloodPressure) {
        this.bloodPressure = bloodPressure;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }
    

    @Override
    public String toString() {
        return "Vitals{" +
                "bedId='" + bedId + '\'' +
                ", heartRate='" + heartRate + '\'' +
                ", oxygenSaturation='" + oxygenSaturation + '\'' +
                ", bloodPressure=" + java.util.Arrays.toString(bloodPressure) +
                ", temperature='" + temperature + '\'' +
                '}';
    }
}
