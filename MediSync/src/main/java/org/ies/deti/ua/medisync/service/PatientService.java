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
import org.ies.deti.ua.medisync.model.Room;
import org.ies.deti.ua.medisync.model.Vitals;
import org.ies.deti.ua.medisync.repository.PatientRepository;
import org.ies.deti.ua.medisync.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    @Autowired
    private RoomRepository roomRepository;

    private static final String TOKEN = "your-influxdb-token";
    private static final String ORGANIZATION = "your-organization";
    private static final String BUCKET = "your-bucket";
    private static final String URL = "http://localhost:8086";

    private final InfluxDBClient influxDBClient;

    @Autowired
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
        influxDBClient = InfluxDBClientFactory.create(URL, TOKEN.toCharArray());
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

    public Patient setBed(Long id, Bed bed) {
        Optional<Patient> patient = this.getPatientById(id);
        if (patient.isPresent()) {
            patient.get().setBed(bed);
            return patientRepository.save(patient.get());
        }
        return null;
    }

    public Patient setDoctor(Long id, Doctor doctor) {
        Optional<Patient> patient = this.getPatientById(id);
        if (patient.isPresent()) {
            patient.get().setAssignedDoctor(doctor);
            return patientRepository.save(patient.get());
        }
        return null;
    }

    public Optional<PatientWithVitals> getPatientWithVitalsById(Long id){
        Optional<Patient> patientOptional = this.getPatientById(id);
        if (patientOptional.isPresent()) {
            Patient patient = patientOptional.get();
            Long bedId = patient.getBed().getId();
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
            existingPatient.setMedicationList(updatedPatient.getMedicationList());
            existingPatient.setBed(updatedPatient.getBed());
            existingPatient.setAssignedDoctor(updatedPatient.getAssignedDoctor());
            return patientRepository.save(existingPatient);
        }).orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
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

                if (value == null || !vitalType.equals(field)) continue;

                String timeLabel = record.getTime().toString();
                labels.append("\"").append(timeLabel).append("\",");
                dataPoints.append(value.toString()).append(",");
            }
        }

        if (labels.length() > 0) labels.setLength(labels.length() - 1);
        if (dataPoints.length() > 0) dataPoints.setLength(dataPoints.length() - 1);

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
                labels.toString(), vitalType, dataPoints.toString(), vitalType
        );

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

    public Patient addMedication(Long patientId, Medication medication) {
        Optional<Patient> patientOptional = patientRepository.findById(patientId);
        if (patientOptional.isPresent()) {
            Patient patient = patientOptional.get();
            List<Medication> medicationList = patient.getMedicationList();
            medicationList.add(medication);
            patient.setMedicationList(medicationList);
            return patientRepository.save(patient);
        }
        return null;
    }

    public Patient updateMedication(Long patientId, Long medicationId, Medication updatedMedication) {
        Optional<Patient> patientOptional = patientRepository.findById(patientId);
        if (patientOptional.isPresent()) {
            Patient patient = patientOptional.get();
            List<Medication> medicationList = patient.getMedicationList();
            for (Medication medication : medicationList) {
                if (medication.getId().equals(medicationId)) {
                    medication.setName(updatedMedication.getName());
                    medication.setDosage(updatedMedication.getDosage());
                    medication.setHourInterval(updatedMedication.getHourInterval());
                    medication.setPatient(updatedMedication.getPatient());
                    break;
                }
            }
            patient.setMedicationList(medicationList);
            return patientRepository.save(patient);
        }
        return null;
    }

    public void deleteMedication(Long patientId, Long medicationId) {
        Optional<Patient> patientOptional = patientRepository.findById(patientId);
        if (patientOptional.isPresent()) {
            Patient patient = patientOptional.get();
            List<Medication> medicationList = patient.getMedicationList();
            medicationList.removeIf(medication -> medication.getId().equals(medicationId));
            patient.setMedicationList(medicationList);
            patientRepository.save(patient);
        }
    }

    public List<Medication> getMedicationsByPatientId(Long patientId) {
        Optional<Patient> patientOptional = patientRepository.findById(patientId);
        return patientOptional.map(Patient::getMedicationList).orElse(null);
    }

    public void close() {
        influxDBClient.close();
    }
}
