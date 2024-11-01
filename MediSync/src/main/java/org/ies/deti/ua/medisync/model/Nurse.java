package org.ies.deti.ua.medisync.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "nurse")
public class Nurse extends User {

    @OneToMany(mappedBy = "nurse")
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
    }
}
