import FavoriteIcon from "@mui/icons-material/Favorite";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GraphModal from "./GraphModal"; // Import the modal component

const HeartRate = ({ value }) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("Normal");
  const { id } = useParams();

  const formatDate = (date) => date.toISOString().split("T")[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  useEffect(() => {
    if (value >= 130) {
      setStatus("Too High");
      setShowModal(true);
    } else if (value < 40) {
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
          backgroundColor: "white",
          borderRadius: "16.81px",
          border: "1.4px solid #e7e6e6",
          boxShadow: "0px 1.4px 70.04px #00000014",
          padding: 2.8,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Paper
            sx={{
              width: 84,
              height: 81,
              backgroundColor: "#fbf0f3",
              borderRadius: "16.81px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 2,
            }}
          >
            <Avatar
              sx={{
                width: 61,
                height: 59,
                backgroundColor: "transparent",
              }}
            >
              <FavoriteIcon sx={{ fontSize: 40, color: "#e57373" }} />
            </Avatar>
          </Paper>

          <Typography
            variant="h5"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "500",
              color: "black",
            }}
          >
            Heart Rate
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            marginTop: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "normal",
              color: "#272927",
              marginLeft: 1,
            }}
          >
            {value ?? 60}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "bold",
              color: "#808080",
              marginLeft: 1,
            }}
          >
            bpm
          </Typography>
        </Box>

        <Paper
          sx={{
            width: 84,
            height: 33,
            position: "absolute",
            top: 179,
            left: 28,
            backgroundColor: status === "Normal" ? "#fbf0f3" : "#ffe6e6",
            borderRadius: "5.6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingX: 1.5,
            marginTop: 2,
            animation: status !== "Normal" ? "zoomGlow 1.5s infinite" : "none", // Only animate if status is not "Normal"
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
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "bold",
              color: status === "Normal" ? "black" : "#ff0000",
            }}
          >
            {status}
          </Typography>
        </Paper>

        <Box
          component={Paper}
          onClick={handleOpenModal}
          sx={{
            width: 90,
            height: 90,
            backgroundColor: "#fbf0f3",
            borderRadius: "7px",
            boxShadow: "0px 4px 4px #00000040",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "absolute",
            top: 126,
            left: 261,
            "&:hover": {
              boxShadow: "0px 6px 6px #00000060",
            },
          }}
        >
          <MonitorHeartIcon sx={{ fontSize: 70, color: "#e57373" }} />
        </Box>
      </Box>

      <GraphModal
        show={showModal}
        onClose={handleCloseModal}
        patientId={id}
        vitalType="heartbeat"
        startDate={formatDate(today)}
        endDate={formatDate(tomorrow)}
      />
    </>
  );
};

export default HeartRate;
