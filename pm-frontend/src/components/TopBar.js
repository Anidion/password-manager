import * as React from "react";
import {
  AppBar,
  Drawer,
  Box,
  Toolbar,
  Typography,
  Button,
  ListItem,
  ListItemText,
  ListItemButton,
  List,
  Link,
} from "@mui/material";
// import { Link as RouterLink } from "react-router-dom";

import { FiMenu } from "react-icons/fi";

export default function TopBar() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: "darkcyan" }}>
          <nav className="navBar">
            <Button onClick={toggleDrawer("left", true)}>
              <FiMenu
                style={{ color: "#fff", width: "40px", height: "40px" }}
              />
            </Button>
          </nav>
          <Typography
            variant="h6"
            component="div"
            align="center"
            sx={{ flexGrow: 1 }}
          >
            <Link href="/" style={{ color: "white" }}>
              Password Manager
            </Link>
          </Typography>
          <Button color="inherit" href="/signin">
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <div>
        <React.Fragment key={"left"}>
          <Drawer
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
          >
            <List>
              <ListItem className="filler"></ListItem>
              <ListItemButton component="a" href="/">
                <ListItemText primary="Home" />
              </ListItemButton>
              <ListItemButton component="a" href="/vault">
                <ListItemText primary="Vault" />
              </ListItemButton>
              <ListItemButton component="a" href="/generator">
                <ListItemText primary="Password Generator" />
              </ListItemButton>
            </List>
          </Drawer>
        </React.Fragment>
      </div>
    </Box>
  );
}
