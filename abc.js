import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  Switch,
  ClickAwayListener,
  Box,
  InputBase,
} from "@mui/material";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, Nav } from "react-bootstrap";
import WorkIcon from "@mui/icons-material/Work";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ArchiveIcon from "@mui/icons-material/Archive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const MyNavbar = () => {
  // 🔹 Dark mode state
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  // 🔹 Profile menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // 🔹 Hover dropdown states
  const [projectsOpen, setProjectsOpen] = useState(false);

  // 🔹 Search bar state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Handle Dark Mode Toggle
  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
    localStorage.setItem("darkMode", !darkMode);
  };

  // 🔹 Define Light & Dark Themes
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#90caf9" : "#1976d2" },
      background: { default: darkMode ? "#121212" : "#f8f9fa" },
      text: { primary: darkMode ? "#ffffff" : "#000000" },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        sx={{
          background: darkMode
            ? "rgba(0,0,0,0.7)"
            : "rgba(255,255,255,0.7)", // ✅ Glassmorphism
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          borderBottom: darkMode ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Container>
          <Toolbar className="d-flex justify-content-between">
            {/* 🔹 Company Logo */}
            <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }}>
              <BusinessIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              My Company
            </Typography>

            {/* 🔹 Navigation Links */}
            <Nav className="me-auto d-flex align-items-center">
              <Nav.Link href="#" className="fw-semibold px-3 text-white">Add</Nav.Link>

              {/* 🔹 Projects Dropdown with Hover */}
              <Box
                sx={{ position: "relative" }}
                onMouseEnter={() => setProjectsOpen(true)}
                onMouseLeave={() => setProjectsOpen(false)}
              >
                <Nav.Link
                  className="fw-semibold px-3 d-flex align-items-center text-white"
                  style={{ cursor: "pointer" }}
                >
                  <WorkIcon className="me-1 text-warning" />
                  Projects <ExpandMoreIcon />
                </Nav.Link>

                {projectsOpen && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      zIndex: 10,
                      backgroundColor: darkMode ? "#333" : "white",
                      color: darkMode ? "white" : "black",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                      borderRadius: "5px",
                      padding: "10px",
                      width: "200px",
                    }}
                  >
                    <MenuItem>
                      <AddBoxIcon className="me-2 text-success" />
                      <Typography>Create Project</Typography>
                    </MenuItem>
                    <MenuItem>
                      <ListAltIcon className="me-2 text-primary" />
                      <Typography>Manage Projects</Typography>
                    </MenuItem>
                    <MenuItem>
                      <ArchiveIcon className="me-2 text-danger" />
                      <Typography>Archived Projects</Typography>
                    </MenuItem>
                  </Box>
                )}
              </Box>

              <Nav.Link href="#" className="fw-semibold px-3 text-white">
                <PeopleIcon className="me-2 text-primary" />
                Employees
              </Nav.Link>
            </Nav>

            {/* 🔹 Search Bar */}
            {searchOpen ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: darkMode ? "#333" : "#fff",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                <InputBase
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ flexGrow: 1, color: darkMode ? "white" : "black", paddingLeft: "10px" }}
                />
                <IconButton onClick={() => setSearchOpen(false)} sx={{ color: "white" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <IconButton onClick={() => setSearchOpen(true)} sx={{ color: "white", mx: 2 }}>
                <SearchIcon />
              </IconButton>
            )}

            {/* 🔹 Dark Mode Toggle */}
            <Switch checked={darkMode} onChange={handleDarkModeToggle} color="default" />

            {/* 🔹 Profile Avatar */}
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
              <Avatar alt="User" src="https://mui.com/static/images/avatar/1.jpg" />
            </IconButton>

            {/* 🔹 Profile Dropdown */}
            <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
              <MenuItem>
                <AccountCircleIcon className="me-2" /> Profile
              </MenuItem>
              <MenuItem>
                <SettingsIcon className="me-2" /> Settings
              </MenuItem>
              <Divider />
              <MenuItem className="text-danger">
                <LogoutIcon className="me-2" /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default MyNavbar;