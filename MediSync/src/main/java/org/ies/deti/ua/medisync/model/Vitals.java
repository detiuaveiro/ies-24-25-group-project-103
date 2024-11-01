package org.ies.deti.ua.medisync.model;

public class Vitals {
    private Long HeartRate;
    private Long BloodPressureDiastolic;
    private Long BloodPressureSystolic;
    private Long Temperature;
    private Long OxygenSaturation;

    public Vitals() {}

    public Vitals(Long HeartRate, Long BloodPressureDiastolic, Long BloodPressureSystolic, Long Temperature, Long OxygenSaturation) {
        this.HeartRate = HeartRate;
        this.BloodPressureDiastolic = BloodPressureDiastolic;
        this.BloodPressureSystolic = BloodPressureSystolic;
        this.Temperature = Temperature;
        this.OxygenSaturation = OxygenSaturation;
    }

    public Long getHeartRate() {
        return HeartRate;
    }

    public void setHeartRate(Long HeartRate) {
        this.HeartRate = HeartRate;
    }

    public Long getBloodPressureDiastolic() {
        return BloodPressureDiastolic;
    }

    public void setBloodPressureDiastolic(Long BloodPressureDiastolic) {
        this.BloodPressureDiastolic = BloodPressureDiastolic;
    }

    public Long getBloodPressureSystolic() {
        return BloodPressureSystolic;
    }

    public void setBloodPressureSystolic(Long BloodPressureSystolic) {
        this.BloodPressureSystolic = BloodPressureSystolic;
    }

    public Long getTemperature() {
        return Temperature;
    }

    public void setTemperature(Long Temperature) {
        this.Temperature = Temperature;
    }

    public Long getOxygenSaturation() {
        return OxygenSaturation;
    }

    public void setOxygenSaturation(Long OxygenSaturation) {
        this.OxygenSaturation = OxygenSaturation;
    }

    @Override
    public String toString() {
        return "Vitals [BloodPressureDiastolic=" + BloodPressureDiastolic + ", BloodPressureSystolic="
                + BloodPressureSystolic + ", HeartRate=" + HeartRate + ", OxygenSaturation=" + OxygenSaturation
                + ", Temperature=" + Temperature + "]";
    }

}
