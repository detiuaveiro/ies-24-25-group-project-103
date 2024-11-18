import { Box, Chip, Typography } from "@mui/material";
import React from "react";

const BMI = ({ patient }) => {
  const bmi = (patient.weight / ((patient.height  / 100) * (patient.height / 100))).toFixed(1); // Round to 1 decimal
  const minBMI = 15;
  const maxBMI = 40;
  const healthyMin = 18.5;
  const healthyMax = 24.9;
  const gradientWidth = 254; // Total width of the gradient bar

  // Calculate the position of the red circle based on BMI
  const calculateLeftPosition = (bmi) => {
    if (bmi < minBMI) return 0; // Clamp to the start
    if (bmi > maxBMI) return gradientWidth; // Clamp to the end
    return ((bmi - minBMI) / (maxBMI - minBMI)) * gradientWidth;
  };

  const circleLeftPosition = calculateLeftPosition(bmi);

  // Determine the chip label and color
  let chipLabel = "Healthy";
  let chipColor = { backgroundColor: "#d5ffdd", color: "black" };

  if (bmi < healthyMin) {
    chipLabel = "Too Low";
    chipColor = { backgroundColor: "#ff6b6b", color: "white" };
  } else if (bmi > healthyMax) {
    chipLabel = "Too High";
    chipColor = { backgroundColor: "#ff6b6b", color: "white" };
  }

  return (
    <Box
      sx={{
        width: 296,
        height: 205,
        position: "relative",
        backgroundColor: "#4a4949",
        borderRadius: 2,
        padding: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: 22,
          left: 21,
          color: "white",
          fontFamily: "Mulish, Helvetica",
        }}
      >
        Body Mass Index (BMI)
      </Typography>

      <Typography
        variant="h3"
        sx={{
          position: "absolute",
          top: 67,
          left: 21,
          color: "white",
          fontFamily: "Mulish, Helvetica",
        }}
      >
        {bmi}
      </Typography>

      <Chip
        label={chipLabel}
        sx={{
          position: "absolute",
          top: 69,
          left: 169,
          ...chipColor, // Apply dynamic background and text color
          fontFamily: "Mulish, Helvetica",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 131,
          left: 21,
          width: 268,
          height: 55,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: 38,
            left: 0,
            color: "white",
            fontWeight: "bold",
            fontFamily: "Mulish, Helvetica",
          }}
        >
          15
        </Typography>

        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: 38,
            left: 58,
            color: "white",
            fontWeight: "bold",
            fontFamily: "Mulish, Helvetica",
          }}
        >
          18.5
        </Typography>

        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: 38,
            left: 122,
            color: "white",
            fontWeight: "bold",
            fontFamily: "Mulish, Helvetica",
          }}
        >
          25
        </Typography>

        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: 38,
            left: 178,
            color: "white",
            fontWeight: "bold",
            fontFamily: "Mulish, Helvetica",
          }}
        >
          30
        </Typography>

        <Typography
          variant="body2"
          sx={{
            position: "absolute",
            top: 38,
            left: 242,
            color: "white",
            fontWeight: "bold",
            fontFamily: "Mulish, Helvetica",
          }}
        >
          40
        </Typography>

        <Box
          sx={{
            position: "absolute",
            top: 14,
            left: 0,
            width: gradientWidth,
            height: 15,
            borderRadius: 21,
            background:
              "linear-gradient(90deg, rgba(180, 212, 241, 1) 0%, rgba(129, 229, 218, 1) 37.77%, rgba(231, 210, 132, 1) 70.4%, rgba(226, 120, 142, 1) 100%)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: -2,
            left: circleLeftPosition,
            width: 9,
            height: 9,
            backgroundColor: "#d16564",
            borderRadius: 19,
            border: "1px solid white",
            transform: "translateX(-50%)", // Center the circle horizontally
          }}
        />
      </Box>
    </Box>
  );
};

export default BMI;
