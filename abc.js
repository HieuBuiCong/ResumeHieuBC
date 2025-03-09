import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  Switch,
} from "@mui/material";
import { styled, alpha, ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, Nav, Navbar, Popper, Paper, Grow, ClickAwayListener } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ArchiveIcon from "@mui/icons-material/Archive";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import NightlightIcon from "@mui/icons-material/Nightlight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LightModeIcon from "@mui/icons-material/LightMode";

// ✅ Modern Search Bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "25px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: "auto",
  width: "30%",
  padding: "5px 15px",
  border: `1px solid ${alpha(theme.palette.common.white, 0.4)}`,
  boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.1)",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
}));

const MyNavbar = () => {
  // 🔹 Dark mode state
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  // 🔹 Profile menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // 🔹 Hover dropdown states
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projectsAnchor, setProjectsAnchor] = useState(null);

  // 🔹 Handle Dark Mode Toggle
  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
    localStorage.setItem("darkMode", !darkMode);
  };

  // 🔹 Load Dark Mode from localStorage
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#f8f9fa";
  }, [darkMode]);

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
            ? "linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6))"
            : "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))", // ✅ Glassmorphism
          backdropFilter: "blur(10px)",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          borderBottom: darkMode ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Container>
          <Toolbar className="d-flex justify-content-between">
            {/* 🔹 Company Logo */}
            <Navbar.Brand className="fw-bold fs-4 d-flex align-items-center text-white">
              <HomeIcon className="me-2 text-primary" />
              My Company
            </Navbar.Brand>

            {/* 🔹 Navigation Links */}
            <Nav className="me-auto d-flex align-items-center">
              <Nav.Link href="#" className="fw-semibold px-3 text-white">Add</Nav.Link>

              {/* 🔹 Projects Dropdown with Hover */}
              <div
                onMouseEnter={(e) => {
                  setProjectsAnchor(e.currentTarget);
                  setProjectsOpen(true);
                }}
                onMouseLeave={() => setProjectsOpen(false)}
                className="fw-semibold px-3 d-flex align-items-center text-white"
                style={{ cursor: "pointer" }}
              >
                <WorkIcon className="me-1 text-warning" />
                Projects <ExpandMoreIcon />
                <Popper open={projectsOpen} anchorEl={projectsAnchor} transition>
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps} style={{ transformOrigin: "top center" }}>
                      <Paper elevation={6} className="shadow-lg rounded-lg">
                        <ClickAwayListener onClickAway={() => setProjectsOpen(false)}>
                          <Menu open={projectsOpen} className="p-2">
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
                          </Menu>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>

              <Nav.Link href="#" className="fw-semibold px-3 text-white">
                <GroupIcon className="me-1 text-success" />
                Employees
              </Nav.Link>
              <Nav.Link href="#" className="fw-semibold px-3 text-white">
                <BusinessIcon className="me-1 text-danger" />
                Company
              </Nav.Link>
            </Nav>

            {/* 🔹 Search Bar */}
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" />
            </Search>

            {/* 🔹 Dark Mode Toggle */}
            <IconButton onClick={handleDarkModeToggle} color="inherit">
              {darkMode ? <LightModeIcon /> : <NightlightIcon />}
            </IconButton>

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