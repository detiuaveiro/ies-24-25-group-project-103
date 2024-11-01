package org.ies.deti.ua.medisync.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "nurse")
public class Nurse extends User {

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<ScheduleEntry> schedule = new HashSet<>();

    public Nurse() {}

    public Nurse(String username, String email, String password, String name, Set<ScheduleEntry> schedule) {
        super(username, email, password, name);
        this.schedule = schedule;
    }

    public Set<ScheduleEntry> getSchedule() {
        return schedule;
    }

    public void setSchedule(Set<ScheduleEntry> schedule) {
        this.schedule = schedule;
    }

    public void addScheduleEntry(ScheduleEntry entry) {
        this.schedule.add(entry);
        entry.getNurses().add(this); // Establish the relationship
    }

    public void removeScheduleEntry(ScheduleEntry entry) {
        this.schedule.remove(entry);
        entry.getNurses().remove(this); // Break the relationship
    }

    public void cleanupUnassociatedScheduleEntries() {
        // Remove ScheduleEntries not linked to any Nurse
        schedule.removeIf(entry -> entry.getNurses().isEmpty());
    }
}
