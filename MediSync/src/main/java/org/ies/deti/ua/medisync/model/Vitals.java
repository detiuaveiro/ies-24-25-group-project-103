package org.ies.deti.ua.medisync.model;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Vitals {
    @JsonProperty("HeartRate")
    private Double heartRate;

    @JsonProperty("BloodPressureDiastolic")
    private Double bloodPressureDiastolic;

    @JsonProperty("BloodPressureSystolic")
    private Double bloodPressureSystolic;

    @JsonProperty("Temperature")
    private Double temperature;

    @JsonProperty("OxygenSaturation")
    private Double oxygenSaturation;

    public Vitals() {}

    public Vitals(Double heartRate, Double bloodPressureDiastolic, Double bloodPressureSystolic, Double temperature, Double oxygenSaturation) {
        this.heartRate = heartRate;
        this.bloodPressureDiastolic = bloodPressureDiastolic;
        this.bloodPressureSystolic = bloodPressureSystolic;
        this.temperature = temperature;
        this.oxygenSaturation = oxygenSaturation;
    }

    public Double getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(Double heartRate) {
        this.heartRate = heartRate;
    }

    public Double getBloodPressureDiastolic() {
        return bloodPressureDiastolic;
    }

    public void setBloodPressureDiastolic(Double bloodPressureDiastolic) {
        this.bloodPressureDiastolic = bloodPressureDiastolic;
    }

    public Double getBloodPressureSystolic() {
        return bloodPressureSystolic;
    }

    public void setBloodPressureSystolic(Double bloodPressureSystolic) {
        this.bloodPressureSystolic = bloodPressureSystolic;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getOxygenSaturation() {
        return oxygenSaturation;
    }

    public void setOxygenSaturation(Double oxygenSaturation) {
        this.oxygenSaturation = oxygenSaturation;
    }

    @Override
    public String toString() {
        return "Vitals{" +
                "heartRate=" + heartRate +
                ", bloodPressureDiastolic=" + bloodPressureDiastolic +
                ", bloodPressureSystolic=" + bloodPressureSystolic +
                ", temperature=" + temperature +
                ", oxygenSaturation=" + oxygenSaturation +
                '}';
    }
}
