import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, InputBase, Menu, MenuItem, Avatar } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import CreateIcon from "@mui/icons-material/AddBox";
import ManageIcon from "@mui/icons-material/ListAlt";
import ArchiveIcon from "@mui/icons-material/Archive";

// Styled components for search bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: "auto",
  width: "30%",
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
  // Profile menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="default">
      <Container>
        <Toolbar className="d-flex justify-content-between">
          {/* Company Name */}
          <Navbar.Brand className="fw-bold">My Company</Navbar.Brand>

          {/* Navigation Links with Dropdown */}
          <Nav className="me-auto">
            <Nav.Link href="#">Add</Nav.Link>

            <NavDropdown title="Projects" id="projects-dropdown">
              <NavDropdown.Item href="#">
                <CreateIcon className="me-2 text-success" /> Create
                <div className="small text-muted">Create a new project</div>
              </NavDropdown.Item>
              <NavDropdown.Item href="#">
                <ManageIcon className="me-2 text-primary" /> Manage
                <div className="small text-muted">Manage projects</div>
              </NavDropdown.Item>
              <NavDropdown.Item href="#">
                <ArchiveIcon className="me-2 text-danger" /> Archive
                <div className="small text-muted">Manage all archived projects</div>
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#">Clients</Nav.Link>
            <Nav.Link href="#">Employees</Nav.Link>
            <Nav.Link href="#">Company</Nav.Link>
          </Nav>

          {/* Search Bar */}
          <Search className="d-none d-md-block">
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" />
          </Search>

          {/* Profile Menu */}
          <IconButton onClick={handleMenuClick} color="inherit">
            <Avatar alt="Profile" src="https://mui.com/static/images/avatar/1.jpg" />
          </IconButton>

          {/* Dropdown Menu */}
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

export default MyNavbar;