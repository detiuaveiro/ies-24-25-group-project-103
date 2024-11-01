package org.ies.deti.ua.medisync.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.client.QueryApi;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;

public class PatientService  {

    private static final String TOKEN = "your-influxdb-token";
    private static final String ORGANIZATION = "your-organization";
    private static final String BUCKET = "your-bucket";
    private static final String URL = "http://localhost:8086";

    private final InfluxDBClient influxDBClient;

    public PatientService() {
        influxDBClient = InfluxDBClientFactory.create(URL, TOKEN.toCharArray());
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

    public void close() {
        influxDBClient.close();
    }

}
