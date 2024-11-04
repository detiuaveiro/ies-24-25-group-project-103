package org.ies.deti.ua.medisync.controller;

import org.ies.deti.ua.medisync.model.*;
import org.ies.deti.ua.medisync.service.NurseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/nurses")
public class NurseController {

    private NurseService nurseService;

    // Get /api/v1/nurses/{nurse_id}/patients - Get all patients
    // assigned to a specified Nurse
    @GetMapping("/{nurse_id}/patients") // Issue #153
    public ResponseEntity<List<PatientWithVitals>> getPatientsWithVitals(@PathVariable Long nurse_id) {
        Optional<Nurse> nurseOpt = nurseService.getNurseById(nurse_id);
        if (nurseOpt.isPresent()) {
            List<PatientWithVitals> patientsWithVitals = nurseService.getPatientsWithVitalsForNurse(nurseOpt.get());
            return ResponseEntity.ok(patientsWithVitals);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Post /api/v1/nurses/{nurseId}/add-schedule - Add a Schedule Entry to a
    // specified Nurse
    @PostMapping("/{nurseId}/schedule") // Issue #154
    public ResponseEntity<Nurse> addScheduleEntry(@PathVariable Long nurseId, @RequestBody ScheduleEntry newEntry) {
        Nurse updatedNurse = nurseService.addScheduleEntryToNurse(nurseId, newEntry);
        return updatedNurse != null ? ResponseEntity.ok(updatedNurse) : ResponseEntity.notFound().build();
    }

    // Put /api/v1/nurses/{nurseId}/update-schedule/{before_entryId} - Update a
    // Schedule Entry from a specified nurse
    @PutMapping("/{nurseId}/schedule/{before_entryId}") // Issue:#91
    public ResponseEntity<Nurse> updateScheduleEntry(@PathVariable Long nurseId, @PathVariable Long before_entryId,
            @RequestBody ScheduleEntry newEntry) {
        Nurse updatedNurse = nurseService.updateScheduleEntryFromNurse(nurseId, before_entryId, newEntry);
        return updatedNurse != null ? ResponseEntity.ok(updatedNurse) : ResponseEntity.notFound().build();
    }

    // Delete /api/v1/nurses/{nurseId}/remove-schedule/{entryId} - Delete a Schedule
    // Entry from a specified nurse
    @DeleteMapping("/{nurseId}/schedule/{entryId}") // Issue #155
    public ResponseEntity<Nurse> removeScheduleEntry(@PathVariable Long nurseId, @PathVariable Long entryId) {
        Nurse updatedNurse = nurseService.removeScheduleEntryFromNurse(nurseId, entryId);
        return updatedNurse != null ? ResponseEntity.ok(updatedNurse) : ResponseEntity.notFound().build();
    }

    // Delete /api/v1/nurses/delete/{id} - Delete nurse
    @DeleteMapping("/{id}") // Issue #156
    public ResponseEntity<Void> deleteNurse(@PathVariable Long id) {
        try {
            nurseService.deleteNurse(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/v1/nurses/{nurse_id}/rooms - Get all rooms
    @GetMapping("{nurse_id}/rooms") // Issue #82
    public ResponseEntity<List<Room>> getAllRooms(@PathVariable Long nurse_id) {
        Optional<Nurse> nurse = nurseService.getNurseById(nurse_id);
        if (nurse.isPresent()) {
            List<Room> rooms = nurseService.getRoomsByNurseId(nurse.get());
            return ResponseEntity.ok(rooms);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // GET /api/v1/nurses/nurses - Get all nurses
    @GetMapping // Issue #79
    public ResponseEntity<List<Nurse>> getAllNurses() {
        List<Nurse> nurses = nurseService.getAllNurses();
        return ResponseEntity.ok(nurses);
    }

    // GET /api/v1/nurses/{id} - Get nurse by ID
    @GetMapping("/{id}") // Issue #80
    public ResponseEntity<Nurse> getNurseById(@PathVariable Long id) {
        Optional<Nurse> nurse = nurseService.getNurseById(id);
        return nurse.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST /api/v1/nurses/add/nurse - Add a new nurse (create)
    @PostMapping// Issue: #89
    public ResponseEntity<Nurse> addNurse(@RequestBody Nurse nurse) {
        Nurse createdNurse = nurseService.addNurse(nurse);
        return ResponseEntity.ok(createdNurse);
    }

    // PUT /api/v1/nurses/update/nurse/{id} - Update nurse information
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
