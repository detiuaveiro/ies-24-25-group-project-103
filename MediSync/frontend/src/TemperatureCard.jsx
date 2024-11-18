import FavoriteIcon from "@mui/icons-material/Favorite";
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import { Avatar, Box, Paper, Typography } from "@mui/material";
import React from "react";

const TemperatureCard = ({patient}) => {
  return (
    
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
          width: 84,
          height: 33,
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
          justifyContent: "center",
        }}
      >
        <MonitorHeartIcon sx={{ fontSize: 70, color: "#F4C430" }} />
      </Paper>
    </Box>
  );
};

export default TemperatureCard;
