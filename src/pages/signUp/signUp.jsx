import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import getSignUpTheme from "./theme/getSignUpTheme";
import { GoogleIcon, FacebookIcon } from "./CustomIcons";
import TemplateFrame from "./TemplateFrame";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import IMG from "./../../assets/img/icon/matcha.png";
import CircularProgress from "@mui/material/CircularProgress";
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "100%",
  padding: 4,
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  backgroundRepeat: "no-repeat",
  ...theme.applyStyles("dark", {
    backgroundImage:
      "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
  }),
}));

export default function SignUp() {
  const [mode, setMode] = React.useState("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const defaultTheme = createTheme({ palette: { mode } });
  const SignUpTheme = createTheme(getSignUpTheme(mode));

  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [nameError, setNameError] = React.useState("");
  const [genderError, setGenderError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");

  const [gender, setGender] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const [otp, setOtp] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isOtpLoading, setIsOtpLoading] = React.useState(false);

  React.useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const validateInputs = () => {
    let isValid = true;

    // Validate email
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate password
    if (password.length < 6 || password.length > 18) {
      setPasswordError("Password must be between 6 and 18 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Validate name
    if (name.length < 5 || name.length > 25) {
      setNameError("Name must be between 5 and 25 characters.");
      isValid = false;
    } else {
      setNameError("");
    }

    // Validate gender
    if (gender !== "Male" && gender !== "Female") {
      setGenderError("Please select a valid gender.");
      isValid = false;
    } else {
      setGenderError("");
    }

    // Validate phone
    const phoneRegex = /^(0|\+84)(\d{9,10})$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError("Please enter a valid phone number.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    return isValid;
  };

  const handleOtpValidation = async () => {
    setIsOtpLoading(true);
    try {
      const response = await fetch(
        "https://localhost:7194/api/Register/confirm-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert("Invalid OTP. Please try again.");
        return;
      }

      alert("Email confirmed successfully!");
      navigate("/signin", { state: { alert: "Registered Successfully!" } });
    } catch (error) {
      console.error("Error validating OTP:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!validateInputs()) return;

    setIsLoading(true);
    const dobValue = data.get("dob");
    const requestBody = {
      name: name,
      gender: gender,
      address: data.get("address"),
      dob: dobValue,
      email: email,
      password: password,
      roleID: 3,
      Phone: phone,
    };

    try {
      const response = await fetch("https://localhost:7194/api/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.text();

      if (!response.ok) {
        // Try to parse as JSON first
        try {
          const errorData = JSON.parse(data);
          alert(errorData.message || data);
        } catch {
          // If not JSON, show the raw text
          alert(data);
        }
        return;
      }

      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <TemplateFrame
      toggleCustomTheme={toggleCustomTheme}
      showCustomTheme={showCustomTheme}
      mode={mode}
      toggleColorMode={toggleColorMode}
    >
      <ThemeProvider theme={showCustomTheme ? SignUpTheme : defaultTheme}>
        <CssBaseline enableColorScheme />
        <SignUpContainer direction="column" justifyContent="space-between">
          <Stack
            sx={{
              justifyContent: "center",
              height: "100dvh",
              p: 2,
            }}
          >
            <Card variant="outlined" sx={{ position: "relative" }}>
              <img
                src={IMG}
                alt="Icon"
                style={{
                  position: "absolute",
                  top: "16px", // Adjust vertical positioning
                  right: "16px", // Adjust horizontal positioning
                  width: "80px", // Adjust size as needed
                  height: "auto",
                  zIndex: 1, // Ensure the image is above other elements
                }}
              />
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
              >
                Sign up
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <FormControl>
                  <FormLabel htmlFor="name">Full name</FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!nameError}
                    helperText={nameError}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="gender">Gender</FormLabel>
                  <Select
                    required
                    fullWidth
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    error={!!genderError}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="dob">Date of Birth</FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="dob"
                    name="dob"
                    type="date"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={!!phoneError}
                    helperText={phoneError}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="email">Email address</FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!passwordError}
                    helperText={passwordError}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="address"
                    name="address"
                    autoComplete="street-address"
                  />
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ position: "relative" }}
                >
                  {isLoading ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: "#90caf9", // Light blue color
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </Box>
              <Divider />
              <Typography>
                Already have an account?{" "}
                <Link href="/signin" variant="body1">
                  Log in here
                </Link>
              </Typography>
            </Card>
          </Stack>
        </SignUpContainer>

        {/* OTP Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          aria-labelledby="otp-dialog-title"
        >
          <DialogTitle id="otp-dialog-title">Email Verification</DialogTitle>
          <DialogContent>
            <Typography>
              Please enter the OTP sent to your email to verify your account.
            </Typography>
            <TextField
              required
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleOtpValidation}
              variant="contained"
              disabled={isOtpLoading}
              sx={{ position: "relative" }}
            >
              {isOtpLoading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "#90caf9", // Light blue color
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              ) : (
                "Submit"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </TemplateFrame>
  );
}
