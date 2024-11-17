import { Box, Typography } from "@mui/material";
const HeightWidthBox = ({patient}) => {
    return (
      <div>
      <Box
        sx={{
          width: 196,
          height: 85,
          position: "relative",
          top: 0,
          left: 0,
          bgcolor: "#f7debc",
          borderRadius: 2,
          margin: "10px",
          p: 1,
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            top: 47,
            left: 21,
            fontFamily: "'Mulish', Helvetica, Arial, sans-serif",
            fontWeight: "400",
            color: "#272927",
            fontSize: "1.2rem",
          }}
        >
          Height
        </Typography>
  
        <Typography
          sx={{
            position: "absolute",
            top: 47,
            left: 110,
            fontFamily: "Mulish, Helvetica",
            fontWeight: "normal",
            color: "#272927",
            fontSize: "1.2rem",
          }}
        >
          {patient.height} cm
        </Typography>
  
        <Box
      sx={{
        position: "relative",
        width: "103px",
        height: "25px",
        marginLeft: "90px",
        marginTop: "10px",
      }}
    >
      <Box
        sx={{
          width: "103px",
          height: "25px",
          top: 0,
          marginLeft: "100px",
        }}
      >
        <Box
          sx={{
            height: "11px",
            left: 0,
            backgroundColor: "#28282847",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "13px",
            backgroundColor: "#28282866",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "25px",
            backgroundColor: "#282828b2",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "25px",
            left: "38px",
            backgroundColor: "#d16564",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "50px",
            backgroundColor: "#282828",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "63px",
            backgroundColor: "#282828",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "75px",
            backgroundColor: "#282828",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "88px",
            backgroundColor: "#28282899",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "101px",
            backgroundColor: "#2828284c",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
      </Box>
    </Box>
    </Box>
    <Box
        sx={{
          width: 196,
          height: 85,
          position: "relative",
          top: 0,
          left: 0,
          bgcolor: "#D0FBFF",
          borderRadius: 2,
          margin: "10px",
          p: 1,
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            top: 47,
            left: 21,
            fontFamily: "Mulish, Helvetica",
            fontWeight: "normal",
            color: "#272927",
            fontSize: "1.2rem",
          }}
        >
          Weight
        </Typography>
  
        <Typography
          sx={{
            position: "absolute",
            top: 47,
            left: 110,
            fontFamily: "Mulish, Helvetica",
            fontWeight: "normal",
            color: "#272927",
            fontSize: "1.2rem",
          }}
        >
         {patient.weight} kg 
        </Typography>
  
        <Box
      sx={{
        position: "relative",
        width: "103px",
        height: "25px",
        marginLeft: "90px",
        marginTop: "10px",
      }}
    >
      <Box
        sx={{
          width: "103px",
          height: "25px",
          top: 0,
          marginLeft: "100px",
        }}
      >
        <Box
          sx={{
            height: "11px",
            left: 0,
            backgroundColor: "#28282847",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "13px",
            backgroundColor: "#28282866",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "25px",
            backgroundColor: "#282828b2",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "25px",
            left: "38px",
            backgroundColor: "#d16564",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "50px",
            backgroundColor: "#282828",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "63px",
            backgroundColor: "#282828",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "75px",
            backgroundColor: "#282828",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "88px",
            backgroundColor: "#28282899",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
        <Box
          sx={{
            height: "11px",
            left: "101px",
            backgroundColor: "#2828284c",
            position: "absolute",
            width: "2px",
            top: 0,
            borderRadius: "25px",
          }}
        />
      </Box>
    </Box>
    </Box>
    </div>
    );
  };
  
  export default HeightWidthBox;