package org.ies.deti.ua.medisync.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Nurse extends User {

    @OneToMany(mappedBy = "nurse")
    @JsonManagedReference
    private List<ScheduleEntry> schedule = new ArrayList<>();

    public Nurse() {
    }

    public Nurse(String username, String email, String password, String name, List<ScheduleEntry> schedule,
            String profilePictureUrl) {
        super(username, email, password, name, "NURSE", profilePictureUrl);
        this.schedule = schedule;
    }

    public Nurse(String username, String email, String password, String name, String profilePictureUrl) {
        super(username, email, password, name, "NURSE", profilePictureUrl);
    }

    public List<ScheduleEntry> getSchedule() {
        return schedule;
    }

    public void setSchedule(List<ScheduleEntry> schedule) {
        this.schedule = schedule;
    }

    public void addScheduleEntry(ScheduleEntry entry) {
        schedule.add(entry);
        entry.setNurse(this);
    }

    public void removeScheduleEntry(ScheduleEntry entry) {
        schedule.remove(entry);
        entry.setNurse(null);
    }
}
