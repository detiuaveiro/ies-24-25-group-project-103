package org.ies.deti.ua.medisync.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Nurse extends User {

    @ManyToMany
    @JoinTable(
            name = "schedule_nurse",
            joinColumns = @JoinColumn(name = "schedule_id"),
            inverseJoinColumns = @JoinColumn(name = "nurse_id")
    )
    private List<ScheduleEntry> schedule = new ArrayList<>();

    public Nurse() {}

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
        this.schedule.add(entry);
        entry.getNurses().add(this);
    }

    public void removeScheduleEntry(ScheduleEntry entry) {
        this.schedule.remove(entry);
        entry.getNurses().remove(this);
    }

    public void cleanupUnassociatedScheduleEntries() {
        schedule.removeIf(entry -> entry.getNurses().isEmpty());
    }
}
