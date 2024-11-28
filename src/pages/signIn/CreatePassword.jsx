import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const CreatePasswordContainer = styled(Stack)(({ theme }) => ({
  padding: 20,
  marginTop: "10vh",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function CreatePassword({ token }) {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

  const navigate = useNavigate();

  const validatePasswords = () => {
    let isValid = true;

    // Validate new password length
    if (newPassword.length < 6 || newPassword.length > 18) {
      setPasswordError("Password must be between 6 and 18 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Validate confirm password
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validatePasswords()) return;

    try {
      // First, get the refreshToken from the /api/Login/login endpoint
      const loginResponse = await fetch(
        "https://localhost:7194/api/Login/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Include the necessary login credentials here
          }),
        }
      );

      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        throw new Error(
          `Error: ${loginResponse.status} ${loginResponse.statusText} - ${errorText}`
        );
      }

      const { refreshToken } = await loginResponse.json();

      // Use the refreshToken in the reset-password request
      const requestBody = {
        token: refreshToken,
        newPassword,
      };

      console.log("Sending request:", requestBody); // Log the request body

      const response = await fetch(
        "https://localhost:7194/api/User/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // Get response text
        throw new Error(
          `Error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      console.log("Password reset successful");
      navigate("/signin"); // Redirect to login page after successful password reset
    } catch (error) {
      console.error("There was an error with the reset request:", error);
      // Optionally, handle error state here
    }
  };
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <CreatePasswordContainer
        direction="column"
        justifyContent="space-between"
      >
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Create Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="newPassword">New Password</FormLabel>
              <TextField
                error={!!passwordError}
                helperText={passwordError}
                id="newPassword"
                type="password"
                name="newPassword"
                placeholder="••••••"
                required
                fullWidth
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <TextField
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••"
                required
                fullWidth
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Submit
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              <Link href="/signin" variant="body2" sx={{ alignSelf: "center" }}>
                Back to Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </CreatePasswordContainer>
    </AppTheme>
  );
}
