import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { Avatar, Box, Paper, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GraphModal from "./GraphModal";

const OxygenCard = ({ value }) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("Normal");
  const { id } = useParams();

  const formatDate = (date) => date.toISOString().split("T")[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  useEffect(() => {
    if (value <= 94) {
      setStatus("Too Low");
      setShowModal(true);
    } else {
      setStatus("Normal");
      setShowModal(false);
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
          Oxygen Levels
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
          {value ?? 98}
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
          %
        </Typography>

        <Paper
          sx={{
            width: 84,
            height: 81,
            position: "absolute",
            top: 21,
            left: 28,
            backgroundColor: "#F8D6BD",
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
            <img src="/oxygen.png" alt="Oxygen" />
          </Avatar>
        </Paper>

        <Paper
          sx={{
            width: 84,
            height: 33,
            position: "absolute",
            top: 179,
            left: 28,
            backgroundColor: status === "Normal" ? "#F8D6BD" : "#FFE6E6",
            borderRadius: "5.6px",
            display: "flex",
            alignItems: "center",
            marginTop: 2,
            justifyContent: "center",
            paddingX: 1.5,
            animation: status !== "Normal" ? "zoomGlow 1.5s infinite" : "none",
            "@keyframes zoomGlow": {
              "0%": {
                transform: "scale(1)",
                boxShadow: "0 0 5px 0 rgba(255, 0, 0, 0.6)",
              },
              "50%": {
                transform: "scale(1.1)",
                boxShadow: "0 0 15px 5px rgba(255, 0, 0, 0.8)",
              },
              "100%": {
                transform: "scale(1)",
                boxShadow: "0 0 5px 0 rgba(255, 0, 0, 0.6)",
              },
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: "bold",
              color: status === "Normal" ? "black" : "#FF0000",
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
            backgroundColor: "#F8D6BD",
            borderRadius: "7px",
            boxShadow: "0px 4px 4px #00000040",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            justifyContent: "center",
          }}
        >
          <MonitorHeartIcon sx={{ fontSize: 70, color: "#E77B38" }} />
        </Paper>
      </Box>
      <GraphModal
        show={showModal}
        onClose={handleCloseModal}
        patientId={id}
        vitalType="o2"
        startDate={formatDate(today)}
        endDate={formatDate(tomorrow)}
      />
    </>
  );
};

export default OxygenCard;
