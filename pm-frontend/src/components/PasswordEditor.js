import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Help as HelpIcon } from "@mui/icons-material";
import * as React from "react";
import { useEffect, useState } from "react";
const axios = require("axios");

export default function PasswordAdder(props) {
  const [submitted, setSubmitted] = useState(false);
  const [authToken, setAuthToken] = useState();
  const apiEndpoint = "https://password-manager-backend329.herokuapp.com"
  // "http://localhost:" + (process.env.PORT || 3001);

  useEffect(() => {
    setAuthToken(localStorage.getItem("authToken"));
  }, []);

  const editPassword = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const inValid =
      !data.get("website") || !data.get("username") || !data.get("password");
    console.log(inValid + " : " + data.get("website"));

    if (inValid) {
      alert("Please fill out all fields");
      return;
    }
    setSubmitted(true);

    const reqBody = {
      label: data.get("website"),
      newUsername: data.get("username"),
      newPassword: data.get("password"),
    };

    try {
      await axios.put(apiEndpoint + "/changePassword", reqBody, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSubmitted(false);
      props.modalCallback();
      //alert("Success");
    } catch (error) {
      console.log("Error editing password: " + error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box component="form" onSubmit={editPassword} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="website"
          label="Website"
          name="website"
          value={props.website}
        />
        <TextField
          margin="normal"
          fullWidth
          name="username"
          label="Username"
          id="username"
          autoComplete="username"
          defaultValue={props.username}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Tooltip
            sx={{ mb: 1 }}
            title={
              <h3>
                What makes a password good?
                <p></p>
                Make your password at least 8 characters long! The longer your
                password is, the more possible combinations of characters are
                there. So the more characters you use, the safer it is.
                <p></p>
                Use as many different characters as possible! Do not only use
                alphanumeric characters, also include special characters,
                punctuation and spaces! The more complex your password is, the
                safer it is.
                <p></p>
                Do not reuse passwords! Once one login is hacked, the hacker has
                access to all other logins, too. Do you really want that?
                <p></p>
                Do not use simple words or names! Your password should never be
                your username, the name of the website or a simple word from a
                dictionary! These will always be the first things a hacker
                exploits.
              </h3>
            }
            followCursor
          >
            <Typography>
              <HelpIcon sx={{ mr: 1 }} />
              Password Advice
            </Typography>
          </Tooltip>
          <Typography>
            Can't think of a password? Try our{" "}
            <a href="/generator">password generator</a>
          </Typography>
          <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }}>
            Edit login
          </Button>
        </Box>
      </Box>
      {submitted && (
        <>
          <Typography>Encrypting...</Typography>
          <CircularProgress />
        </>
      )}
    </Box>
  );
}
