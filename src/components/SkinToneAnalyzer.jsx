import { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  IconButton,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import {
  analyzeSkinColor,
  determineSkinToneCategory,
} from "../utils/skinToneAnalysis";
import { MediaPipeFaceMesh } from "@tensorflow-models/face-landmarks-detection/dist/types";
import * as blazeface from "@tensorflow-models/blazeface";

const SkinToneAnalyzer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const [facePosition, setFacePosition] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState(null);

  // Color recommendations based on skin tone
  const colorRecommendations = {
    light: {
      recommended: ["#E6B8AF", "#B4D7A8", "#9FC5E8", "#D5A6BD"],
      avoid: ["#000000", "#FFFFFF"],
    },
    medium: {
      recommended: ["#FFE599", "#93C47D", "#A2C4C9", "#8E7CC3"],
      avoid: ["#FF0000", "#FFFF00", "#0000FF"],
    },
    dark: {
      recommended: ["#B45F06", "#38761D", "#134F5C", "#351C75"],
      avoid: ["#FFB6C1", "#E6E6FA", "#F0F8FF"],
    },
  };

  // Add descriptions for skin types
  const skinTypeDescriptions = {
    light: "Light skin tone - Your skin has a fair complexion",
    medium: "Medium skin tone - Your skin has a balanced, moderate tone",
    dark: "Dark skin tone - Your skin has a deep, rich complexion",
  };

  // Add origin-specific formulas
  const originFormulas = {
    asian: {
      // Your existing formula for Asian skin
      light: { min: 0, max: 180 },
      medium: { min: 181, max: 210 },
      dark: { min: 211, max: 255 },
    },
    caucasian: {
      // New formula for White/Caucasian skin
      light: { min: 0, max: 200 },
      medium: { min: 201, max: 225 },
      dark: { min: 226, max: 255 },
    },
  };

  // Simplified model loading
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Loading face detection model...");
        const model = await blazeface.load();
        console.log("Model loaded successfully");
        modelRef.current = model;
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };
    loadModel();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          // Start detection after video is ready
          detectFace();
        };
      }
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setResults(null);
  };

  // Update face detection function
  const detectFace = useCallback(async () => {
    if (!videoRef.current || !modelRef.current || !canvasRef.current) return;

    try {
      const predictions = await modelRef.current.estimateFaces(
        videoRef.current,
        false
      );

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Ensure canvas dimensions match video
      if (canvas.width !== videoRef.current.videoWidth) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (predictions.length > 0) {
        const face = predictions[0];

        // Draw tracking box
        const startX = face.topLeft[0];
        const startY = face.topLeft[1];
        const width = face.bottomRight[0] - startX;
        const height = face.bottomRight[1] - startY;

        // Draw outer box
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 3;
        ctx.strokeRect(startX, startY, width, height);

        // Draw corner markers
        const markerLength = 20;
        ctx.beginPath();

        // Top-left
        ctx.moveTo(startX, startY + markerLength);
        ctx.lineTo(startX, startY);
        ctx.lineTo(startX + markerLength, startY);

        // Top-right
        ctx.moveTo(startX + width - markerLength, startY);
        ctx.lineTo(startX + width, startY);
        ctx.lineTo(startX + width, startY + markerLength);

        // Bottom-left
        ctx.moveTo(startX, startY + height - markerLength);
        ctx.lineTo(startX, startY + height);
        ctx.lineTo(startX + markerLength, startY + height);

        // Bottom-right
        ctx.moveTo(startX + width - markerLength, startY + height);
        ctx.lineTo(startX + width, startY + height);
        ctx.lineTo(startX + width, startY + height - markerLength);

        ctx.stroke();

        // Draw landmarks
        if (face.landmarks) {
          ctx.fillStyle = "#00ff00";
          face.landmarks.forEach((landmark) => {
            ctx.beginPath();
            ctx.arc(landmark[0], landmark[1], 3, 0, 2 * Math.PI);
            ctx.fill();
          });
        }

        setFacePosition(face);
      } else {
        setFacePosition(null);
      }
    } catch (error) {
      console.error("Face detection error:", error);
    }

    animationRef.current = requestAnimationFrame(detectFace);
  }, []);

  const calculateFaceBounds = (mesh) => {
    const xs = mesh.map((point) => point[0]);
    const ys = mesh.map((point) => point[1]);
    return {
      left: Math.min(...xs),
      top: Math.min(...ys),
      right: Math.max(...xs),
      bottom: Math.max(...ys),
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys),
    };
  };

  const sampleSkinTone = async (video, bounds) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Sample points from cheeks and forehead
    const samplePoints = [
      {
        x: bounds.left + bounds.width * 0.25,
        y: bounds.top + bounds.height * 0.4,
      },
      {
        x: bounds.right - bounds.width * 0.25,
        y: bounds.top + bounds.height * 0.4,
      },
      {
        x: bounds.left + bounds.width * 0.5,
        y: bounds.top + bounds.height * 0.2,
      },
    ];

    const colors = samplePoints.map((point) => {
      const pixel = ctx.getImageData(point.x, point.y, 1, 1).data;
      return [pixel[0], pixel[1], pixel[2]];
    });

    return colors
      .reduce(
        (acc, color) => [
          acc[0] + color[0],
          acc[1] + color[1],
          acc[2] + color[2],
        ],
        [0, 0, 0]
      )
      .map((v) => Math.round(v / colors.length));
  };

  // Add this useEffect to start face detection when video is ready
  useEffect(() => {
    if (isOpen && stream && videoRef.current && modelRef.current) {
      console.log("Starting face detection");
      detectFace();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen, stream, detectFace]);

  const analyzeSkinTone = async () => {
    if (!facePosition || !videoRef.current) {
      alert("Please position your face properly in the frame");
      return;
    }

    setIsAnalyzing(true);
    try {
      // Create tensor from video frame
      const videoFrame = tf.browser.fromPixels(videoRef.current);

      // Analyze skin color using the detected face position
      const skinTone = await analyzeSkinColor(videoFrame, facePosition);

      // Determine category and set results
      const category = determineSkinToneCategory(skinTone);
      setResults({
        skinTone,
        category,
        recommendations: colorRecommendations[category],
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      const setCanvasSize = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      };

      videoRef.current.addEventListener("loadedmetadata", setCanvasSize);
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener("loadedmetadata", setCanvasSize);
        }
      };
    }
  }, []);

  // Debug overlay component
  const DebugOverlay = () => (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "rgba(0,0,0,0.5)",
        color: "white",
        padding: 1,
        borderRadius: 1,
        fontSize: "12px",
      }}
    >
      <div>Model loaded: {isModelLoaded ? "Yes" : "No"}</div>
      <div>
        Video dimensions: {videoRef.current?.videoWidth || 0}x
        {videoRef.current?.videoHeight || 0}
      </div>
      <div>Face detected: {facePosition ? "Yes" : "No"}</div>
    </Box>
  );

  // Add helper text component
  const HelperText = () => (
    <Box
      sx={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        color: "white",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: "8px 16px",
        borderRadius: "4px",
        zIndex: 2,
      }}
    >
      {!facePosition ? (
        <Typography variant="body1">
          Please position your face within the frame
        </Typography>
      ) : (
        <Typography variant="body1" color="success.main">
          Face detected! Click Analyze to continue
        </Typography>
      )}
    </Box>
  );

  return (
    <>
      {/* Origin Selection Dialog */}
      <Dialog open={!selectedOrigin && isOpen} maxWidth="xs" fullWidth>
        <Box p={3}>
          <Typography variant="h5" gutterBottom align="center">
            Select Your Origin
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" mt={2}>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedOrigin("asian");
                startCamera();
              }}
              sx={{
                minWidth: 120,
                backgroundColor: "#4CAF50",
                "&:hover": { backgroundColor: "#388E3C" },
              }}
            >
              Asian
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedOrigin("caucasian");
                startCamera();
              }}
              sx={{
                minWidth: 120,
                backgroundColor: "#2196F3",
                "&:hover": { backgroundColor: "#1976D2" },
              }}
            >
              Caucasian
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Camera Button - Only show if origin is selected */}
      <IconButton
        onClick={() => setIsOpen(true)}
        sx={{
          position: "fixed",
          bottom: 90,
          right: 20,
          backgroundColor: "#ffcc00",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#e6b800",
          },
        }}
      >
        <CameraAltIcon />
      </IconButton>

      {/* Camera Dialog - Only show if origin is selected */}
      <Dialog
        open={isOpen && selectedOrigin}
        onClose={() => {
          setIsOpen(false);
          stopCamera();
          setSelectedOrigin(null); // Reset origin when closing
        }}
        maxWidth="md"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h5" gutterBottom>
            Skin Tone Analyzer
          </Typography>

          {/* Updated Video Preview with overlay */}
          <Box sx={{ position: "relative", width: "100%", aspectRatio: "4/3" }}>
            <video
              ref={videoRef}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)",
              }}
              autoPlay
              playsInline
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                transform: "scaleX(-1)",
              }}
            />
            <HelperText />
            <DebugOverlay />
          </Box>

          {/* Updated Controls */}
          <Box mt={2} display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={analyzeSkinTone}
              disabled={isAnalyzing || !facePosition}
              color={facePosition ? "success" : "primary"}
            >
              {isAnalyzing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Analyze Skin Tone"
              )}
            </Button>
          </Box>

          {/* Results - Updated with Skin Type Information */}
          {results && (
            <Box mt={3}>
              {/* Add Skin Type Result */}
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="h6" gutterBottom color="primary">
                  Your Skin Type Analysis
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {skinTypeDescriptions[results.category]}
                </Typography>
              </Paper>

              {/* Color Recommendations */}
              <Typography variant="h6" gutterBottom>
                Color Recommendations
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    Recommended Colors:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {results.recommendations.recommended.map((color) => (
                      <Paper
                        key={color}
                        sx={{
                          width: 60,
                          height: 60,
                          backgroundColor: color,
                          border: "1px solid #ddd",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          "&:hover": {
                            "& .colorCode": {
                              opacity: 1,
                            },
                          },
                        }}
                      >
                        <Typography
                          className="colorCode"
                          sx={{
                            position: "absolute",
                            backgroundColor: "rgba(0,0,0,0.7)",
                            color: "white",
                            padding: "2px 4px",
                            fontSize: "10px",
                            opacity: 0,
                            transition: "opacity 0.2s",
                          }}
                        >
                          {color}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Colors to Avoid:</Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {results.recommendations.avoid.map((color) => (
                      <Paper
                        key={color}
                        sx={{
                          width: 60,
                          height: 60,
                          backgroundColor: color,
                          border: "1px solid #ddd",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          "&:hover": {
                            "& .colorCode": {
                              opacity: 1,
                            },
                          },
                        }}
                      >
                        <Typography
                          className="colorCode"
                          sx={{
                            position: "absolute",
                            backgroundColor: "rgba(0,0,0,0.7)",
                            color: "white",
                            padding: "2px 4px",
                            fontSize: "10px",
                            opacity: 0,
                            transition: "opacity 0.2s",
                          }}
                        >
                          {color}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default SkinToneAnalyzer;
