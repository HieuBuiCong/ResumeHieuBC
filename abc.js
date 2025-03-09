import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, InputBase, Menu, MenuItem, Avatar } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from "@mui/icons-material/AddBox";
import ManageIcon from "@mui/icons-material/ListAlt";
import ArchiveIcon from "@mui/icons-material/Archive";

// 🔹 Styled search bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: "auto",
  width: "30%",
  padding: "5px 10px",
  borderRadius: "20px",
  border: "1px solid lightgray",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
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
  // 🔹 Profile menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.7)", // ✅ Slightly transparent white background
        backdropFilter: "blur(10px)", // ✅ Add blur effect for modern glassmorphism
        boxShadow: "none",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)", // ✅ Softer border
      }}
    >
      <Container>
        <Toolbar className="d-flex justify-content-between">
          {/* 🔹 Company Logo / Name */}
          <Navbar.Brand className="fw-bold fs-4">My Company</Navbar.Brand>

          {/* 🔹 Navigation Links with Hover Dropdown */}
          <Nav className="me-auto">
            <Nav.Link href="#" className="fw-semibold px-3">Add</Nav.Link>

            <NavDropdown title="Projects" id="projects-dropdown" className="fw-semibold px-3" showOnHover>
              <NavDropdown.Item href="#" className="d-flex align-items-center">
                <CreateIcon className="me-2 text-success" />
                <div>
                  <strong>Create</strong>
                  <div className="small text-muted">New project</div>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item href="#" className="d-flex align-items-center">
                <ManageIcon className="me-2 text-primary" />
                <div>
                  <strong>Manage</strong>
                  <div className="small text-muted">Manage projects</div>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item href="#" className="d-flex align-items-center">
                <ArchiveIcon className="me-2 text-danger" />
                <div>
                  <strong>Archive</strong>
                  <div className="small text-muted">All archived projects</div>
                </div>
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#" className="fw-semibold px-3">Clients</Nav.Link>
            <Nav.Link href="#" className="fw-semibold px-3">Employees</Nav.Link>
            <Nav.Link href="#" className="fw-semibold px-3">Company</Nav.Link>
          </Nav>

          {/* 🔹 Search Bar */}
          <Search className="d-none d-md-block">
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" />
          </Search>

          {/* 🔹 Profile Avatar */}
          <IconButton onClick={handleMenuClick} color="inherit">
            <Avatar alt="User" src="https://mui.com/static/images/avatar/1.jpg" />
          </IconButton>

          {/* 🔹 Profile Dropdown Menu */}
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Dark Theme</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose} className="text-danger">Logout</MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

// 🔹 Enable hover dropdown
NavDropdown.defaultProps = { autoClose: "outside" };
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".nav-item.dropdown").forEach((item) => {
    item.addEventListener("mouseover", function () {
      const dropdown = this.querySelector(".dropdown-menu");
      if (dropdown) dropdown.classList.add("show");
    });
    item.addEventListener("mouseleave", function () {
      const dropdown = this.querySelector(".dropdown-menu");
      if (dropdown) dropdown.classList.remove("show");
    });
  });
});

export default MyNavbar;