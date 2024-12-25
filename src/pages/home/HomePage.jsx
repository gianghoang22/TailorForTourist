import { useEffect, useState } from "react";
import { Box, IconButton, Dialog, TextField, Button } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ScrollToTopOnMount from "../../layouts/components/navigation/BackToTop";
import { Navigation } from "../../layouts/components/navigation/Navigation";
import { Footer } from "../../layouts/components/footer/Footer";
import { HomePageBody } from "./HomePageBody";
import { HomePageBody1 } from "./HomePageBody1";
import { HomePageBody2 } from "./HomePageBody2";
import { HomePageBody3 } from "./HomePageBody3";
import { HomePageBody4 } from "./HomePageBody4";
import ZodiacAnalyzer from "../../components/ZodiacAnalyzer";
import SkinToneAnalyzer from "../../components/SkinToneAnalyzer";

const HomePage = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Load Chatra script
    const script = document.createElement("script");
    script.src = "https://call.chatra.io/chatra.js";
    script.async = true;
    script.onload = () => {
      window.ChatraID = "BFdjS7x2fxuPNjc6L";
      window.Chatra =
        window.Chatra ||
        function () {
          (window.Chatra.q = window.Chatra.q || []).push(arguments);
        };
    };
    document.head.appendChild(script);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const threshold = pageHeight / 15;
      setShowBackToTop(scrollPosition > threshold);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      // Cleanup
      window.removeEventListener("scroll", handleScroll);
      document.head.removeChild(script); // Remove the Chatra script
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navigation />
      <HomePageBody />
      <HomePageBody1 />
      <HomePageBody2 />
      <HomePageBody3 />
      <HomePageBody4 />
      <Footer />

      <Box className="main-container">
        <ScrollToTopOnMount />
        <main style={{ backgroundColor: "#c7eef2" }}>
          {/* Back to Top Button */}
          <div
            style={{
              opacity: showBackToTop ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              position: "fixed",
              bottom: 20,
              right: 20,
              width: "60px",
              height: "60px",
            }}
          >
            <IconButton
              onClick={scrollToTop}
              style={{
                backgroundColor: "#ffcc00",
                color: "#fff",
                width: "100%",
                height: "100%",
              }}
            >
              <KeyboardArrowUpIcon />
            </IconButton>
          </div>
        </main>
      </Box>
      <ZodiacAnalyzer />
      <SkinToneAnalyzer />
    </>
  );
};

export default HomePage;
