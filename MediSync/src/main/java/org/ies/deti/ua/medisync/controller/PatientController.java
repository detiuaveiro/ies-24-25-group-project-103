package org.ies.deti.ua.medisync.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.ies.deti.ua.medisync.model.Bed;
import org.ies.deti.ua.medisync.model.Doctor;
import org.ies.deti.ua.medisync.model.Medication;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.model.PatientWithVitals;
import org.ies.deti.ua.medisync.repository.PatientRepository;
import org.ies.deti.ua.medisync.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
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

import com.influxdb.query.FluxTable;

@RestController
@RequestMapping("/api/v1/patients")
public class PatientController {

    private final PatientService patientService;

    @Autowired
    public PatientController(PatientService patientService, PatientRepository patientRepository) {
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        Patient createdPatient = patientService.createPatient(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPatient);
    }

    @PostMapping("/{id}/bed")
    public ResponseEntity<Bed> assignToBed(@RequestBody Bed bed, @PathVariable Long id) {
        Bed updatedBed = patientService.setBed(id, bed);
        if (updatedBed != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedBed);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/{id}/doctor")
    public ResponseEntity<Patient> assignToDoctor(@RequestBody Doctor doctor, @PathVariable Long id) {
        Patient updatedPatient = patientService.setDoctor(id, doctor);
        if (updatedPatient != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedPatient);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllPatients() {
        patientService.deleteAllPatients();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/{id}")
    public Optional<PatientWithVitals> getPatientById(@PathVariable Long id) {
        Optional<PatientWithVitals> patient = patientService.getPatientWithVitalsById(id);
        return patient;

    }

    @GetMapping("/graph/{id}/{type}/{start}/{end}")
    public Map<String, Object> getGraph(
            @PathVariable String id, 
            @PathVariable String type, 
            @PathVariable String start,
            @PathVariable String end) {
        try {
            String bedID = patientService.getPatientBed(
                    patientService.getPatientById(Long.parseLong(id)).get()).getId().toString();
            System.out.println("Fetched Bed ID: " + bedID);
    
            List<FluxTable> tables = patientService.getPatientVitals(bedID, start, end);
    
            Map<String, Object> chartData = patientService.generateVitalsChartData(bedID, type, start, end);
            System.out.println("Generated Chart Data: " + chartData);
    
            return chartData;
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "Failed to retrieve graph data: " + e.getMessage());
        }
    }
    

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient updatedPatient) {
        try {
            Patient updated = patientService.updatePatient(id, updatedPatient);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.dischargePatient(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/{id}/medications")
    public ResponseEntity<List<Medication>> getMedications(@PathVariable Long id) {
        List<Medication> medications = patientService.getMedicationsByPatientId(id);
        return ResponseEntity.ok(medications);
    }

    @PostMapping("/{id}/medications")
    public ResponseEntity<Patient> createMedication(@PathVariable Long id, @RequestBody Medication medication) {
        Patient patientWithMedication = patientService.addMedication(id, medication);
        return ResponseEntity.status(HttpStatus.CREATED).body(patientWithMedication);
    }

    @DeleteMapping("/{id}/medications/{medicationId}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id, @PathVariable Long medicationId) {
        patientService.deleteMedication(id, medicationId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}/medications/{medicationId}")
    public ResponseEntity<Medication> updateMedication(@PathVariable Long id, @PathVariable Long medicationId,
            @RequestBody Medication updatedMedication) {
        Medication medication = patientService.updateMedication(id, medicationId, updatedMedication);
        return ResponseEntity.ok(medication);
    }

    @PutMapping("vitals/{bed_id}")
    public ResponseEntity<Void> postVitals(@PathVariable String bed_id, @RequestBody Map<String, Object> vitals) {
        patientService.writeVitals(bed_id, vitals);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }


    @GetMapping("{id}/vitals")
    public ResponseEntity<Map<String, Object>> getVitals(@PathVariable Long id) {
        Map<String, Object> lastVitals = patientService.getLastVitals(id.toString());
        return ResponseEntity.ok(lastVitals);
    }

    @PutMapping("{id}/state")
    public ResponseEntity<Patient> updatePatientState(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String state = request.get("state");
        if (state == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    
        boolean result = false;
    
        if ("TO_BE_DISCHARGED".equals(state)) {
            result = patientService.canBeDischarged(id);
        } else if ("DISCHARGED".equals(state)) {
            result = patientService.dischargePatient(id);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    
        if (!result) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    
        // Return the updated patient object
        Optional<Patient> updatedPatient = patientService.getPatientById(id);
        if (updatedPatient.isPresent()) {
            return ResponseEntity.ok(updatedPatient.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @PutMapping("discharge-date/{id}")
    public ResponseEntity<Patient> updateDischargeDate(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String dischargeDate = request.get("dischargeDate");
        if (dischargeDate == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    
        Patient updatedPatient = patientService.updateDischargeDate(id, dischargeDate);
        if (updatedPatient != null) {
            return ResponseEntity.ok(updatedPatient);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    

}
