import FavoriteIcon from "@mui/icons-material/Favorite";
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import { Avatar, Box, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GraphModal from "./GraphModal";
import React from "react";

const TemperatureCard = ({ value }) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("Normal");
  const { id } = useParams();

  const formatDate = (date) => date.toISOString().split("T")[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  useEffect(() => {
    if (value >= 37.5) {
      setStatus("Too High");
    } else if (value < 34) {
      setStatus("Too Low");
    } else {
      setStatus("Normal");
    }
  }, [value]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Box
        sx={{
          width: 380,
          height: 250,
          position: "relative",
          backgroundColor: "white",
          borderRadius: "16.81px",
          border: "1.4px solid #e7e6e6",
          boxShadow: "0px 1.4px 70.04px #00000014",
          padding: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            position: "absolute",
            top: 48,
            left: 135,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: "500",
            color: "black",
          }}
        >
          Temperature
        </Typography>

        <Typography
          variant="h2"
          sx={{
            position: "absolute",
            top: 115,
            left: 28,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: "normal",
            color: "#272927",
          }}
        >
          {(value ?? 36).toFixed(1)}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            top: 121,
            left: 143,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: "bold",
            color: "#808080",
          }}
        >
          ºC
        </Typography>

        <Paper
          sx={{
            width: 84,
            height: 81,
            position: "absolute",
            top: 21,
            left: 28,
            backgroundColor: "#FFFAA0",
            borderRadius: "16.81px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            sx={{
              width: 61,
              height: 59,
              backgroundColor: "transparent",
            }}
          >
            <DeviceThermostatIcon sx={{ fontSize: 60, color: "#F4C430" }} />
          </Avatar>
        </Paper>

        <Paper
            sx={{
              width: 'auto',
              height: 'auto',
              padding: '0.3em 0.7em',
              position: "absolute",
              top: 179,
              left: 28,
              backgroundColor: "#FFFAA0",
              borderRadius: "5.6px",
              display: "flex",
              alignItems: "center",
              marginTop: 2,
              justifyContent: "center",
              paddingX: 1.5,
              animation: status !== "Normal" ? "zoomGlowTemperature 1.5s infinite" : "none", // Glow animation for non-normal status
              "@keyframes zoomGlowTemperature": {
                "0%": {
                  transform: "scale(1)",
                  boxShadow: "0 0 5px 0 rgba(255, 255, 0, 0.6)", // Light yellow glow
                },
                "50%": {
                  transform: "scale(1.1)",
                  boxShadow: "0 0 15px 5px rgba(255, 255, 0, 0.8)", // Intense yellow glow
                },
                "100%": {
                  transform: "scale(1)",
                  boxShadow: "0 0 5px 0 rgba(255, 255, 0, 0.6)", // Light yellow glow
                },
              },
            }}
          >
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: "bold",
              color: "black",
            }}
          >
            {status}
          </Typography>
        </Paper>

        <Paper
          onClick={handleOpenModal}
          sx={{
            width: 90,
            height: 90,
            position: "absolute",
            top: 126,
            left: 261,
            backgroundColor: "#FFFAA0",
            borderRadius: "7px",
            boxShadow: "0px 4px 4px #00000040",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            justifyContent: "center",
          }}
        >
          <MonitorHeartIcon sx={{ fontSize: 70, color: "#F4C430" }} />
        </Paper>
      </Box>
      <GraphModal
        show={showModal}
        onClose={handleCloseModal}
        patientId={id}
        vitalType="temperature"
        startDate={formatDate(today)}
        endDate={formatDate(tomorrow)}
      />
    </>
  );
};

export default TemperatureCard;
