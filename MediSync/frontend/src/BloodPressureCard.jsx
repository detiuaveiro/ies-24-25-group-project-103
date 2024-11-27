import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import { Avatar, Box, Paper, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import GraphModal from "./GraphModal";
const BloodPressureCard = () => {
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();

  const formatDate = (date) => date.toISOString().split("T")[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

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
        65
      </Typography>

      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: 131,
          left: 103,
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: "bold",
          color: "#808080",
        }}
      >
       mmHg
      </Typography>

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
          width: 84,
          height: 33,
          position: "absolute",
          top: 179,
          left: 28,
          backgroundColor: "#D0FBFF",
          borderRadius: "5.6px",
          display: "flex",
          alignItems: "center",
          marginTop: 2,
          justifyContent: "center",
          paddingX: 1.5,
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
          Normal
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
