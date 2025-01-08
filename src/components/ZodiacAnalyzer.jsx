import { useState } from "react";
import {
  Box,
  IconButton,
  Dialog,
  TextField,
  Button,
  Typography,
  Fade,
  Grid,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { format } from "date-fns";

const ZodiacAnalyzer = () => {
  const [openZodiac, setOpenZodiac] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [zodiacData, setZodiacData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleZodiacSubmit = async () => {
    try {
      setLoading(true);
      const formattedDate = format(new Date(birthDate), "MM/dd/yyyy");
      const response = await fetch(
        `https://vesttour.xyz/api/User/get-zodiac?birthDate=${encodeURIComponent(formattedDate)}`
      );
      const data = await response.json();
      setZodiacData(data);
    } catch (error) {
      console.error("Error fetching zodiac data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderColorBox = (color) => (
    <Fade in timeout={800}>
      <Box
        sx={{
          width: 100,
          height: 100,
          backgroundColor: color.toLowerCase(),
          borderRadius: 2,
          boxShadow: 3,
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          color="white"
          sx={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}
        >
          {color}
        </Typography>
      </Box>
    </Fade>
  );

  return (
    <>
      <IconButton
        onClick={() => setOpenZodiac(true)}
        sx={{
          position: "fixed",
          bottom: 180,
          right: 20,
          backgroundColor: "#2c3e50",
          color: "#fff",
          width: 40,
          height: 40,
          "&:hover": {
            backgroundColor: "#34495e",
            transform: "rotate(180deg)",
            transition: "all 0.3s ease-in-out",
          },
          transition: "all 0.3s ease-in-out",
          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .3)",
        }}
      >
        <AutoAwesomeIcon sx={{ fontSize: 20 }} />
      </IconButton>

      <Dialog
        open={openZodiac}
        onClose={() => {
          setOpenZodiac(false);
          setZodiacData(null);
        }}
        maxWidth="md"
        PaperProps={{
          sx: {
            background: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), 
                        url('/zodiac-bg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: 3,
            borderRadius: 2,
            minWidth: "500px",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)",
              pointerEvents: "none",
            },
          },
        }}
      >
        <Box
          sx={{
            color: "white",
            textAlign: "center",
            p: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontFamily: "Cinzel, serif",
              textShadow: "0 0 10px rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            Celestial Sign Revelation
          </Typography>

          <TextField
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.2)",
                "&:hover": {
                  border: "1px solid rgba(255,255,255,0.4)",
                },
              },
              "& .MuiOutlinedInput-input": {
                color: "white",
              },
              width: "100%",
              mb: 2,
            }}
          />

          <Button
            variant="contained"
            onClick={handleZodiacSubmit}
            disabled={!birthDate || loading}
            sx={{
              mb: 3,
              background: "linear-gradient(45deg, #4b6cb7 0%, #182848 100%)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                background: "linear-gradient(45deg, #182848 0%, #4b6cb7 100%)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            {loading ? "Consulting the Stars..." : "Reveal Your Cosmic Colors"}
          </Button>

          {zodiacData && (
            <Fade in timeout={1000}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontFamily: "Cinzel, serif",
                    textShadow: "0 0 10px rgba(255,255,255,0.5)",
                  }}
                >
                  {zodiacData.zodiacSign}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    opacity: 0.9,
                  }}
                >
                  Your Celestial Colors:
                </Typography>

                <Grid container spacing={2} justifyContent="center">
                  {zodiacData.suggestedColors.map((color, index) => (
                    <Grid item key={index}>
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          backgroundColor: color.toLowerCase(),
                          borderRadius: "50%",
                          boxShadow: `0 0 20px ${color.toLowerCase()}`,
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.1) rotate(360deg)",
                          },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%": {
                              boxShadow: `0 0 20px ${color.toLowerCase()}`,
                            },
                            "50%": {
                              boxShadow: `0 0 40px ${color.toLowerCase()}`,
                            },
                            "100%": {
                              boxShadow: `0 0 20px ${color.toLowerCase()}`,
                            },
                          },
                        }}
                      >
                        <Typography
                          color="white"
                          sx={{
                            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                            fontWeight: "bold",
                          }}
                        >
                          {color}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default ZodiacAnalyzer;
