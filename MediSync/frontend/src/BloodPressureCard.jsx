import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import { Avatar, Box, Paper, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GraphModal from "./GraphModal";

const BloodPressureCard = ({ systolic, diastolic }) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("Normal");
  const { id } = useParams();

  const formatDate = (date) => date.toISOString().split("T")[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  useEffect(() => {
    if (systolic >= 140 || diastolic >= 90) {
      setStatus("Too High");
    } else if (systolic < 70 || diastolic < 40) {
      setStatus("Too Low");
    } else {
      setStatus("Normal");
    }
  }, [systolic, diastolic]);

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
          variant="h6"
          sx={{
            position: "absolute",
            top: 48,
            left: 135,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: "500",
            color: "black",
          }}
        >
          Blood Pressure
        </Typography>

        <Box
          sx={{
            marginTop: 1.5,
            position: "absolute",
            top: 115,
            left: 28,
            display: "flex",
            alignItems: "baseline",
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: "normal",
              color: "#272927",
              lineHeight: 1,
              fontSize: "3rem",
            }}
          >
            {systolic ?? "--"}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: "normal",
              color: "#272927",
              lineHeight: 1,
              fontSize: "2rem",
            }}
          >
            /
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: "normal",
              color: "#272927",
              lineHeight: 1,
              fontSize: "2rem",
            }}
          >
            {diastolic ?? "--"}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "bold",
              color: "#808080",
            }}
          >
            mmHg
          </Typography>
        </Box>

        <Paper
          sx={{
            width: 84,
            height: 81,
            position: "absolute",
            top: 21,
            left: 28,
            backgroundColor: "#D0FBFF",
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
            <BloodtypeIcon sx={{ fontSize: 60, color: "#6495ED" }} />
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
            backgroundColor: "#D0FBFF",
            borderRadius: "5.6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingX: 1.5,
            marginTop: 2,
            animation: status !== "Normal" ? "zoomGlowBlood 1.5s infinite" : "none", // Glow animation for non-normal status
            "@keyframes zoomGlowBlood": {
              "0%": {
                transform: "scale(1)",
                boxShadow: "0 0 5px 0 rgba(100, 149, 237, 0.6)", // Light blue glow
              },
              "50%": {
                transform: "scale(1.1)",
                boxShadow: "0 0 15px 5px rgba(100, 149, 237, 0.8)",
              },
              "100%": {
                transform: "scale(1)",
                boxShadow: "0 0 5px 0 rgba(100, 149, 237, 0.6)", 
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
            backgroundColor: "#D0FBFF",
            borderRadius: "7px",
            boxShadow: "0px 4px 4px #00000040",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            justifyContent: "center",
          }}
        >
          <MonitorHeartIcon sx={{ fontSize: 70, color: "#6495ED" }} />
        </Paper>
      </Box>

      <GraphModal
        show={showModal}
        onClose={handleCloseModal}
        patientId={id}
        vitalType="bloodpressure"
        startDate={formatDate(today)}
        endDate={formatDate(tomorrow)}
      />
    </>
  );
};

export default BloodPressureCard;
