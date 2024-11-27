import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import axios from "axios";

// Register necessary components
ChartJS.register(TimeScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const GraphModal = ({ show, onClose, patientId, vitalType, startDate, endDate }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const title = vitalType === "heartbeat" ? "Heart Rate" : vitalType === "o2" ? "Oxygen Level" : vitalType === "temperature" ? "Temperature" : "Blood Pressure";

  useEffect(() => {
    const fetchGraphData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      try {
        // Call the correct endpoint
        const response = await axios.get(
          `http://localhost:8080/api/v1/patients/graph/${patientId}/${vitalType}/${startDate}/${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { labels, data } = response.data;

        // Ensure labels and data exist
        if (!labels || !data || labels.length === 0 || data.length === 0) {
          throw new Error("No data available for the selected time range.");
        }

        // Set chart data in the format required by Chart.js
        setChartData({
          labels,
          datasets: [
            {
              label: vitalType,
              data,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        });
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to fetch graph data.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch graph data only when modal is shown
    if (show && patientId && vitalType && startDate && endDate) {
      fetchGraphData();
    }
  }, [show, patientId, vitalType, startDate, endDate]);

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{`Graph for ${title}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <p>Loading graph...</p>}
        {error && <p className="text-danger">{error}</p>}
        {chartData && (
          <div style={{ textAlign: "center", width: "100%" }}>
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: `${vitalType} Over Time` },
                },
                scales: {
                  x: {
                    type: "time",
                    time: { unit: "minute" },
                    title: { display: true, text: "Time" },
                  },
                  y: {
                    title: { display: true, text: vitalType },
                  },
                },
              }}
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GraphModal;
