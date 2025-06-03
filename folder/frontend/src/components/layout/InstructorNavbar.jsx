import React from 'react';
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InstructorNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/instructor/dashboard">Instructor Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/instructor/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/instructor/courses">My Courses</Nav.Link>
            <Nav.Link as={Link} to="/instructor/add-course">Add Course</Nav.Link>
            <Nav.Link as={Link} to="/instructor/students">Students</Nav.Link>
            <Nav.Link as={Link} to="/instructor/earnings">Earnings</Nav.Link>
            <Nav.Link as={Link} to="/instructor/profile">
              <i className="fas fa-user me-1"></i>
              Profile
            </Nav.Link>
          </Nav>
          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                {user?.email}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default InstructorNavbar;