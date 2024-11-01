package org.ies.deti.ua.medisync.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "nurse")
public class Nurse extends User {

    @OneToMany(mappedBy = "nurse")
    private List<ScheduleEntry> schedule = new ArrayList<>();

    public Nurse() {}

    public Nurse(String username, String email, String password, UserType userType, String name, List<ScheduleEntry> schedule) {
        super(username, email, password, userType, name);
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
