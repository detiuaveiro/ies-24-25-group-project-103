package org.ies.deti.ua.medisync.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.ies.deti.ua.medisync.model.Bed;
import org.ies.deti.ua.medisync.model.Doctor;
import org.ies.deti.ua.medisync.model.Medication;
import org.ies.deti.ua.medisync.model.Patient;
import org.ies.deti.ua.medisync.model.PatientWithVitals;
import org.ies.deti.ua.medisync.model.Vitals;
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
import com.influxdb.client.QueryApi;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;

import jakarta.annotation.PostConstruct;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final MedicationRepository medicationRepository;
    private final BedRepository bedRepository;
    private final DoctorRepository doctorRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Value("${spring.influx.token}")
    private String TOKEN;

    @Value("${spring.influx.org}")
    private String ORGANIZATION;

    @Value("${spring.influx.bucket}")
    private String BUCKET;

    @Value("${spring.influx.url}")
    private String URL;

    private InfluxDBClient influxDBClient;

    @Autowired
    public PatientService(PatientRepository patientRepository, MedicationRepository medicationRepository,
            BedRepository bedRepository, DoctorRepository doctorRepository) {
        this.patientRepository = patientRepository;
        this.medicationRepository = medicationRepository;
        this.bedRepository = bedRepository;
        this.doctorRepository = doctorRepository;
    }

    @PostConstruct
    public void init() {
        this.influxDBClient = InfluxDBClientFactory.create(URL, TOKEN.toCharArray());
    }

    public Patient createPatient(Patient patient) {
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
            bed.setAssignedPatient(patient.get());
            return bedRepository.save(bed);
        }
        return null;
    }

    public Patient setDoctor(Long id, Doctor doctor) {
        Optional<Patient> patient = this.getPatientById(id);
        if (patient.isPresent()) {
            patient.get().setAssignedDoctor(doctor);
            doctorRepository.save(doctor);
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
            Long HeartRate = (Long) lastVitals.get("heartbeat");
            Long o2 = (Long) lastVitals.get("o2");
            Long temperature = (Long) lastVitals.get("temperature");
            Long bloodPressure_systolic = (Long) lastVitals.get("bloodPressure_systolic");
            Long bloodPressure_diastolic = (Long) lastVitals.get("bloodPressure_diastolic");
            Vitals vitals = new Vitals(HeartRate, bloodPressure_diastolic, bloodPressure_systolic, o2, temperature);
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
            return patientRepository.save(existingPatient);
        }).orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
    }

    public Bed getPatientBed(Patient patient) {
        return bedRepository.getBedByAssignedPatient(patient);
    }

    public void dischargePatient(Long id) {
        patientRepository.deleteById(id);
    }

    public List<Patient> getPatientsFromDoctor(Doctor doctor) {
        return patientRepository.findByAssignedDoctor(doctor);
    }

    public void writeVitals(String bedId, Map<String, Object> vitals) {
        long currentTimestamp = System.currentTimeMillis();

        try {
            Integer heartbeat = (Integer) vitals.get("heartbeat");
            Integer o2 = (Integer) vitals.get("o2");
            List<Integer> bloodPressure = (List<Integer>) vitals.get("bloodPressure");
            Double temperature = (Double) vitals.get("temperature");

            Point point = Point.measurement("vitals")
                    .time(currentTimestamp, WritePrecision.MS)
                    .addTag("bedId", bedId)
                    .addField("heartbeat", heartbeat)
                    .addField("o2", o2)
                    .addField("bloodPressure_systolic", bloodPressure.get(0))
                    .addField("bloodPressure_diastolic", bloodPressure.get(1))
                    .addField("temperature", temperature);

            influxDBClient.getWriteApiBlocking().writePoint(BUCKET, ORGANIZATION, point);
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
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"vitals\") " +
                        "|> pivot(rowKey: [\"_time\"], columnKey: [\"bedId\"], valueColumn: \"_value\")",
                BUCKET, startTime, endTime, bedId);

        QueryApi queryApi = influxDBClient.getQueryApi();
        return queryApi.query(fluxQuery);
    }

    public String generateQuickChartUrl(List<FluxTable> vitalsRecords, String bedId, String vitalType) {
        StringBuilder labels = new StringBuilder();
        StringBuilder dataPoints = new StringBuilder();

        for (FluxTable table : vitalsRecords) {
            for (FluxRecord record : table.getRecords()) {
                String field = (String) record.getValueByKey("_field");
                Number value = (Number) record.getValue();

                if (value == null || !vitalType.equals(field))
                    continue;

                String timeLabel = record.getTime().toString();
                labels.append("\"").append(timeLabel).append("\",");
                dataPoints.append(value.toString()).append(",");
            }
        }

        if (labels.length() > 0)
            labels.setLength(labels.length() - 1);
        if (dataPoints.length() > 0)
            dataPoints.setLength(dataPoints.length() - 1);

        String chartJson = String.format(
                "{"
                        + "\"type\":\"line\","
                        + "\"data\":{"
                        + "\"labels\":[%s],"
                        + "\"datasets\":[{\"label\":\"%s\",\"data\":[%s]}]"
                        + "},"
                        + "\"options\":{"
                        + "\"title\":{\"display\":true,\"text\":\"%s\"}"
                        + "}"
                        + "}",
                labels.toString(), vitalType, dataPoints.toString(), vitalType);

        String encodedChart = URLEncoder.encode(chartJson, StandardCharsets.UTF_8);
        return "https://quickchart.io/chart?c=" + encodedChart;
    }

    public Map<String, Object> getLastVitals(String bedId) {
        String fluxQuery = String.format(
                "from(bucket: \"%s\") " +
                        "|> range(start: -1h) " + // Adjust the time range as needed
                        "|> filter(fn: (r) => r[\"bedId\"] == \"%s\") " +
                        "|> filter(fn: (r) => r[\"_measurement\"] == \"vitals\") " +
                        "|> last()",
                BUCKET, bedId);

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);

        Map<String, Object> latestVitals = new HashMap<>();
        latestVitals.put("timestamp", null);

        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                latestVitals.put("timestamp", record.getTime());
                String field = (String) record.getValueByKey("_field");
                Long value = (Long) record.getValue();
                latestVitals.put(field, value);
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
                medication.setName(updatedMedication.getName());
                medication.setDosage(updatedMedication.getDosage());
                medication.setHourInterval(updatedMedication.getHourInterval());
                medication.setPatient(updatedMedication.getPatient());
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
        influxDBClient.close();
    }
}
