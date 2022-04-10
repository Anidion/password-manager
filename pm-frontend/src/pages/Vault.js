import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import LoginPrompt from "../components/LoginPrompt";
import PasswordAdder from "../components/PasswordAdder";
import { useNavigate } from "react-router-dom";
const axios = require("axios");

export default function PasswordGetter() {
  const navigate = useNavigate();
  const [validInput, setValidInput] = useState(false);
  const [showEditPop, setShowEditPop] = useState(false);
  const [showDeletePop, setShowDeletePop] = useState(false);
  // const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [isPassWrong, setIsPassWrong] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [savedSites, setSavedSites] = useState();

  const [revealedPass, setRevealedPass] = useState();
  const [selectedSite, setSelectedSite] = useState();
  const [revealed, setRevealed] = useState(false);

  const popupStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "column",
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const foundToken = localStorage.getItem("authToken");
    if (foundToken != null) {
      setLoggedIn(true);
    }

    // !testing only
    // TODO: delete
    // setSavedSites([
    //   "Google",
    //   "Facebook",
    //   "Instagram",
    //   "Firefox",
    //   "Snapchat",
    //   "Reddit",
    //   "D2L",
    //   "ucalgary",
    //   "Miniclip",
    //   "Cool Math Games",
    // ]);
  }, []);

  const getAllSites = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/passwords",
        {
          passphrase: passphrase,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setErrorMsg("");
      setIsPassWrong(false);
      setSavedSites(response.data);
      setAuthenticated(true);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        setErrorMsg("Incorrect Passphrase, try again!");
        setIsPassWrong(true);
      }
    }
  };
  const revealPassword = async (site) => {
    console.log("Revealing " + site.label);
    try {
      const res = await axios.get(
        `http://localhost:3001/password?label=${site.label}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setRevealedPass(res.data.password);
      setSelectedSite(res.data);
      setRevealed(true);
    } catch (error) {
      console.log("Error");
    }
  };

  const deleteEntry = async (site) => {
    console.log("Deleting " + site.label);
    try {
      const response = await axios.delete(
        "http://localhost:3001/removePassword",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          data: {
            requestedSite: site.label,
          },
        }
      );
      if (response.status === 200) {
        console.log("Successfully deleted");
        let savedSitesCopy = savedSites;
        let index = savedSitesCopy.indexOf(site.label);
        if (index !== -1) {
          savedSitesCopy.splice(index, 1);
        }
        setSavedSites(savedSitesCopy);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCallback = (newLabel) => {
    console.log("handling call back")
    setSavedSites([...savedSites, newLabel]);
  };

  /*   const editEntry = (site) => {
    console.log("Editing " + site);
    axios.post(
      "http://localhost:3001/passwords/delete",
      {
        requestedSite: site,
      },
      {
        headers: {
          token: "JWT_TOKEN_HERE",
        },
      }
    );
  }; */

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        sx={{ color: "#404040", mt: 5 }}
      >
        Save a password:
      </Typography>

      <PasswordAdder endpoint="addPassword" sx={{ mb: 2 }} addCallback={handleAddCallback} />

      <Modal open={showEditPop}>
        <Box sx={popupStyle}>
          <IconButton
            color="primary"
            style={{ marginLeft: "auto" }}
            onClick={() => setShowEditPop(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h4"
            component="div"
            gutterBottom
            sx={{ color: "#404040", mt: 1 }}
          >
            Edit this entry:
          </Typography>

          <PasswordAdder
            endpoint="changePassword"
            addCallback={handleAddCallback}
          />
        </Box>
      </Modal>

      <Modal open={showDeletePop}>
        <Box sx={popupStyle} alignItems="center">
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            style={{ color: "#404040" }}
          >
            Are you sure you want to delete this entry?
          </Typography>

          <Button
            color="primary"
            onClick={() => {
              deleteEntry(selectedSite);
              setShowDeletePop(false);
            }}
          >
            Yes
          </Button>

          <Button color="error" onClick={() => setShowDeletePop(false)}>
            No
          </Button>
        </Box>
      </Modal>

      <LoginPrompt open={!loggedIn} />
      <Modal
        open={!authenticated}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ textAlign: "center" }}
          >
            Please Enter Your Vault Passphrase to Access
          </Typography>
          <TextField
            id="modal-modal-description"
            sx={{ mt: 2 }}
            margin="normal"
            required
            fullWidth
            label="Passphrase"
            name="passphrase"
            autoComplete="passphrase"
            autoFocus
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            helperText={errorMsg}
            error={isPassWrong}
          />
          <Box sx={{ mt: 3, mb: 2, display: "flex" }}>
            <Button
              type="submit"
              variant="contained"
              onClick={getAllSites}
              sx={{ flex: 4, m: 2 }}
            >
              Enter
            </Button>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              sx={{ flex: 4, m: 2 }}
              onClick={() => {
                navigate("/");
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        style={{ color: "#404040" }}
      >
        Search for a login:
      </Typography>
      <Autocomplete
        autoComplete={true}
        autoHighlight={true}
        autoSelect={true}
        id="logins"
        options={savedSites}
        getOptionLabel={(option) => option}
        sx={{ width: 300 }}
        onChange={(event, value, reason) => {
          setValidInput(true);
          setRevealed(false);
          setSelectedSite({ label: value, username: "", password: "" });
        }}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option}
            <Box sx={{ marginLeft: "auto" }}>
              <IconButton color="primary" onClick={() => setShowEditPop(true)}>
                <EditIcon />
              </IconButton>

              <IconButton color="error" onClick={() => setShowDeletePop(true)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Login" variant="standard" />
        )}
      />
      <Box
        sx={{
          display: "flex",
          //flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          onClick={() => revealPassword(selectedSite)}
          disabled={!validInput}
          variant={validInput ? "contained" : "outlined"}
          sx={{ mt: 2, mb: 2, mr: 2 }}
        >
          Reveal
        </Button>

        <Button
          onClick={() => setShowDeletePop(true)}
          disabled={!validInput}
          variant={validInput ? "contained" : "outlined"}
          sx={{ mt: 2, mb: 2 }}
        >
          Delete This Entry
        </Button>
      </Box>
      {revealed ? (
        <Box alignItems={"center"} sx={{ ml: "auto", mr: "auto", mt: 4 }}>
          <Grid container spacing={1} columns={4}>
            <Grid item xs={1}></Grid>
            <Grid item xs={1}>
              <Typography>Website:</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>{selectedSite.label}</Typography>
            </Grid>

            <Grid item xs={1}></Grid>
            <Grid item xs={1}>
              <Typography>Username:</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>{selectedSite.username}</Typography>
            </Grid>

            <Grid item xs={1}></Grid>
            <Grid item xs={1}>
              <Typography>Password:</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography>{selectedSite.password}</Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                onClick={() =>
                  navigator.clipboard.writeText(selectedSite.password)
                }
              >
                <ContentCopyIcon sx={{ fontSize: 15 }}></ContentCopyIcon>
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </Box>
  );
}

// const savedSites = [
//   { label: "Google", password: "www.Google.com" },
//   { label: "Facebook", password: "www.Facebook.com" },
//   { label: "Instagram", password: "www.Instagram.com" },
//   { label: "Firefox", password: "www.Firefox.com" },
//   { label: "Snapchat", password: "www.Snapchat.com" },
//   { label: "Reddit", password: "www.Reddit.com" },
//   { label: "D2L", password: "www.D2L.com" },
//   { label: "ucalgary", password: "www.ucalgary.ca" },
//   { label: "Miniclip", password: "www.miniclip.com" },
//   { label: "Cool Math Games", password: "www.Cool Math Games.com" },
// ];
