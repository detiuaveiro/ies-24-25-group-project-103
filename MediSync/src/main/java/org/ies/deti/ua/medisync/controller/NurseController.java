package org.ies.deti.ua.medisync.controller;

import java.util.List;
import java.util.Optional;

import org.ies.deti.ua.medisync.model.Nurse;
import org.ies.deti.ua.medisync.model.PatientWithVitals;
import org.ies.deti.ua.medisync.model.Room;
import org.ies.deti.ua.medisync.model.ScheduleEntry;
import org.ies.deti.ua.medisync.service.NurseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/nurses")
public class NurseController {

    private NurseService nurseService;

    public NurseController(NurseService nurseService) {
        this.nurseService = nurseService;
    }

    // Get all patients assigned to a specified Nurse
    @GetMapping("/{nurse_id}/patients")
    public ResponseEntity<List<PatientWithVitals>> getPatientsWithVitals(@PathVariable Long nurse_id) {
        Optional<Nurse> nurseOpt = nurseService.getNurseById(nurse_id);
        if (nurseOpt.isPresent()) {
            List<PatientWithVitals> patientsWithVitals = nurseService.getPatientsWithVitalsForNurse(nurseOpt.get());
            return ResponseEntity.ok(patientsWithVitals);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/schedules")
    public ResponseEntity<List<ScheduleEntry>> getScheduleEntrys() {
        List<ScheduleEntry> scheduleEntries = nurseService.getSchedules();
        return ResponseEntity.ok(scheduleEntries);
    }

    // Add a Schedule Entry to a specified Nurse
    @PostMapping("/{nurseId}/schedule") // Issue #154
    public ResponseEntity<Nurse> addScheduleEntry(@PathVariable Long nurseId, @RequestBody ScheduleEntry newEntry) {
        Nurse updatedNurse = nurseService.addScheduleEntryToNurse(nurseId, newEntry);

        if (updatedNurse == null) {
            // Check if the null was due to an overlap or the nurse not being found
            Optional<Nurse> nurseOpt = nurseService.getNurseById(nurseId);
            if (nurseOpt.isPresent()) {
                // Conflict due to schedule overlap
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            } else {
                // Nurse not found
                return ResponseEntity.notFound().build();
            }
        }

        // Success
        return ResponseEntity.ok(updatedNurse);
    }

    // Update a Schedule Entry from a specified nurse
    @PutMapping("/{nurseId}/schedule/{before_entryId}") // Issue:#91
    public ResponseEntity<Nurse> updateScheduleEntry(@PathVariable Long nurseId, @PathVariable Long before_entryId,
            @RequestBody ScheduleEntry newEntry) {
        Nurse updatedNurse = nurseService.updateScheduleEntryFromNurse(nurseId, before_entryId, newEntry);
        return updatedNurse != null ? ResponseEntity.ok(updatedNurse) : ResponseEntity.notFound().build();
    }

    // Delete a Schedule Entry from a specified nurse
    @DeleteMapping("/{nurseId}/schedule/{entryId}") // Issue #155
    public ResponseEntity<Nurse> removeScheduleEntry(@PathVariable Long nurseId, @PathVariable Long entryId) {
        Nurse updatedNurse = nurseService.removeScheduleEntryFromNurse(nurseId, entryId);
        return updatedNurse != null ? ResponseEntity.ok(updatedNurse) : ResponseEntity.notFound().build();
    }

    // Delete nurse FEITO
    @DeleteMapping("/{id}") // Issue #156
    public ResponseEntity<Void> deleteNurse(@PathVariable Long id) {
        try {
            nurseService.deleteNurse(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all rooms
    @GetMapping("{nurse_id}/rooms") // Issue #82
    public ResponseEntity<List<Room>> getAllRooms(@PathVariable Long nurse_id) {
        Optional<Nurse> nurse = nurseService.getNurseById(nurse_id);
        if (nurse.isPresent()) {
            List<Room> rooms = nurseService.getRoomsByNurseId(nurse.get());
            return ResponseEntity.ok(rooms);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Get all nurses FEITO
    @GetMapping // Issue #79
    public ResponseEntity<List<Nurse>> getAllNurses() {
        List<Nurse> nurses = nurseService.getAllNurses();
        return ResponseEntity.ok(nurses);
    }

    /*
     * @GetMapping // Issue #79
     * public ResponseEntity<List<Nurse>> getAllActiveNurses() {
     * List<Nurse> nurses = nurseService.getAllActiveNurses();
     * return ResponseEntity.ok(nurses);
     * }
     */

    // Get nurse by ID FEITO
    @GetMapping("/{id}") // Issue #80
    public ResponseEntity<Nurse> getNurseById(@PathVariable Long id) {
        Optional<Nurse> nurse = nurseService.getNurseById(id);
        return nurse.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Add a new nurse (create) FEITO
    @PostMapping // Issue: #89
    public ResponseEntity<Nurse> addNurse(@RequestBody Nurse nurse) {
        Nurse createdNurse = nurseService.addNurse(nurse);
        return ResponseEntity.ok(createdNurse);
    }

    // Update nurse information FEITO
    @PutMapping("/{id}") // Issue #99
    public ResponseEntity<Nurse> updateNurse(@PathVariable Long id, @RequestBody Nurse updatedNurse) {
        try {
            Nurse updated = nurseService.updateNurse(id, updatedNurse);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
