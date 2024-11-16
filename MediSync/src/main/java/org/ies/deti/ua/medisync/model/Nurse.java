package org.ies.deti.ua.medisync.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Nurse extends User {

    @OneToMany(mappedBy = "nurse", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ScheduleEntry> schedule = new ArrayList<>();

    public Nurse() {
    }

    public Nurse(String username, String email, String password, String name, List<ScheduleEntry> schedule) {
        super(username, email, password, name);
        this.schedule = schedule;
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
