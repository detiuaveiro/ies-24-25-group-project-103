import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { subDays, startOfDay, endOfDay } from "date-fns";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GraphModal = ({ show, onClose, patientId, vitalType }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("today");

  const title =
    vitalType === "heartbeat"
      ? "Heart Rate"
      : vitalType === "o2"
      ? "Oxygen Level"
      : vitalType === "temperature"
      ? "Temperature"
      : "Blood Pressure";

  const calculateDateRange = () => {
    const today = new Date();
    if (range === "today") {
      return {
        startDate: startOfDay(today).toISOString(),
        endDate: endOfDay(today).toISOString(),
      };
    } else if (range === "lastWeek") {
      return {
        startDate: subDays(today, 7).toISOString(),
        endDate: today.toISOString(),
      };
    } else if (range === "lastMonth") {
      return {
        startDate: subDays(today, 30).toISOString(),
        endDate: today.toISOString(),
      };
    }
    return { startDate: "", endDate: "" };
  };

  const { startDate, endDate } = calculateDateRange();

  const loadGraphData = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/patients/graph/${patientId}/${vitalType}/${startDate}/${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { labels, datasets, data, color } = response.data;

      if (datasets) {
        setChartData({
          labels,
          datasets: datasets.map((dataset) => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.color,
            backgroundColor: `${dataset.color}33`,
            fill: false,
          })),
        });
      } else {
        setChartData({
          labels,
          datasets: [
            {
              label: vitalType,
              data,
              borderColor: color || "rgba(75, 192, 192, 1)",
              backgroundColor: color ? `${color}` : "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to fetch graph data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      loadGraphData();
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      loadGraphData();
    }
  }, [range]);

  const resetState = () => {
    setChartData(null);
    setLoading(false);
    setError(null);
    setRange("today");
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        resetState();
        onClose();
      }}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{`Graph for ${title}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <p>Loading graph data...</p>
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : chartData ? (
          <>
            <div className="mb-3 text-center">
              <label htmlFor="rangeSelect" className="form-label">
                Select Time Range:
              </label>
              <select
                id="rangeSelect"
                className="form-select"
                value={range}
                onChange={(e) => setRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
              </select>
            </div>
            <div style={{ textAlign: "center", width: "100%", height: "400px" }}>
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
          </>
        ) : (
          <p>No data available for the selected time range.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onClose()}
          style={{width: "100%", backgroundColor: "#CD5C5C", color: "black", border: "none"}}
            onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.03)"; 
            e.target.style.backgroundColor = "#F08080"; 
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)"; 
            e.target.style.backgroundColor = "#CD5C5C";
          }
        }
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GraphModal;
