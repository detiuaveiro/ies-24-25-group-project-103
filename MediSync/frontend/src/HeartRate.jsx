import FavoriteIcon from "@mui/icons-material/Favorite";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import { Avatar, Box, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import GraphModal from "./GraphModal"; // Import the modal component

const HeartRate = () => {
  const [showModal, setShowModal] = useState(false);
  const {id} = useParams();
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
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "500",
            color: "black",
          }}
        >
          Heart Rate
        </Typography>

        <Typography
          variant="h2"
          sx={{
            position: "absolute",
            top: 115,
            left: 28,
            fontFamily: "Montserrat, sans-serif",
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
            fontFamily: "Montserrat, sans-serif",
            fontWeight: "bold",
            color: "#808080",
          }}
        >
          bpm
        </Typography>

        <Paper
          sx={{
            width: 84,
            height: 81,
            position: "absolute",
            top: 21,
            left: 28,
            backgroundColor: "#fbf0f3",
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
            <FavoriteIcon sx={{ fontSize: 40, color: "#e57373" }} />
          </Avatar>
        </Paper>

        <Paper
          sx={{
            width: 84,
            height: 33,
            position: "absolute",
            top: 179,
            left: 28,
            backgroundColor: "#fbf0f3",
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
              fontFamily: "Montserrat, sans-serif",
              fontWeight: "bold",
              color: "black",
            }}
          >
            Normal
          </Typography>
        </Paper>

        <Box
          component={Paper}
          onClick={handleOpenModal} // Open modal on click
          sx={{
            width: 90,
            height: 90,
            position: "absolute",
            top: 126,
            left: 261,
            backgroundColor: "#fbf0f3",
            borderRadius: "7px",
            boxShadow: "0px 4px 4px #00000040",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer", // Add pointer cursor
            "&:hover": {
              boxShadow: "0px 6px 6px #00000060", // Optional hover effect
            },
          }}
        >
          <MonitorHeartIcon sx={{ fontSize: 70, color: "#e57373" }} />
        </Box>
      </Box>

      <GraphModal
        show={showModal}
        onClose={() => setShowModal(false)}
        patientId="12345"
        vitalType="heartbeat"
        startDate="2023-11-25T14:00:00Z"
        endDate="2023-11-25T15:00:00Z"
      />
    </>
  );
};

export default HeartRate;
