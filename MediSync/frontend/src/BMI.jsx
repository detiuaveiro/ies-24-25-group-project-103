import { Box, Chip, Typography } from "@mui/material";
import React from "react";

const BMI = ({patient}) => {
  const bmi = patient.weight /(patient.height * patient.height);
  return (
    <Box
      sx={{
        width: 276,
        height: 185,
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
        label="Healthy"
        sx={{
          position: "absolute",
          top: 69,
          left: 169,
          backgroundColor: "#d5ffdd",
          color: "black",
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
            width: 254,
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
            left: 118,
            width: 9,
            height: 9,
            backgroundColor: "#d16564",
            borderRadius: 19,
            border: "1px solid white",
          }}
        />
      </Box>
    </Box>
  );
};

export default BMI;
