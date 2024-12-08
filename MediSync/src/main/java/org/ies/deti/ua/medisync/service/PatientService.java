package org.ies.deti.ua.medisync.service;

import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.ies.deti.ua.medisync.model.Bed;
import org.ies.deti.ua.medisync.model.Doctor;
import org.ies.deti.ua.medisync.model.Medication;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.model.PatientWithVitals;
import org.ies.deti.ua.medisync.model.Vitals;
import org.ies.deti.ua.medisync.model.VitalsBed;
import org.ies.deti.ua.medisync.repository.BedRepository;
import org.ies.deti.ua.medisync.repository.DoctorRepository;
import org.ies.deti.ua.medisync.repository.MedicationRepository;
import org.ies.deti.ua.medisync.repository.PatientRepository;
import org.ies.deti.ua.medisync.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.InfluxDBClientOptions;
import com.influxdb.client.QueryApi;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final MedicationRepository medicationRepository;
    private final BedRepository bedRepository;
    private final DoctorRepository doctorRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Value("${spring.influxdb.token}")
    private String token;

    @Value("${spring.influxdb.org}")
    private String org;

    @Value("${spring.influxdb.bucket}")
    private String bucket;

    @Value("${spring.influxdb.url}")
    private String url;

    private InfluxDBClient influxDBClient;

    @Autowired
    public PatientService(PatientRepository patientRepository, MedicationRepository medicationRepository,
            BedRepository bedRepository, DoctorRepository doctorRepository, InfluxDBClient influxDBClient) {
        this.patientRepository = patientRepository;
        this.medicationRepository = medicationRepository;
        this.bedRepository = bedRepository;
        this.doctorRepository = doctorRepository;
        this.influxDBClient = influxDBClient;
    }

    @PostConstruct
    public void init() {
        InfluxDBClientOptions options = InfluxDBClientOptions.builder()
                .url(url)
                .authenticateToken(token.toCharArray())
                .org(org)
                .bucket(bucket)
                .build();

        this.influxDBClient = InfluxDBClientFactory.create(options);
    }

    public Patient createPatient(Patient patient) {
        if (patient.getAssignedDoctor() != null) {
            Doctor actualDoctor = doctorRepository.findById(patient.getAssignedDoctor().getId()).get();
            patient.setAssignedDoctor(actualDoctor);
        }
        return patientRepository.save(patient);
    }

    public void deleteAllPatients() {
        patientRepository.deleteAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Bed setBed(Long id, Bed bed) {
        Optional<Patient> patient = this.getPatientById(id);
        if (patient.isPresent()) {
            Bed existingBed = bedRepository.findById(bed.getId()).get();
            System.out.println(existingBed);
            existingBed.setAssignedPatient(patient.get());
            return bedRepository.save(existingBed);
        }
        return null;
    }

    public Patient setDoctor(Long id, Doctor doctor) {
        Optional<Patient> patient = this.getPatientById(id);
        if (patient.isPresent()) {
            Doctor actualDoctor = doctorRepository.findById(doctor.getId()).get();
            patient.get().setAssignedDoctor(actualDoctor);
            return patientRepository.save(patient.get());
        }
        return null;
    }

    public Optional<PatientWithVitals> getPatientWithVitalsById(Long id) {
        Optional<Patient> patientOptional = this.getPatientById(id);
        if (patientOptional.isPresent()) {
            Patient patient = patientOptional.get();
            Long bedId = bedRepository.getBedByAssignedPatient(patient).getId();
            Map<String, Object> lastVitals = this.getLastVitals(bedId.toString());
            Double HeartRate = (Double) lastVitals.get("heartbeat");
            Double o2 = (Double) lastVitals.get("o2");
            Double temperature = (Double) lastVitals.get("temperature");
            Double bloodPressure_systolic = (Double) lastVitals.get("bloodPressure_systolic");
            Double bloodPressure_diastolic = (Double) lastVitals.get("bloodPressure_diastolic");
            Vitals vitals = new Vitals(HeartRate, bloodPressure_diastolic, bloodPressure_systolic, temperature, o2);
            PatientWithVitals patientWithVitals = new PatientWithVitals(patient, vitals);
            return Optional.of(patientWithVitals);
        } else {
            return Optional.empty();
        }
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient updatePatient(Long id, Patient updatedPatient) {
        return patientRepository.findById(id).map(existingPatient -> {
            existingPatient.setName(updatedPatient.getName());
            existingPatient.setGender(updatedPatient.getGender());
            existingPatient.setBirthDate(updatedPatient.getBirthDate());
            existingPatient.setEstimatedDischargeDate(updatedPatient.getEstimatedDischargeDate());
            existingPatient.setWeight(updatedPatient.getWeight());
            existingPatient.setHeight(updatedPatient.getHeight());
            existingPatient.setConditions(updatedPatient.getConditions());
            existingPatient.setObservations(updatedPatient.getObservations());
            existingPatient.setAssignedDoctor(updatedPatient.getAssignedDoctor());
            existingPatient.setState(updatedPatient.getState());
            return patientRepository.save(existingPatient);
        }).orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
    }

    public Bed getPatientBed(Patient patient) {
        return bedRepository.getBedByAssignedPatient(patient);
    }

    public List<Patient> getPatientsByState(String state) {
        return patientRepository.findByState(state);
    }

    @Transactional
    public boolean dischargePatient(Long id) {
        // Fetch patient safely using Optional
        Optional<Patient> optionalPatient = patientRepository.findById(id);
        if (optionalPatient.isEmpty()) {
            return false; // Patient does not exist
        }
    
        Patient existingPatient = optionalPatient.get();
    
        if ("TO_BE_DISCHARGED".equals(existingPatient.getState())) {
            existingPatient.setState("DISCHARGED");
    
            Bed bed = bedRepository.getBedByAssignedPatient(existingPatient);
            if (bed != null) {
                bed.setAssignedPatient(null);
                bed.setCleaned(false); 
                bedRepository.save(bed);
            }
    
            patientRepository.saveAndFlush(existingPatient);
            return true;
        }
    
        return false; 
    }
    
    @Transactional
    public boolean canBeDischarged(Long id) {
        Optional<Patient> optionalPatient = patientRepository.findById(id);
        if (optionalPatient.isEmpty()) {
            return false; 
        }
    
        Patient existingPatient = optionalPatient.get();
    
        if ("IN_BED".equals(existingPatient.getState())) {
            existingPatient.setState("TO_BE_DISCHARGED");
            patientRepository.saveAndFlush(existingPatient); 
            return true;
        }
    
        return false; 
    }
    

    public List<Patient> getPatientsFromDoctor(Doctor doctor) {
        return patientRepository.findByAssignedDoctor(doctor);
    }

    public void processAndWritePatientVitals(VitalsBed vitalsBed) {
        try {
            Optional<Bed> bedOptional = bedRepository.findById(Long.valueOf(vitalsBed.getBedId()));
            if (bedOptional.isPresent() && bedOptional.get().getAssignedPatient() != null) {
    
                long currentTimestamp = System.currentTimeMillis();
    
                Double heartbeat = Double.valueOf(vitalsBed.getHeartRate());
                Double o2 = Double.valueOf(vitalsBed.getOxygenSaturation());
                Double systolicBP = Double.valueOf(vitalsBed.getBloodPressure()[0]);
                Double diastolicBP = Double.valueOf(vitalsBed.getBloodPressure()[1]);
                Double temperature = Double.valueOf(vitalsBed.getTemperature());
    
                Point point = Point.measurement("vitals")
                        .time(currentTimestamp, WritePrecision.MS)
                        .addTag("bedId", vitalsBed.getBedId())
                        .addField("heartbeat", heartbeat)
                        .addField("o2", o2)
                        .addField("bloodPressure_systolic", systolicBP)
                        .addField("bloodPressure_diastolic", diastolicBP)
                        .addField("temperature", temperature);
    
                influxDBClient.getWriteApiBlocking().writePoint(bucket, org, point);
    
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error processing vitals for bed ID: " + vitalsBed.getBedId());
        }
    }
    

    public void writeVitals(String bedId, Map<String, Object> vitals) {
        long currentTimestamp = System.currentTimeMillis();

        try {
            Double heartbeat = Double.valueOf(vitals.get("heartbeat").toString());
            Double o2 = Double.valueOf(vitals.get("o2").toString());
            @SuppressWarnings("unchecked")
            List<Double> bloodPressure = ((List<Object>) vitals.get("bloodPressure"))
                    .stream()
                    .map(obj -> Double.valueOf(obj.toString()))
                    .collect(Collectors.toList());
            Double temperature = Double.valueOf(vitals.get("temperature").toString());

            Point point = Point.measurement("vitals")
                    .time(currentTimestamp, WritePrecision.MS)
                    .addTag("bedId", bedId)
                    .addField("heartbeat", heartbeat)
                    .addField("o2", o2)
                    .addField("bloodPressure_systolic", bloodPressure.get(0))
                    .addField("bloodPressure_diastolic", bloodPressure.get(1))
                    .addField("temperature", temperature);

            influxDBClient.getWriteApiBlocking().writePoint(bucket, org, point);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error writing vitals to InfluxDB for bed ID: " + bedId);
        }
    }

    public List<FluxTable> getPatientVitals(String bedId, String startTime, String endTime) {
        String fluxQuery = String.format(
                "from(bucket: \"%s\") " +
                        "|> range(start: %s, stop: %s) " +
                        "|> filter(fn: (r) => r[\"bedId\"] == \"%s\") " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"vitals\")",
                bucket, startTime, endTime, bedId);  
    
        QueryApi queryApi = influxDBClient.getQueryApi();
        return queryApi.query(fluxQuery);
    }
    

    public Map<String, Object> generateVitalsChartData(String bedId, String vitalType, String startTime, String endTime) {
        String query = String.format(
            "from(bucket: \"%s\") " +
            "|> range(start: %s, stop: %s) " +
            "|> filter(fn: (r) => r[\"_measurement\"] == \"vitals\" and r[\"bedId\"] == \"%s\")",
            bucket, startTime, endTime, bedId
        );
    
        System.out.println("InfluxDB Query: " + query);
    
        List<FluxTable> vitalsRecords = influxDBClient.getQueryApi().query(query, org);
    
        List<String> labels = new ArrayList<>();
        List<Double> systolicData = new ArrayList<>();
        List<Double> diastolicData = new ArrayList<>();
        List<Double> otherData = new ArrayList<>();
    
        if (vitalsRecords.isEmpty()) {
            System.out.println("No records found for bed ID: " + bedId + ", vital type: " + vitalType);
        }
    
        for (FluxTable table : vitalsRecords) {
            for (FluxRecord record : table.getRecords()) {
                String timeLabel = record.getTime().toString();
                labels.add(timeLabel);
    
                String field = (String) record.getValueByKey("_field");
                Number value = (Number) record.getValue();
                if (value != null) {
                    if ("bloodPressure_systolic".equals(field)) {
                        systolicData.add(value.doubleValue());
                    } else if ("bloodPressure_diastolic".equals(field)) {
                        diastolicData.add(value.doubleValue());
                    } else if (field.equals(vitalType)) {
                        otherData.add(value.doubleValue());
                    }
                }
            }
        }
    
        if ("bloodpressure".equalsIgnoreCase(vitalType)) {
            return Map.of(
                "labels", labels,
                "datasets", List.of(
                    Map.of("label", "Systolic", "data", systolicData, "color", "#FF6347"), 
                    Map.of("label", "Diastolic", "data", diastolicData, "color", "#4682B4") 
                )
            );
        } else {
            return Map.of(
                "labels", labels,
                "data", otherData,
                "vitalType", vitalType,
                "color", getColorForVitalType(vitalType)
            );
        }
    }
    
    private String getColorForVitalType(String vitalType) {
        switch (vitalType.toLowerCase()) {
            case "o2":
                return "#FFA500"; 
            case "temperature":
                return "#FFD700"; 
            case "heartbeat":
                return "#FF0000"; 
            case "bloodpressure":
                return "#0000FF"; 
            default:
                return "#808080"; 
        }
    }
    

        

    public Map<String, Object> getLastVitals(String bedId) {
        String fluxQuery = String.format(
                "from(bucket: \"%s\") " +
                        "|> range(start: -1h) " +
                        "|> filter(fn: (r) => r[\"bedId\"] == \"%s\") " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"vitals\") " +
                        "|> last()",
                bucket, bedId);

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);

        Map<String, Object> latestVitals = new HashMap<>();
        latestVitals.put("timestamp", null);

        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                latestVitals.put("timestamp", record.getTime());
                String field = (String) record.getValueByKey("_field");
                Number value = (Number) record.getValue();
                latestVitals.put(field, value.doubleValue());
            }
        }

        return latestVitals;
    }

    public List<Medication> getMedicationsByPatientId(Long patientId) {
        return medicationRepository.findMedicationByPatientId(patientId);
    }


    

    public Patient addMedication(Long patientId, Medication medication) {
        Optional<Patient> patientOptional = patientRepository.findById(patientId);
        if (patientOptional.isPresent()) {
            Patient patient = patientOptional.get();
            System.out.println(patient);
            medication.setPatient(patient);
            medicationRepository.save(medication);
            return patient;
        }
        return null;
    }

    public Medication updateMedication(Long patientId, Long medicationId, Medication updatedMedication) {
        List<Medication> medicationList = medicationRepository.findMedicationByPatientId(patientId);
        for (Medication medication : medicationList) {
            if (medication.getId().equals(medicationId)) {
                System.out.println(medication.getPatient());
                medication.setName(updatedMedication.getName());
                medication.setDosage(updatedMedication.getDosage());
                medication.setHourInterval(updatedMedication.getHourInterval());
                medication.setLastTaken(updatedMedication.getLastTaken());
                medication.setHasTaken(updatedMedication.isHasTaken());
                
                return medicationRepository.save(medication);
            }
        }
        return null;
    }

    public void deleteMedication(Long patientId, Long medicationId) {
        List<Medication> medicationList = medicationRepository.findMedicationByPatientId(patientId);
        for (Medication medication : medicationList) {
            if (medication.getId().equals(medicationId)) {
                medicationRepository.delete(medication);
            }
        }
    }

    public void close() {
        if (influxDBClient != null) {
            influxDBClient.close();
        }
    }

    public List<Medication> getDueMedications(Long patientId) {
        List<Medication> medicationList = medicationRepository.findMedicationByPatientId(patientId);
    
        long currentTimeMillis = System.currentTimeMillis();
    
        return medicationList.stream()
                .filter(medication -> {
                    try {
                        int hourInterval = Integer.parseInt(medication.getHourInterval());
                        long nextDueTime = medication.getLastTaken().toInstant(ZoneOffset.UTC).toEpochMilli() + (hourInterval * 3600000L); 
                        return currentTimeMillis >= nextDueTime && !medication.isHasTaken();
                    } catch (NumberFormatException e) {
                        System.err.println("Invalid hourInterval for medication ID: " + medication.getId());
                        return false;
                    }
                })
                .collect(Collectors.toList());
    }
    
}