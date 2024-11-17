package org.ies.deti.ua.medisync.model;

public class Vitals {
    private Double HeartRate;
    private Double BloodPressureDiastolic;
    private Double BloodPressureSystolic;
    private Double Temperature;
    private Double OxygenSaturation;

    public Vitals() {}

    public Vitals(Double HeartRate, Double BloodPressureDiastolic, Double BloodPressureSystolic, Double Temperature, Double OxygenSaturation) {
        this.HeartRate = HeartRate;
        this.BloodPressureDiastolic = BloodPressureDiastolic;
        this.BloodPressureSystolic = BloodPressureSystolic;
        this.Temperature = Temperature;
        this.OxygenSaturation = OxygenSaturation;
    }

    public Double getHeartRate() {
        return HeartRate;
    }

    public void setHeartRate(Double HeartRate) {
        this.HeartRate = HeartRate;
    }

    public Double getBloodPressureDiastolic() {
        return BloodPressureDiastolic;
    }

    public void setBloodPressureDiastolic(Double BloodPressureDiastolic) {
        this.BloodPressureDiastolic = BloodPressureDiastolic;
    }

    public Double getBloodPressureSystolic() {
        return BloodPressureSystolic;
    }

    public void setBloodPressureSystolic(Double BloodPressureSystolic) {
        this.BloodPressureSystolic = BloodPressureSystolic;
    }

    public Double getTemperature() {
        return Temperature;
    }

    public void setTemperature(Double Temperature) {
        this.Temperature = Temperature;
    }

    public Double getOxygenSaturation() {
        return OxygenSaturation;
    }

    public void setOxygenSaturation(Double OxygenSaturation) {
        this.OxygenSaturation = OxygenSaturation;
    }

    @Override
    public String toString() {
        return "Vitals [BloodPressureDiastolic=" + BloodPressureDiastolic + ", BloodPressureSystolic="
                + BloodPressureSystolic + ", HeartRate=" + HeartRate + ", OxygenSaturation=" + OxygenSaturation
                + ", Temperature=" + Temperature + "]";
    }

}
