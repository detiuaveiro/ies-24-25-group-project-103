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

    @GetMapping("/patients-with-vitals/{patient_id}/") //Issue a definir
    public ResponseEntity<List<PatientWithVitals>> getPatientsWithVitals(@PathVariable Long patient_id) {
        Optional<Nurse> nurseOpt = nurseService.getNurseById(patient_id);
        if (nurseOpt.isPresent()) {
            List<PatientWithVitals> patientsWithVitals = nurseService.getPatientsWithVitalsForNurse(nurseOpt.get());
            return ResponseEntity.ok(patientsWithVitals);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/{nurseId}/add-schedule") //Issue a definir
    public ResponseEntity<Nurse> addScheduleEntry(@PathVariable Long nurseId, @RequestBody ScheduleEntry newEntry) {
        Nurse updatedNurse = nurseService.addScheduleEntryToNurse(nurseId, newEntry);
        return updatedNurse != null ? ResponseEntity.ok(updatedNurse) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{nurseId}/update-schedule/{before_entryId}/{after_entryId}") //Issue:#91
    public ResponseEntity<Nurse> updateScheduleEntry(@PathVariable Long nurseId, @PathVariable Long before_entryId, @PathVariable Long after_entryId) {
        Nurse updatedNurse = nurseService.updateScheduleEntryFromNurse(nurseId, before_entryId, after_entryId);
        return updatedNurse != null ? ResponseEntity.ok(updatedNurse) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{nurseId}/remove-schedule/{entryId}") //Issue a definir
    public ResponseEntity<Nurse> removeScheduleEntry(@PathVariable Long nurseId, @PathVariable Long entryId) {
        Nurse updatedNurse = nurseService.removeScheduleEntryFromNurse(nurseId, entryId);
        return updatedNurse != null ? ResponseEntity.ok(updatedNurse) : ResponseEntity.notFound().build();
    }

    // Delete /api/v1/nurses/delete/{id} - Delete nurse
    @DeleteMapping("/delete/{id}") //Issue a definir
    public ResponseEntity<Void> deleteNurse(@PathVariable Long id) {
        try {
            nurseService.deleteNurse(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/rooms - Get all rooms
    @GetMapping("{nurse_id}/rooms") //Issue #82
    public ResponseEntity<List<Room>> getAllRooms(@PathVariable Long nurse_id) {
        Optional<Nurse> nurse = nurseService.getNurseById(nurse_id);
        if (nurse.isPresent()) {
            List<Room> rooms = nurseService.getRoomsByNurseId(nurse.get());
            return ResponseEntity.ok(rooms);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // GET /api/nurses - Get all nurses
    @GetMapping("/nurses") //Issue #79
    public ResponseEntity<List<Nurse>> getAllNurses() {
        List<Nurse> nurses = nurseService.getAllNurses();
        return ResponseEntity.ok(nurses);
    }

    // GET /api/nurses/{id} - Get nurse by ID
    @GetMapping("/{id}") //Issue #80
    public ResponseEntity<Nurse> getNurseById(@PathVariable Long id) {
        Optional<Nurse> nurse = nurseService.getNurseById(id);
        return nurse.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST /api/add/nurse/{nurse_id} - Add a new nurse (create)
    @PostMapping("/add/nurse") //Issue: #89
    public ResponseEntity<Nurse> addNurse(@RequestBody Nurse nurse) {
        Nurse createdNurse = nurseService.addNurse(nurse);
        return ResponseEntity.ok(createdNurse);
    }

    // PUT /api/update/nurse/{id} - Update nurse information
    @PutMapping("/update/nurse/{id}")
    public ResponseEntity<Nurse> updateNurse(@PathVariable Long id, @RequestBody Nurse updatedNurse) {
        try {
            Nurse updated = nurseService.updateNurse(id, updatedNurse);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
